import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { incrementExecute } from '@/lib/counters';

const JUDGE0_URL = 'https://ce.judge0.com/submissions?base64_encoded=true&wait=true';

const JUDGE0_LANG: Record<string, number> = {
  python: 71,
  javascript: 63,
  java: 62,
  cpp: 54,
};

function b64e(str: string): string { return Buffer.from(str || '').toString('base64'); }
function b64d(str: string | null | undefined): string { return str ? Buffer.from(str, 'base64').toString('utf-8') : ''; }

const PY_LINKED_LIST_HELPERS = `
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def __arr_to_list(arr):
    if not arr: return None
    head = ListNode(arr[0])
    cur = head
    for v in arr[1:]:
        cur.next = ListNode(v)
        cur = cur.next
    return head

def __list_to_arr(node):
    res = []
    while node:
        res.append(node.val)
        node = node.next
    return res
`;

const JS_LINKED_LIST_HELPERS = `
function ListNode(val, next) { this.val = val === undefined ? 0 : val; this.next = next === undefined ? null : next; }
function __arrToList(arr) {
  if (!arr || !arr.length) return null;
  const head = new ListNode(arr[0]);
  let cur = head;
  for (let i = 1; i < arr.length; i++) { cur.next = new ListNode(arr[i]); cur = cur.next; }
  return head;
}
function __listToArr(node) {
  const res = [];
  while (node) { res.push(node.val); node = node.next; }
  return res;
}
`;

const PY_TREE_HELPERS = `
from collections import deque as __deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def __arr_to_tree(arr):
    if not arr: return None
    root = TreeNode(arr[0])
    queue = __deque([root])
    i = 1
    while queue and i < len(arr):
        node = queue.popleft()
        if i < len(arr) and arr[i] is not None:
            node.left = TreeNode(arr[i])
            queue.append(node.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            node.right = TreeNode(arr[i])
            queue.append(node.right)
        i += 1
    return root
`;

const JS_TREE_HELPERS = `
function TreeNode(val, left, right) { this.val = val === undefined ? 0 : val; this.left = left === undefined ? null : left; this.right = right === undefined ? null : right; }
function __arrToTree(arr) {
  if (!arr || !arr.length) return null;
  const root = new TreeNode(arr[0]);
  const queue = [root];
  let i = 1;
  while (queue.length && i < arr.length) {
    const node = queue.shift();
    if (i < arr.length && arr[i] !== null && arr[i] !== undefined) { node.left = new TreeNode(arr[i]); queue.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null && arr[i] !== undefined) { node.right = new TreeNode(arr[i]); queue.push(node.right); }
    i++;
  }
  return root;
}
`;

interface TestCase {
  args: unknown[];
  expected: unknown;
  label: string;
  isEdgeCase?: boolean;
}

interface ProblemTest {
  func: { py: string; js: string };
  cases: TestCase[];
  linkedList?: boolean;
  binaryTree?: boolean;
}

