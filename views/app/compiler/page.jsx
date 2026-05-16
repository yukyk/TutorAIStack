'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Editor from '@monaco-editor/react';
import axios from 'axios';

const PROBLEMS = {
  two_sum: {
    id: 'two_sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    difficultyColor: '#4ade80',
    difficultyBg: '#1a3a1a',
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.`,
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      'Only one valid answer exists.',
    ],
    edgeCases: [
      'What if the array has exactly 2 elements? The minimum case — your solution must handle a length-2 array.',
      'What if target is negative? Negative targets are valid; do not assume target > 0.',
      'Can the same element be used twice? No — each index can only appear once in your answer.',
    ],
    starterCode: {
      python: 'def twoSum(nums, target):\n    # Write your solution here\n    pass',
      javascript: 'function twoSum(nums, target) {\n    // Write your solution here\n}',
      java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your solution here\n    }\n};',
    },
  },

  longest_substring: {
    id: 'longest_substring',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    difficultyColor: '#fbbf24',
    difficultyBg: '#2a1f00',
    description: `Given a string s, find the length of the longest substring without repeating characters. A substring is a contiguous non-empty sequence of characters within a string.`,
    examples: [
      { input: 's = "abcabcbb"', output: '3 (substring "abc")' },
      { input: 's = "bbbbb"', output: '1 (substring "b")' },
      { input: 's = "pwwkew"', output: '3 (substring "wke")' },
    ],
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.',
    ],
    edgeCases: [
      'What if the string is empty? s="" is valid input — the answer is 0.',
      'What if all characters are the same? e.g. s="aaaa" — the longest window is always 1.',
      'What if all characters are unique? The entire string is the answer — no shrinking needed.',
    ],
    starterCode: {
      python: 'def lengthOfLongestSubstring(s: str) -> int:\n    # Write your solution here\n    pass',
      javascript: 'function lengthOfLongestSubstring(s) {\n    // Write your solution here\n}',
      java: 'class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Write your solution here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        // Write your solution here\n    }\n};',
    },
  },

  valid_parentheses: {
    id: 'valid_parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    difficultyColor: '#4ade80',
    difficultyBg: '#1a3a1a',
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if open brackets are closed by the same type of brackets and in the correct order.`,
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      "s consists of parentheses characters only: '()', '[]', '{}'.",
    ],
    edgeCases: [
      "What if the string has a single bracket? s=\"(\" → false; it is never closed.",
      'What if brackets are nested but close in the wrong order? s="{[}]" → false even though counts match.',
      'What if the stack is non-empty at the end? Unclosed brackets make the string invalid.',
    ],
    starterCode: {
      python: 'def isValid(s: str) -> bool:\n    # Write your solution here\n    pass',
      javascript: 'function isValid(s) {\n    // Write your solution here\n}',
      java: 'class Solution {\n    public boolean isValid(String s) {\n        // Write your solution here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    bool isValid(string s) {\n        // Write your solution here\n    }\n};',
    },
  },

  binary_search: {
    id: 'binary_search',
    title: 'Binary Search',
    difficulty: 'Easy',
    difficultyColor: '#4ade80',
    difficultyBg: '#1a3a1a',
    description: `Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. Return the index if the target is found, otherwise return -1.`,
    examples: [
      { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4' },
      { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1' },
    ],
    constraints: [
      '1 <= nums.length <= 10^4',
      'All integers are unique.',
      'nums is sorted in ascending order.',
    ],
    edgeCases: [
      'What if target is smaller than nums[0]? Your pointers must not go out of bounds — left > right should stop the loop.',
      'What if target is larger than the last element? Same boundary — handle the right edge correctly.',
      'What if the array has only one element? nums=[5], target=5 → 0; target=3 → -1.',
    ],
    starterCode: {
      python: 'def search(nums, target: int) -> int:\n    # Write your solution here\n    pass',
      javascript: 'function search(nums, target) {\n    // Write your solution here\n}',
      java: 'class Solution {\n    public int search(int[] nums, int target) {\n        // Write your solution here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        // Write your solution here\n    }\n};',
    },
  },

  maximum_subarray: {
    id: 'maximum_subarray',
    title: "Maximum Subarray (Kadane's Algorithm)",
    difficulty: 'Medium',
    difficultyColor: '#fbbf24',
    difficultyBg: '#2a1f00',
    description: `Given an integer array nums, find the subarray with the largest sum and return its sum.`,
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6 (subarray [4,-1,2,1])' },
      { input: 'nums = [1]', output: '1' },
      { input: 'nums = [5,4,-1,7,8]', output: '23' },
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4',
    ],
    edgeCases: [
      'What if all numbers are negative? You must return the largest single element — returning 0 is wrong.',
      'What if the array has only one element? Return that element directly.',
      'When should you start fresh? Only when the running sum drops below 0 — a negative prefix hurts you.',
    ],
    starterCode: {
      python: 'def maxSubArray(nums) -> int:\n    # Write your solution here\n    pass',
      javascript: 'function maxSubArray(nums) {\n    // Write your solution here\n}',
      java: 'class Solution {\n    public int maxSubArray(int[] nums) {\n        // Write your solution here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        // Write your solution here\n    }\n};',
    },
  },

  reverse_linked_list: {
    id: 'reverse_linked_list',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    difficultyColor: '#4ade80',
    difficultyBg: '#1a3a1a',
    description: `Given the head of a singly linked list, reverse the list and return the reversed list.`,
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
      { input: 'head = [1,2]', output: '[2,1]' },
      { input: 'head = []', output: '[]' },
    ],
    constraints: [
      '0 <= number of nodes <= 5000',
      '-5000 <= Node.val <= 5000',
    ],
    edgeCases: [
      'What if the list is empty (head = null)? Return null — do not crash.',
      'What if the list has only one node? Return it unchanged.',
      'Are you saving next before overwriting it? Lose the reference and the rest of the list is gone.',
    ],
    starterCode: {
      python: '# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\ndef reverseList(head):\n    # Write your solution here\n    pass',
      javascript: '// function ListNode(val, next) { this.val = val; this.next = next || null; }\nfunction reverseList(head) {\n    // Write your solution here\n}',
      java: '// class ListNode { int val; ListNode next; ListNode(int val) { this.val = val; } }\nclass Solution {\n    public ListNode reverseList(ListNode head) {\n        // Write your solution here\n    }\n}',
      cpp: '// struct ListNode { int val; ListNode *next; ListNode(int x) : val(x), next(nullptr) {} };\nclass Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        // Write your solution here\n    }\n};',
    },
  },

  number_of_islands: {
    id: 'number_of_islands',
    title: 'Number of Islands',
    difficulty: 'Medium',
    difficultyColor: '#fbbf24',
    difficultyBg: '#2a1f00',
    description: `Given an m x n 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.`,
    examples: [
      { input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: '1' },
      { input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: '3' },
    ],
    constraints: [
      'm == grid.length',
      'n == grid[i].length',
      '1 <= m, n <= 300',
      "grid[i][j] is '0' or '1'",
    ],
    edgeCases: [
      'What if the grid is entirely water? The answer is 0 — no islands exist.',
      'What if the entire grid is land? It could be 1 large island — depends on whether it is all connected.',
      'Are you marking visited cells? Without it, you will count the same land cell multiple times.',
    ],
    starterCode: {
      python: 'def numIslands(grid) -> int:\n    # Write your solution here\n    pass',
      javascript: 'function numIslands(grid) {\n    // Write your solution here\n}',
      java: 'class Solution {\n    public int numIslands(char[][] grid) {\n        // Write your solution here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        // Write your solution here\n    }\n};',
    },
  },

  climbing_stairs: {
    id: 'climbing_stairs',
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    difficultyColor: '#4ade80',
    difficultyBg: '#1a3a1a',
    description: `You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?`,
    examples: [
      { input: 'n = 2', output: '2 (1+1, or 2)' },
      { input: 'n = 3', output: '3 (1+1+1, 1+2, or 2+1)' },
    ],
    constraints: [
      '1 <= n <= 45',
    ],
    edgeCases: [
      'What if n = 1? There is exactly one way — take a single step.',
      'Are your base cases correct? n=1 and n=2 must be handled before applying DP.',
      'Plain recursion will time out — n can be up to 45, which means millions of repeated calls without memoization.',
    ],
    starterCode: {
      python: 'def climbStairs(n: int) -> int:\n    # Write your solution here\n    pass',
      javascript: 'function climbStairs(n) {\n    // Write your solution here\n}',
      java: 'class Solution {\n    public int climbStairs(int n) {\n        // Write your solution here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    int climbStairs(int n) {\n        // Write your solution here\n    }\n};',
    },
  },

  merge_intervals: {
    id: 'merge_intervals',
    title: 'Merge Intervals',
    difficulty: 'Medium',
    difficultyColor: '#fbbf24',
    difficultyBg: '#2a1f00',
    description: `Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals and return an array of the non-overlapping intervals that cover all the intervals in the input.`,
    examples: [
      { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]' },
      { input: 'intervals = [[1,4],[4,5]]', output: '[[1,5]]' },
    ],
    constraints: [
      '1 <= intervals.length <= 10^4',
      'intervals[i].length == 2',
      '0 <= starti <= endi <= 10^4',
    ],
    edgeCases: [
      'What if there is only one interval? Return it as-is — no merging needed.',
      'Do intervals that touch count as overlapping? Yes — [1,4] and [4,5] merge into [1,5].',
      'Are the intervals already sorted? You cannot assume so — sort by start time first.',
    ],
    starterCode: {
      python: 'def merge(intervals):\n    # Write your solution here\n    pass',
      javascript: 'function merge(intervals) {\n    // Write your solution here\n}',
      java: 'class Solution {\n    public int[][] merge(int[][] intervals) {\n        // Write your solution here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        // Write your solution here\n    }\n};',
    },
  },

  binary_tree_level_order: {
    id: 'binary_tree_level_order',
    title: 'Binary Tree Level Order Traversal',
    difficulty: 'Medium',
    difficultyColor: '#fbbf24',
    difficultyBg: '#2a1f00',
    description: `Given the root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).`,
    examples: [
      { input: 'root = [3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]' },
      { input: 'root = [1]', output: '[[1]]' },
      { input: 'root = []', output: '[]' },
    ],
    constraints: [
      '0 <= number of nodes <= 2000',
      '-1000 <= Node.val <= 1000',
    ],
    edgeCases: [
      'What if the tree is empty (root = null)? Return [] — an empty list, not [[]].',
      'What if the tree has only one node? Return [[root.val]] — a list containing one level.',
      'How do you know when one level ends and the next begins? Snapshot the queue length at the start of each level.',
    ],
    starterCode: {
      python: '# class TreeNode:\n#     def __init__(self, val=0, left=None, right=None):\n#         self.val = val\n#         self.left = left\n#         self.right = right\ndef levelOrder(root):\n    # Write your solution here\n    pass',
      javascript: '// function TreeNode(val, left, right) { this.val = val; this.left = left || null; this.right = right || null; }\nfunction levelOrder(root) {\n    // Write your solution here\n}',
      java: '// class TreeNode { int val; TreeNode left, right; TreeNode(int val) { this.val = val; } }\nclass Solution {\n    public List<List<Integer>> levelOrder(TreeNode root) {\n        // Write your solution here\n    }\n}',
      cpp: '// struct TreeNode { int val; TreeNode *left, *right; TreeNode(int x) : val(x), left(nullptr), right(nullptr) {} };\nclass Solution {\npublic:\n    vector<vector<int>> levelOrder(TreeNode* root) {\n        // Write your solution here\n    }\n};',
    },
  },
};

