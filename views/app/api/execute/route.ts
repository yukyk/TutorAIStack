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
  linkedListInputOnly?: boolean;
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
  contains_duplicate: {
    func: { py: 'containsDuplicate', js: 'containsDuplicate' },
    cases: [
      { args: [[1,2,3,1]],               expected: true,  label: 'nums=[1,2,3,1]' },
      { args: [[1,2,3,4]],               expected: false, label: 'nums=[1,2,3,4]' },
      { args: [[1,1,1,3,3,4,3,2,4,2]],   expected: true,  label: 'nums=[1,1,1,3,3,4,3,2,4,2]' },
      { args: [[1]],                     expected: false, label: 'nums=[1]', isEdgeCase: true },
    ],
  },
  maximum_depth_binary_tree: {
    func: { py: 'maxDepth', js: 'maxDepth' },
    cases: [
      { args: [[3,9,20,null,null,15,7]], expected: 3, label: 'root=[3,9,20,null,null,15,7]' },
      { args: [[1,null,2]],              expected: 2, label: 'root=[1,null,2]' },
      { args: [[]],                      expected: 0, label: 'root=[]', isEdgeCase: true },
    ],
    binaryTree: true,
  },
  linked_list_cycle: {
    func: { py: 'hasCycle', js: 'hasCycle' },
    cases: [
      { args: [[1,2,3]], expected: false, label: 'no cycle [1,2,3]' },
      { args: [[1]],     expected: false, label: 'no cycle [1]' },
      { args: [[]],      expected: false, label: 'empty list []', isEdgeCase: true },
    ],
    linkedListInputOnly: true,
  },
  find_minimum_rotated: {
    func: { py: 'findMin', js: 'findMin' },
    cases: [
      { args: [[3,4,5,1,2]],     expected: 1,  label: 'nums=[3,4,5,1,2]' },
      { args: [[4,5,6,7,0,1,2]], expected: 0,  label: 'nums=[4,5,6,7,0,1,2]' },
      { args: [[11,13,15,17]],   expected: 11, label: 'nums=[11,13,15,17]' },
      { args: [[1]],             expected: 1,  label: 'nums=[1]', isEdgeCase: true },
    ],
  },
  product_except_self: {
    func: { py: 'productExceptSelf', js: 'productExceptSelf' },
    cases: [
      { args: [[1,2,3,4]],       expected: [24,12,8,6], label: 'nums=[1,2,3,4]' },
      { args: [[-1,1,0,-3,3]],   expected: [0,0,9,0,0], label: 'nums=[-1,1,0,-3,3]' },
      { args: [[0,0]],           expected: [0,0],        label: 'nums=[0,0]', isEdgeCase: true },
    ],
  },
  valid_anagram: {
    func: { py: 'isAnagram', js: 'isAnagram' },
    cases: [
      { args: ['anagram', 'nagaram'], expected: true,  label: 's="anagram", t="nagaram"' },
      { args: ['rat',     'car'],     expected: false, label: 's="rat", t="car"' },
      { args: ['a',       'a'],       expected: true,  label: 's="a", t="a"', isEdgeCase: true },
    ],
  },
  best_time_to_buy_sell_stock: {
    func: { py: 'maxProfit', js: 'maxProfit' },
    cases: [
      { args: [[7,1,5,3,6,4]], expected: 5, label: 'prices=[7,1,5,3,6,4]' },
      { args: [[7,6,4,3,1]],   expected: 0, label: 'prices=[7,6,4,3,1]' },
      { args: [[1]],           expected: 0, label: 'prices=[1]', isEdgeCase: true },
    ],
  },
  missing_number: {
    func: { py: 'missingNumber', js: 'missingNumber' },
    cases: [
      { args: [[3,0,1]],             expected: 2, label: 'nums=[3,0,1]' },
      { args: [[9,6,4,2,3,5,7,0,1]], expected: 8, label: 'nums=[9,6,4,2,3,5,7,0,1]' },
      { args: [[0]],                 expected: 1, label: 'nums=[0]', isEdgeCase: true },
    ],
  },
  palindrome_number: {
    func: { py: 'isPalindrome', js: 'isPalindrome' },
    cases: [
      { args: [121],  expected: true,  label: 'x=121' },
      { args: [-121], expected: false, label: 'x=-121' },
      { args: [0],    expected: true,  label: 'x=0', isEdgeCase: true },
    ],
  },
  fizz_buzz: {
    func: { py: 'fizzBuzz', js: 'fizzBuzz' },
    cases: [
      { args: [3], expected: ['1','2','Fizz'],             label: 'n=3' },
      { args: [5], expected: ['1','2','Fizz','4','Buzz'],  label: 'n=5' },
      { args: [1], expected: ['1'],                        label: 'n=1', isEdgeCase: true },
    ],
  },
  invert_binary_tree: {
    func: { py: 'invertTree', js: 'invertTree' },
    cases: [],
    binaryTree: true,
  },
  symmetric_tree: {
    func: { py: 'isSymmetric', js: 'isSymmetric' },
    cases: [
      { args: [[1,2,2,3,4,4,3]],      expected: true,  label: 'root=[1,2,2,3,4,4,3]' },
      { args: [[1,2,2,null,3,null,3]], expected: false, label: 'root=[1,2,2,null,3,null,3]' },
      { args: [[1]],                   expected: true,  label: 'root=[1]', isEdgeCase: true },
    ],
    binaryTree: true,
  },
  path_sum: {
    func: { py: 'hasPathSum', js: 'hasPathSum' },
    cases: [
      { args: [[5,4,8,11,null,13,4,7,2,null,null,null,1], 22], expected: true,  label: 'root=[5,4,8,...], targetSum=22' },
      { args: [[1,2,3], 5],                                    expected: false, label: 'root=[1,2,3], targetSum=5' },
      { args: [[], 0],                                         expected: false, label: 'root=[], targetSum=0', isEdgeCase: true },
    ],
    binaryTree: true,
  },
  merge_two_sorted_lists: {
    func: { py: 'mergeTwoLists', js: 'mergeTwoLists' },
    cases: [],
    linkedList: true,
  },
  remove_duplicates_sorted_array: {
    func: { py: 'removeDuplicates', js: 'removeDuplicates' },
    cases: [
      { args: [[1,1,2]],               expected: 2, label: 'nums=[1,1,2]' },
      { args: [[0,0,1,1,1,2,2,3,3,4]], expected: 5, label: 'nums=[0,0,1,1,1,2,2,3,3,4]' },
      { args: [[1]],                   expected: 1, label: 'nums=[1]', isEdgeCase: true },
    ],
  },
  move_zeroes: {
    func: { py: 'moveZeroes', js: 'moveZeroes' },
    cases: [
      { args: [[0,1,0,3,12]], expected: [1,3,12,0,0], label: 'nums=[0,1,0,3,12]' },
      { args: [[0]],          expected: [0],           label: 'nums=[0]' },
      { args: [[1]],          expected: [1],           label: 'nums=[1]', isEdgeCase: true },
    ],
  },
  three_sum: {
    func: { py: 'threeSum', js: 'threeSum' },
    cases: [
      { args: [[-1,0,1,2,-1,-4]], expected: [[-1,-1,2],[-1,0,1]], label: 'nums=[-1,0,1,2,-1,-4]' },
      { args: [[0,1,1]],          expected: [],                    label: 'nums=[0,1,1]' },
      { args: [[0,0,0]],          expected: [[0,0,0]],             label: 'nums=[0,0,0]', isEdgeCase: true },
    ],
  },
  container_with_most_water: {
    func: { py: 'maxArea', js: 'maxArea' },
    cases: [
      { args: [[1,8,6,2,5,4,8,3,7]], expected: 49, label: 'height=[1,8,6,2,5,4,8,3,7]' },
      { args: [[1,1]],               expected: 1,  label: 'height=[1,1]' },
      { args: [[4,3,2,1,4]],         expected: 16, label: 'height=[4,3,2,1,4]', isEdgeCase: true },
    ],
  },
  longest_common_subsequence: {
    func: { py: 'longestCommonSubsequence', js: 'longestCommonSubsequence' },
    cases: [
      { args: ['abcde', 'ace'], expected: 3, label: 'text1="abcde", text2="ace"' },
      { args: ['abc',   'abc'], expected: 3, label: 'text1="abc", text2="abc"' },
      { args: ['abc',   'def'], expected: 0, label: 'text1="abc", text2="def"', isEdgeCase: true },
    ],
  },
  house_robber: {
    func: { py: 'rob', js: 'rob' },
    cases: [
      { args: [[1,2,3,1]],   expected: 4,  label: 'nums=[1,2,3,1]' },
      { args: [[2,7,9,3,1]], expected: 12, label: 'nums=[2,7,9,3,1]' },
      { args: [[1]],         expected: 1,  label: 'nums=[1]', isEdgeCase: true },
    ],
  },
  coin_change: {
    func: { py: 'coinChange', js: 'coinChange' },
    cases: [
      { args: [[1,2,5], 11], expected: 3,  label: 'coins=[1,2,5], amount=11' },
      { args: [[2],     3],  expected: -1, label: 'coins=[2], amount=3' },
      { args: [[1],     0],  expected: 0,  label: 'coins=[1], amount=0', isEdgeCase: true },
    ],
  },
  word_search: {
    func: { py: 'exist', js: 'exist' },
    cases: [
      { args: [[['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], 'ABCCED'], expected: true,  label: 'word="ABCCED"' },
      { args: [[['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], 'SEE'],    expected: true,  label: 'word="SEE"' },
      { args: [[['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], 'ABCB'],   expected: false, label: 'word="ABCB"', isEdgeCase: true },
    ],
  },
  permutations: {
    func: { py: 'permute', js: 'permute' },
    cases: [
      { args: [[0,1]],   expected: [[0,1],[1,0]],                                        label: 'nums=[0,1]' },
      { args: [[1,2,3]], expected: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]],    label: 'nums=[1,2,3]' },
      { args: [[1]],     expected: [[1]],                                                label: 'nums=[1]', isEdgeCase: true },
    ],
  },
  rotate_image: {
    func: { py: 'rotate', js: 'rotate' },
    cases: [
      { args: [[[1,2,3],[4,5,6],[7,8,9]]],                            expected: [[7,4,1],[8,5,2],[9,6,3]],                       label: '3x3 matrix' },
      { args: [[[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]],     expected: [[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]], label: '4x4 matrix' },
      { args: [[[1]]],                                                expected: [[1]],                                            label: 'matrix=[[1]]', isEdgeCase: true },
    ],
  },
  spiral_matrix: {
    func: { py: 'spiralOrder', js: 'spiralOrder' },
    cases: [
      { args: [[[1,2,3],[4,5,6],[7,8,9]]],             expected: [1,2,3,6,9,8,7,4,5],           label: '3x3 matrix' },
      { args: [[[1,2,3,4],[5,6,7,8],[9,10,11,12]]],    expected: [1,2,3,4,8,12,11,10,9,5,6,7],  label: '3x4 matrix' },
      { args: [[[1]]],                                 expected: [1],                            label: 'matrix=[[1]]', isEdgeCase: true },
    ],
  },
};

function buildPythonHarness(
  userCode: string,
  funcName: string,
  cases: TestCase[],
  opts: { linkedList?: boolean; linkedListInputOnly?: boolean; binaryTree?: boolean } = {}
): string {
  const { linkedList, linkedListInputOnly, binaryTree } = opts;
  let helpers = '';
  let preprocess = '';
  let postprocess = '';

  if (linkedList || linkedListInputOnly) {
    helpers = PY_LINKED_LIST_HELPERS;
    preprocess = '        __a[0] = __arr_to_list(__a[0])';
    if (linkedList) postprocess = '        __r = __list_to_arr(__r)';
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
  opts: { linkedList?: boolean; linkedListInputOnly?: boolean; binaryTree?: boolean } = {}
): string {
  const { linkedList, linkedListInputOnly, binaryTree } = opts;
  let helpers = '';
  let preprocess = '';
  let postprocess = '';

  if (linkedList || linkedListInputOnly) {
    helpers = JS_LINKED_LIST_HELPERS;
    preprocess = '    __a[0] = __arrToList(__a[0]);';
    if (linkedList) postprocess = '    __r = __listToArr(__r);';
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
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength) > 51200) {
    return NextResponse.json({ error: 'Request too large' }, { status: 413 });
  }

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
    const opts = { linkedList: !!testData.linkedList, linkedListInputOnly: !!testData.linkedListInputOnly, binaryTree: !!testData.binaryTree };
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