const PROBLEM_TESTS: Record<string, ProblemTest> = {
  two_sum: {
    func: { py: 'twoSum', js: 'twoSum' },
    cases: [
      { args: [[2,7,11,15], 9],   expected: [0,1], label: 'nums=[2,7,11,15], target=9' },
      { args: [[3,2,4], 6],       expected: [1,2], label: 'nums=[3,2,4], target=6' },
      { args: [[3,3], 6],         expected: [0,1], label: 'nums=[3,3], target=6', isEdgeCase: true },
    ],
  },
  longest_substring: {
    func: { py: 'lengthOfLongestSubstring', js: 'lengthOfLongestSubstring' },
    cases: [
      { args: ['abcabcbb'], expected: 3, label: 's="abcabcbb"' },
      { args: ['bbbbb'],    expected: 1, label: 's="bbbbb"' },
      { args: ['pwwkew'],   expected: 3, label: 's="pwwkew"' },
      { args: [''],         expected: 0, label: 's=""', isEdgeCase: true },
    ],
  },
  valid_parentheses: {
    func: { py: 'isValid', js: 'isValid' },
    cases: [
      { args: ['()'],     expected: true,  label: 's="()"' },
      { args: ['()[]{}'], expected: true,  label: 's="()[]{}"' },
      { args: ['(]'],     expected: false, label: 's="(]"' },
      { args: ['{[]}'],   expected: true,  label: 's="{[]}"' },
      { args: [''],       expected: true,  label: 's=""', isEdgeCase: true },
    ],
  },
  binary_search: {
    func: { py: 'search', js: 'search' },
    cases: [
      { args: [[-1,0,3,5,9,12], 9],  expected: 4,  label: 'nums=[-1,0,3,5,9,12], target=9' },
      { args: [[-1,0,3,5,9,12], 2],  expected: -1, label: 'nums=[-1,0,3,5,9,12], target=2' },
      { args: [[5], 5],              expected: 0,  label: 'nums=[5], target=5', isEdgeCase: true },
    ],
  },
  maximum_subarray: {
    func: { py: 'maxSubArray', js: 'maxSubArray' },
    cases: [
      { args: [[-2,1,-3,4,-1,2,1,-5,4]], expected: 6,  label: 'nums=[-2,1,-3,4,-1,2,1,-5,4]' },
      { args: [[1]],                      expected: 1,  label: 'nums=[1]' },
      { args: [[5,4,-1,7,8]],             expected: 23, label: 'nums=[5,4,-1,7,8]' },
      { args: [[-1,-2,-3,-4]],            expected: -1, label: 'nums=[-1,-2,-3,-4]', isEdgeCase: true },
    ],
  },
  climbing_stairs: {
    func: { py: 'climbStairs', js: 'climbStairs' },
    cases: [
      { args: [1],  expected: 1,  label: 'n=1', isEdgeCase: true },
      { args: [2],  expected: 2,  label: 'n=2' },
      { args: [3],  expected: 3,  label: 'n=3' },
      { args: [10], expected: 89, label: 'n=10' },
    ],
  },
  merge_intervals: {
    func: { py: 'merge', js: 'merge' },
    cases: [
      { args: [[[1,3],[2,6],[8,10],[15,18]]], expected: [[1,6],[8,10],[15,18]], label: '[[1,3],[2,6],[8,10],[15,18]]' },
      { args: [[[1,4],[4,5]]],               expected: [[1,5]],               label: '[[1,4],[4,5]]', isEdgeCase: true },
      { args: [[[1,1]]],                     expected: [[1,1]],               label: '[[1,1]]' },
    ],
  },
  number_of_islands: {
    func: { py: 'numIslands', js: 'numIslands' },
    cases: [
      { args: [[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]], expected: 1, label: '4x5 grid (1 island)' },
      { args: [[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]], expected: 3, label: '4x5 grid (3 islands)' },
      { args: [[["1"]]],                                                                                   expected: 1, label: '1x1 land' },
      { args: [[["0","0"],["0","0"]]],                                                                     expected: 0, label: 'all-water 2x2 grid', isEdgeCase: true },
    ],
  },
  reverse_linked_list: {
    func: { py: 'reverseList', js: 'reverseList' },
    cases: [
      { args: [[1,2,3,4,5]], expected: [5,4,3,2,1], label: 'head=[1,2,3,4,5]' },
      { args: [[1,2]],       expected: [2,1],       label: 'head=[1,2]' },
      { args: [[]],          expected: [],           label: 'head=[]' },
      { args: [[1]],         expected: [1],          label: 'head=[1]', isEdgeCase: true },
    ],
    linkedList: true,
  },
  binary_tree_level_order: {
    func: { py: 'levelOrder', js: 'levelOrder' },
    cases: [
      { args: [[3,9,20,null,null,15,7]], expected: [[3],[9,20],[15,7]], label: 'root=[3,9,20,null,null,15,7]' },
      { args: [[1]],                     expected: [[1]],              label: 'root=[1]' },
      { args: [[]],                      expected: [],                 label: 'root=[]', isEdgeCase: true },
    ],
    binaryTree: true,
  },
};

function buildPythonHarness(
  userCode: string,
  funcName: string,
  cases: TestCase[],
  opts: { linkedList?: boolean; binaryTree?: boolean } = {}
): string {
  const { linkedList, binaryTree } = opts;
  let helpers = '';
  let preprocess = '';
  let postprocess = '';

  if (linkedList) {
    helpers = PY_LINKED_LIST_HELPERS;
    preprocess = '        __a[0] = __arr_to_list(__a[0])';
    postprocess = '        __r = __list_to_arr(__r)';
  } else if (binaryTree) {
    helpers = PY_TREE_HELPERS;
    preprocess = '        __a[0] = __arr_to_tree(__a[0])';
  }

  const casesB64 = Buffer.from(JSON.stringify(
    cases.map(c => ({ args: c.args, expected: c.expected, label: c.label }))
  )).toString('base64');

  return `import json as __j
import copy as __cp
import sys as __sys
import io as __io
import base64 as __b64
${helpers}
__old_stdout = __sys.stdout
__sys.stdout = __io.StringIO()

${userCode}

__tests = __j.loads(__b64.b64decode('${casesB64}').decode())
__out = []
for __t in __tests:
    try:
        __a = __cp.deepcopy(__t['args'])
${preprocess}
        __r = ${funcName}(*__a)
${postprocess}
        __p = __r == __t['expected']
        __out.append({'p': __p, 'r': __r, 'e': __t['expected'], 'l': __t['label']})
    except Exception as __ex:
        __out.append({'p': False, 'err': str(__ex), 'e': __t['expected'], 'l': __t['label']})

__sys.stdout = __old_stdout
print(__j.dumps(__out))`;
}