const LANGUAGES = [
  { label: 'Python', value: 'python', judge0Id: 71 },
  { label: 'JavaScript', value: 'javascript', judge0Id: 63 },
  { label: 'Java', value: 'java', judge0Id: 62 },
  { label: 'C++', value: 'cpp', judge0Id: 54 },
];

const AI_MODES = ['hint', 'logic', 'humanize', 'debug', 'optimize'];
const MAX_FREE_MESSAGES = 15;
const PROBLEM_KEYS = Object.keys(PROBLEMS);

function getWelcomeMessage(problemTitle) {
  return `👋 Hey! I'm your TutorAI tutor for ${problemTitle}.

I won't give you the answer — but I'll help you find it yourself.

Here's how to use me:
💡 Hint — One nudge in the right direction
🧠 Logic — I'll break down where your thinking fails
👶 Humanize — I'll explain it like you're 5
🐛 Debug — I'll help you find your own bug
⚡ Optimize — I'll teach you to think in complexity

Pick a mode above and ask me anything about this problem.`;
}

export default function CompilerPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.isAdmin;
  const adminToken = session?.user?.adminToken;

  const [problemId, setProblemId] = useState('two_sum');
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [code, setCode] = useState(PROBLEMS['two_sum'].starterCode['python']);
  const [aiMode, setAiMode] = useState('hint');
  const [aiMessage, setAiMessage] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [aiHistory, setAiHistory] = useState([
    { role: 'assistant', content: getWelcomeMessage(PROBLEMS['two_sum'].title) }
  ]);
  const [streamingContent, setStreamingContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [executeResult, setExecuteResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const chatEndRef = useRef(null);

  const [leftTab, setLeftTab] = useState('description');
  const [leftWidth, setLeftWidth] = useState(38);
  const [editorHeightPct, setEditorHeightPct] = useState(70);
  const [hDivHovered, setHDivHovered] = useState(false);
  const [vDivHovered, setVDivHovered] = useState(false);

  const isDraggingH = useRef(false);
  const isDraggingV = useRef(false);
  const mainRef = useRef(null);
  const rightPanelRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiHistory, streamingContent]);

  useEffect(() => {
    function onMouseMove(e) {
      if (isDraggingH.current && mainRef.current) {
        const rect = mainRef.current.getBoundingClientRect();
        const pct = ((e.clientX - rect.left) / rect.width) * 100;
        setLeftWidth(Math.min(Math.max(pct, 20), 70));
      }
      if (isDraggingV.current && rightPanelRef.current) {
        const rect = rightPanelRef.current.getBoundingClientRect();
        const pct = ((e.clientY - rect.top) / rect.height) * 100;
        setEditorHeightPct(Math.min(Math.max(pct, 30), 85));
      }
    }
    function onMouseUp() {
      isDraggingH.current = false;
      isDraggingV.current = false;
    }
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const problem = PROBLEMS[problemId];
  const problemNumber = PROBLEM_KEYS.indexOf(problemId) + 1;

  function handleProblemChange(e) {
    const newId = e.target.value;
    const newProblem = PROBLEMS[newId];
    setProblemId(newId);
    setCode(newProblem.starterCode[language.value]);
    setExecuteResult(null);
    setMessageCount(0);
    setIsLimitReached(false);
    setAiMessage('');
    setAiHistory([
      { role: 'assistant', content: getWelcomeMessage(newProblem.title) }
    ]);
  }

  function handleLanguageChange(e) {
    const selected = LANGUAGES.find(l => l.value === e.target.value);
    setLanguage(selected);
    setCode(problem.starterCode[selected.value]);
    setExecuteResult(null);
  }

  async function handleAskAI() {
    if (!aiMessage.trim() || isLimitReached || isStreaming) return;

    const userMsg = aiMessage;
    const currentHistory = aiHistory;

    if (!isAdmin) {
      const newCount = messageCount + 1;
      setMessageCount(newCount);
      if (newCount >= MAX_FREE_MESSAGES) setIsLimitReached(true);
    }

    setAiMessage('');
    setAiLoading(true);
    setAiHistory(prev => [...prev, { role: 'user', content: userMsg }]);

    try {
      const headers = isAdmin && adminToken ? { 'x-admin-token': adminToken } : {};
      const res = await axios.post('/api/chat', {
        message: userMsg,
        mode: aiMode,
        problemId: problemId,
        history: currentHistory,
        userCode: code,
      }, { headers });

      const fullText = res.data.reply;
      setAiLoading(false);
      setIsStreaming(true);
      setStreamingContent('');

      let i = 0;
      const interval = setInterval(() => {
        i++;
        setStreamingContent(fullText.slice(0, i));
        if (i >= fullText.length) {
          clearInterval(interval);
          setIsStreaming(false);
          setStreamingContent('');
          setAiHistory(prev => [...prev, { role: 'assistant', content: fullText }]);
        }
      }, 18);

    } catch (err) {
      console.error(err);
      setAiLoading(false);
    }
  }

  async function handleRunCode() {
    if (isRunning) return;
    setIsRunning(true);
    setExecuteResult(null);

    try {
      const res = await axios.post('/api/execute', {
        code,
        language: language.value,
        problemId,
      });
      setExecuteResult(res.data);
      setIsRunning(false);
    } catch (err) {
      console.error(err);
      setIsRunning(false);
      setExecuteResult({ error: 'Failed to run code. Check your connection and try again.' });
    }
  }

  const messagesLeft = MAX_FREE_MESSAGES - messageCount;
  const progressPercent = (messageCount / MAX_FREE_MESSAGES) * 100;
  const progressColor = progressPercent >= 100 ? '#ef4444'
    : progressPercent >= 70 ? '#f97316'
    : '#3B82F6';

  const avatarInitial = session?.user?.name?.[0]?.toUpperCase()
    || session?.user?.email?.[0]?.toUpperCase()
    || null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', background: '#0B0F19', color: '#f4f4f5', overflow: 'hidden' }}>

      {/* TOP BAR */}
      <div style={{ height: '48px', flexShrink: 0, display: 'flex', alignItems: 'center', padding: '0 16px', borderBottom: '1px solid #1e1e1e', background: '#0d1117', gap: '12px' }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: '110px' }}>
          <span style={{ color: '#3B82F6', fontWeight: '700', fontSize: '14px', fontFamily: 'monospace', letterSpacing: '-0.02em' }}>&lt;/&gt;</span>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#f4f4f5', letterSpacing: '-0.01em' }}>TutorAI</span>
        </div>

        {/* Problem selector — center */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
          <select
            value={problemId}
            onChange={handleProblemChange}
            style={{
              background: '#0f1729', color: '#f4f4f5', border: '1px solid #1e1e1e',
              borderRadius: '6px', padding: '5px 10px', fontSize: '13px',
              cursor: 'pointer', outline: 'none', maxWidth: '280px',
            }}
          >
            {Object.values(PROBLEMS).map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
          <span style={{
            fontSize: '11px', padding: '2px 8px', borderRadius: '4px',
            background: problem.difficultyBg, color: problem.difficultyColor,
            fontWeight: '600', letterSpacing: '0.02em', flexShrink: 0,
          }}>
            {problem.difficulty}
          </span>
        </div>

        {/* Right: language + avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '110px', justifyContent: 'flex-end' }}>
          <select
            value={language.value}
            onChange={handleLanguageChange}
            style={{
              background: '#0f1729', color: '#71717a', border: '1px solid #1e1e1e',
              borderRadius: '6px', padding: '5px 10px', fontSize: '12px',
              cursor: 'pointer', outline: 'none',
            }}
          >
            {LANGUAGES.map(l => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
          {avatarInitial && (
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: '#3B82F6', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '11px', fontWeight: '700',
              color: '#fff', flexShrink: 0, userSelect: 'none',
            }}>
              {avatarInitial}
            </div>
          )}
        </div>
      </div>

      {/* MAIN AREA */}
      <div ref={mainRef} style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>

        {/* LEFT PANEL */}
        <div style={{ width: `${leftWidth}%`, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0, background: '#0d1117' }}>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #1e1e1e', flexShrink: 0, paddingLeft: '4px' }}>
            {[
              { key: 'description', label: 'Problem' },
              { key: 'aiTutor', label: 'AI Tutor' },
              { key: 'submissions', label: 'Submissions' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setLeftTab(tab.key)}
                style={{
                  padding: '0 16px', height: '40px', background: 'transparent', border: 'none',
                  borderBottom: leftTab === tab.key ? '2px solid #6366f1' : '2px solid transparent',
                  color: leftTab === tab.key ? '#f4f4f5' : '#52525b',
                  fontSize: '13px', fontWeight: '500', cursor: 'pointer',
                  transition: 'color 0.15s', marginBottom: '-1px',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* PROBLEM TAB */}
          {leftTab === 'description' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px', minHeight: 0 }}>

              <div style={{ marginBottom: '18px' }}>
                <h1 style={{ fontSize: '17px', fontWeight: '700', margin: '0 0 10px', color: '#f4f4f5', lineHeight: '1.35', letterSpacing: '-0.01em' }}>
                  {problemNumber}. {problem.title}
                </h1>
                <span style={{
                  fontSize: '11px', padding: '2px 8px', borderRadius: '4px',
                  background: problem.difficultyBg, color: problem.difficultyColor,
                  fontWeight: '600', letterSpacing: '0.02em',
                }}>
                  {problem.difficulty}
                </span>
              </div>

              <p style={{ fontSize: '14px', lineHeight: '1.75', color: '#a1a1aa', margin: '0 0 28px' }}>
                {problem.description}
              </p>

              <div style={{ marginBottom: '28px' }}>
                <p style={{ fontSize: '10px', fontWeight: '600', color: '#3f3f46', letterSpacing: '0.1em', marginBottom: '10px', textTransform: 'uppercase' }}>
                  Examples
                </p>
                {problem.examples.map((ex, i) => (
                  <div key={i} style={{ background: '#0d1117', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '12px 14px', marginBottom: '8px', fontSize: '13px', fontFamily: 'monospace' }}>
                    <div style={{ marginBottom: '5px' }}>
                      <span style={{ color: '#3f3f46' }}>Input:{'  '}</span>
                      <span style={{ color: '#e4e4e7' }}>{ex.input}</span>
                    </div>
                    <div>
                      <span style={{ color: '#3f3f46' }}>Output: </span>
                      <span style={{ color: '#4ade80' }}>{ex.output}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: '28px' }}>
                <p style={{ fontSize: '10px', fontWeight: '600', color: '#3f3f46', letterSpacing: '0.1em', marginBottom: '10px', textTransform: 'uppercase' }}>
                  Edge Cases
                </p>
                {problem.edgeCases.map((ec, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px', fontSize: '13px', color: '#71717a', lineHeight: '1.65' }}>
                    <span style={{ color: '#f97316', flexShrink: 0 }}>⚠</span>
                    <span>{ec}</span>
                  </div>
                ))}
              </div>

              <div>
                <p style={{ fontSize: '10px', fontWeight: '600', color: '#3f3f46', letterSpacing: '0.1em', marginBottom: '10px', textTransform: 'uppercase' }}>
                  Constraints
                </p>
                {problem.constraints.map((c, i) => (
                  <p key={i} style={{ fontSize: '13px', color: '#52525b', margin: '0 0 5px', fontFamily: 'monospace' }}>• {c}</p>
                ))}
              </div>
            </div>
          )}

          {/* AI TUTOR TAB */}
          {leftTab === 'aiTutor' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>

              {/* Mode switcher */}
              <div style={{ padding: '10px 14px', borderBottom: '1px solid #1e1e1e', flexShrink: 0 }}>
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                  {AI_MODES.map(mode => (
                    <button key={mode} onClick={() => setAiMode(mode)} style={{
                      padding: '4px 12px', borderRadius: '20px', fontSize: '12px',
                      fontWeight: '500', cursor: 'pointer', border: 'none',
                      background: aiMode === mode ? '#3B82F6' : '#0f1729',
                      color: aiMode === mode ? '#fff' : '#71717a',
                      transition: 'all 0.15s',
                    }}>
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat history */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px', fontSize: '13px', lineHeight: '1.6', minHeight: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {aiHistory.map((msg, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                    {msg.role === 'user' ? (
                      <div style={{
                        background: '#0f1525', borderRadius: '8px 8px 2px 8px',
                        padding: '10px 14px', maxWidth: '86%',
                        color: '#f4f4f5', fontSize: '13px', lineHeight: '1.6', whiteSpace: 'pre-line',
                      }}>
                        {msg.content}
                      </div>
                    ) : (
                      <div style={{
                        borderLeft: '3px solid #6366f1', paddingLeft: '12px',
                        maxWidth: '96%', color: '#e4e4e7', fontSize: '13px',
                        lineHeight: '1.7', whiteSpace: 'pre-line',
                      }}>
                        {msg.content}
                      </div>
                    )}
                  </div>
                ))}

                {aiLoading && !isStreaming && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{ borderLeft: '3px solid #6366f1', paddingLeft: '12px', color: '#3f3f46', fontSize: '13px' }}>
                      thinking...
                    </div>
                  </div>
                )}

                {isStreaming && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{ borderLeft: '3px solid #6366f1', paddingLeft: '12px', maxWidth: '96%', color: '#e4e4e7', fontSize: '13px', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                      {streamingContent}<span style={{ opacity: 0.35 }}>▌</span>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Progress + input */}
              <div style={{ padding: '10px 14px', borderTop: '1px solid #1e1e1e', flexShrink: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '9px' }}>
                  <span style={{ fontSize: '11px', color: '#3f3f46' }}>{messagesLeft} messages left</span>
                  <div style={{ height: '2px', width: '72px', background: 'rgba(255,255,255,0.08)', borderRadius: '1px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${progressPercent}%`, background: progressColor, borderRadius: '1px', transition: 'all 0.3s ease' }} />
                  </div>
                </div>

                {isLimitReached ? (
                  <div style={{ background: '#0d1117', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: '#f4f4f5', margin: '0 0 4px' }}>
                      You've used your {MAX_FREE_MESSAGES} free messages
                    </p>
                    <p style={{ fontSize: '12px', color: '#52525b', margin: '0 0 12px' }}>
                      Upgrade to Pro for unlimited access
                    </p>
                    <button style={{
                      background: '#3B82F6', color: '#fff', border: 'none',
                      borderRadius: '6px', padding: '9px 20px', fontSize: '13px',
                      fontWeight: '600', cursor: 'not-allowed', opacity: 0.65, width: '100%',
                    }}>
                      Upgrade to Pro — Coming Soon
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '7px' }}>
                    <input
                      value={aiMessage}
                      onChange={e => setAiMessage(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && !aiLoading && !isStreaming && handleAskAI()}
                      placeholder="Ask the tutor..."
                      style={{
                        flex: 1, padding: '8px 11px', borderRadius: '6px',
                        background: '#0d1117', border: '1px solid #1e1e1e',
                        color: '#f4f4f5', fontSize: '13px', outline: 'none',
                      }}
                    />
                    <button onClick={handleAskAI} disabled={aiLoading || isStreaming} style={{
                      padding: '8px 14px', borderRadius: '6px', border: 'none',
                      background: '#3B82F6', color: '#fff', fontSize: '13px',
                      fontWeight: '600', cursor: (aiLoading || isStreaming) ? 'not-allowed' : 'pointer',
                      opacity: (aiLoading || isStreaming) ? 0.55 : 1, flexShrink: 0,
                    }}>
                      {aiLoading ? '...' : 'Ask'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SUBMISSIONS TAB */}
          {leftTab === 'submissions' && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '6px' }}>
              <p style={{ color: '#3f3f46', fontSize: '13px', margin: 0 }}>Coming soon</p>
            </div>
          )}
        </div>

        {/* HORIZONTAL DRAGGABLE DIVIDER */}
        <div
          onMouseDown={e => { e.preventDefault(); isDraggingH.current = true; }}
          onMouseEnter={() => setHDivHovered(true)}
          onMouseLeave={() => setHDivHovered(false)}
          style={{
            width: '4px', flexShrink: 0, cursor: 'col-resize',
            background: hDivHovered ? '#3B82F6' : 'rgba(255,255,255,0.08)',
            transition: 'background 0.15s',
          }}
        />

        {/* RIGHT PANEL */}
        <div ref={rightPanelRef} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

          {/* Editor toolbar */}
          <div style={{ height: '36px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', background: '#0d1117', borderBottom: '1px solid #1e1e1e' }}>
            <select
              value={language.value}
              onChange={handleLanguageChange}
              style={{
                background: 'transparent', color: '#52525b', border: 'none',
                fontSize: '12px', cursor: 'pointer', outline: 'none',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              {LANGUAGES.map(l => (
                <option key={l.value} value={l.value} style={{ background: '#0d1117', color: '#f4f4f5' }}>{l.label}</option>
              ))}
            </select>
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              style={{
                padding: '4px 14px', borderRadius: '6px', border: 'none',
                background: isRunning ? '#2563eb' : '#3B82F6',
                color: '#fff', fontSize: '12px', fontWeight: '600',
                cursor: isRunning ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s',
              }}
            >
              {isRunning ? 'Running...' : 'Run Code'}
            </button>
          </div>

          {/* Monaco Editor */}
          <div style={{ height: `${editorHeightPct}%`, minHeight: 0, overflow: 'hidden' }}>
            <Editor
              height="100%"
              language={language.value}
              value={code}
              onChange={val => setCode(val)}
              beforeMount={(monaco) => {
                monaco.editor.defineTheme('tutorai-dark', {
                  base: 'vs-dark',
                  inherit: true,
                  rules: [],
                  colors: { 'editor.background': '#0d1117' },
                });
              }}
              onMount={(editor) => {
                editor.updateOptions({ theme: 'tutorai-dark' });
              }}
              theme="tutorai-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                automaticLayout: true,
                padding: { top: 16 },
              }}
            />
          </div>

          {/* VERTICAL DRAGGABLE DIVIDER */}
          <div
            onMouseDown={e => { e.preventDefault(); isDraggingV.current = true; }}
            onMouseEnter={() => setVDivHovered(true)}
            onMouseLeave={() => setVDivHovered(false)}
            style={{
              height: '4px', flexShrink: 0, cursor: 'row-resize',
              background: vDivHovered ? '#3B82F6' : 'rgba(255,255,255,0.08)',
              transition: 'background 0.15s',
            }}
          />

          {/* OUTPUT PANEL */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#080d14', minHeight: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', height: '36px', borderBottom: '1px solid #1e1e1e', flexShrink: 0 }}>
              <span style={{ fontSize: '10px', fontWeight: '600', color: '#3f3f46', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Output</span>
              {executeResult && (
                <button
                  onClick={() => setExecuteResult(null)}
                  style={{ background: 'transparent', border: 'none', color: '#3f3f46', fontSize: '11px', cursor: 'pointer', padding: '2px 6px', borderRadius: '4px' }}
                >
                  Clear
                </button>
              )}
            </div>
            <div style={{ flex: 1, padding: '14px 16px', overflowY: 'auto' }}>
              {isRunning ? (
                <p style={{ color: '#3f3f46', fontSize: '13px', margin: 0, fontFamily: 'monospace' }}>Running...</p>
              ) : executeResult ? (
                <div style={{ fontFamily: 'monospace', fontSize: '13px' }}>
                  {executeResult.error ? (
                    <p style={{ color: '#ef4444', margin: 0 }}>{executeResult.error}</p>
                  ) : executeResult.type === 'test' ? (
                    <>
                      <p style={{
                        fontSize: '11px', fontWeight: '700', letterSpacing: '0.06em', margin: '0 0 16px',
                        color: executeResult.passed === executeResult.total ? '#4ade80' : '#ef4444',
                      }}>
                        {executeResult.passed} / {executeResult.total} TEST CASES PASSED
                      </p>
                      {executeResult.testResults.map((t, i) => (
                        <div key={i} style={{ marginBottom: '14px', paddingBottom: '14px', borderBottom: '1px solid #161616' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                            <span style={{ color: t.p ? '#4ade80' : '#ef4444', fontSize: '12px', fontWeight: '700', flexShrink: 0 }}>
                              {t.p ? '✓' : '✗'} {t.p ? 'Passed' : 'Failed'}
                            </span>
                            {t.isEdgeCase && (
                              <span style={{ fontSize: '10px', fontWeight: '600', color: '#f97316', background: '#1a0a00', padding: '1px 7px', borderRadius: '4px', border: '1px solid rgba(249,115,22,0.25)', flexShrink: 0 }}>
                                Edge Case
                              </span>
                            )}
                            <span style={{ color: '#3f3f46', fontSize: '11px' }}>{t.l}</span>
                          </div>
                          {t.err ? (
                            <pre style={{ margin: 0, color: '#f97316', fontSize: '12px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{t.err}</pre>
                          ) : !t.p ? (
                            <div style={{ fontSize: '12px' }}>
                              <p style={{ margin: '0 0 2px', color: '#71717a' }}>Expected: <span style={{ color: '#4ade80' }}>{JSON.stringify(t.e)}</span></p>
                              <p style={{ margin: 0, color: '#71717a' }}>Got: <span style={{ color: '#ef4444' }}>{JSON.stringify(t.r)}</span></p>
                            </div>
                          ) : null}
                        </div>
                      ))}
                      {executeResult.stderr ? (
                        <pre style={{ color: '#ef4444', margin: '8px 0 0', whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: '12px' }}>
                          {executeResult.stderr}
                        </pre>
                      ) : null}
                    </>
                  ) : (
                    <>
                      {executeResult.stdout ? (
                        <pre style={{ color: '#4ade80', margin: '0 0 10px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                          {executeResult.stdout}
                        </pre>
                      ) : null}
                      {executeResult.stderr ? (
                        <pre style={{ color: '#ef4444', margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                          {executeResult.stderr}
                        </pre>
                      ) : null}
                      {!executeResult.stdout && !executeResult.stderr ? (
                        <p style={{ color: '#3f3f46', margin: 0 }}>No output.</p>
                      ) : null}
                    </>
                  )}
                </div>
              ) : (
                <p style={{ color: '#27272a', fontSize: '13px', margin: 0, fontFamily: 'monospace' }}>
                  // Run your code to see output here
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