function buildJSHarness(
  userCode: string,
  funcName: string,
  cases: TestCase[],
  opts: { linkedList?: boolean; binaryTree?: boolean } = {}
): string {
  const { linkedList, binaryTree } = opts;
  let helpers = '';
  let preprocess = '';
  let postprocess = '';

  if (linkedList) {
    helpers = JS_LINKED_LIST_HELPERS;
    preprocess = '    __a[0] = __arrToList(__a[0]);';
    postprocess = '    __r = __listToArr(__r);';
  } else if (binaryTree) {
    helpers = JS_TREE_HELPERS;
    preprocess = '    __a[0] = __arrToTree(__a[0]);';
  }

  const casesJson = JSON.stringify(
    cases.map(c => ({ args: c.args, expected: c.expected, label: c.label }))
  );

  return `${helpers}
const __logs = [];
const __origLog = console.log;
console.log = (...__args) => __logs.push(__args.join(' '));

${userCode}

console.log = __origLog;

const __tests = ${casesJson};
const __out = __tests.map(__t => {
  try {
    const __a = JSON.parse(JSON.stringify(__t.args));
${preprocess}
    let __r = ${funcName}(...__a);
${postprocess}
    const __p = JSON.stringify(__r) === JSON.stringify(__t.expected);
    return { p: __p, r: __r, e: __t.expected, l: __t.label };
  } catch(__ex) {
    return { p: false, err: __ex.message, e: __t.expected, l: __t.label };
  }
});
console.log(JSON.stringify(__out));`;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: { code?: string; language?: string; problemId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { code, language, problemId } = body;

  if (!code || !language) {
    return NextResponse.json({ error: 'code and language are required' }, { status: 400 });
  }

  const langId = JUDGE0_LANG[language];
  if (!langId) {
    return NextResponse.json({ error: `Unsupported language: ${language}` }, { status: 400 });
  }

  const testData = problemId ? PROBLEM_TESTS[problemId] : null;
  let runCode = code;
  let hasTestHarness = false;

  if (testData && (language === 'python' || language === 'javascript')) {
    const funcName = language === 'python' ? testData.func.py : testData.func.js;
    const opts = { linkedList: !!testData.linkedList, binaryTree: !!testData.binaryTree };
    runCode = language === 'python'
      ? buildPythonHarness(code, funcName, testData.cases, opts)
      : buildJSHarness(code, funcName, testData.cases, opts);
    hasTestHarness = true;
  }

  try {
    const response = await axios.post(JUDGE0_URL, {
      source_code: b64e(runCode),
      language_id: langId,
    }, { headers: { 'Content-Type': 'application/json' }, timeout: 20000 });

    incrementExecute();
    const data = response.data;
    const stdout = b64d(data.stdout);
    const stderr = b64d(data.stderr);
    const compileOut = b64d(data.compile_output);

    if (compileOut) {
      return NextResponse.json({ type: 'raw', stdout: '', stderr: compileOut });
    }

    if (hasTestHarness && stdout.trim()) {
      try {
        const testResults = JSON.parse(stdout.trim());
        if (Array.isArray(testResults)) {
          const passed = testResults.filter((r: { p: boolean }) => r.p).length;
          const enriched = testResults.map((r: object, i: number) => ({
            ...r,
            isEdgeCase: !!(testData!.cases[i] && testData!.cases[i].isEdgeCase),
          }));
          return NextResponse.json({ type: 'test', testResults: enriched, passed, total: enriched.length, stderr });
        }
      } catch (_) { /* fall through to raw output */ }
    }

    return NextResponse.json({ type: 'raw', stdout, stderr });
  } catch (err) {
    console.error('Execute error:', (err as Error).message);
    return NextResponse.json({ error: 'Code execution unavailable. Try again in a moment.' }, { status: 503 });
  }
}
