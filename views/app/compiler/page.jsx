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
    pattern: 'HashMap',
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
    pattern: 'Sliding Window',
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
    pattern: 'Stack',
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
    pattern: 'Binary Search',
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
    pattern: 'DP',
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
    pattern: 'Linked List',
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
    pattern: 'BFS/DFS',
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
    pattern: 'DP',
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
    pattern: 'Greedy',
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
    pattern: 'BFS/DFS',
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

  contains_duplicate: {
    id: 'contains_duplicate',
    title: 'Contains Duplicate',
    difficulty: 'Easy',
    difficultyColor: '#4ade80',
    difficultyBg: '#1a3a1a',
    pattern: 'HashMap',
    description: 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
    examples: [
      { input: 'nums = [1,2,3,1]', output: 'true' },
      { input: 'nums = [1,2,3,4]', output: 'false' },
      { input: 'nums = [1,1,1,3,3,4,3,2,4,2]', output: 'true' },
    ],
    edgeCases: [
      'What if the array has only one element?',
      'What if the array is empty?',
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^9 <= nums[i] <= 10^9',
    ],
    starterCode: {
      python: 'def containsDuplicate(nums):\n    # Write your solution here\n    pass',
      javascript: 'function containsDuplicate(nums) {\n    // Write your solution here\n}',
      java: 'class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        // Write your solution here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { label: 'Case 1', displayInput: 'nums=[1,2,3,1]', expected: 'true' },
      { label: 'Case 2', displayInput: 'nums=[1,2,3,4]', expected: 'false' },
      { label: 'Edge Case', displayInput: 'nums=[1]', expected: 'false', isEdgeCase: true },
    ],
  },

  maximum_depth_binary_tree: {
    id: 'maximum_depth_binary_tree',
    title: 'Maximum Depth of Binary Tree',
    difficulty: 'Easy',
    difficultyColor: '#4ade80',
    difficultyBg: '#1a3a1a',
    pattern: 'BFS/DFS',
    description: 'Given the root of a binary tree, return its maximum depth. The maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.',
    examples: [
      { input: 'root = [3,9,20,null,null,15,7]', output: '3' },
      { input: 'root = [1,null,2]', output: '2' },
    ],
    edgeCases: [
      'What if the tree is empty (root is null)?',
      'What if the tree has only one node?',
    ],
    constraints: [
      '0 <= number of nodes <= 10^4',
      '-100 <= Node.val <= 100',
    ],
    starterCode: {
      python: 'def maxDepth(root):\n    # Write your solution here\n    pass',
      javascript: 'function maxDepth(root) {\n    // Write your solution here\n}',
      java: 'class Solution {\n    public int maxDepth(TreeNode root) {\n        // Write your solution here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    int maxDepth(TreeNode* root) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { label: 'Case 1', displayInput: 'root=[3,9,20,null,null,15,7]', expected: '3' },
      { label: 'Case 2', displayInput: 'root=[1,null,2]', expected: '2' },
      { label: 'Edge Case', displayInput: 'root=[]', expected: '0', isEdgeCase: true },
    ],
  },

  linked_list_cycle: {
    id: 'linked_list_cycle',
    title: 'Linked List Cycle',
    difficulty: 'Easy',
    difficultyColor: '#4ade80',
    difficultyBg: '#1a3a1a',
    pattern: 'Linked List',
    description: 'Given head, the head of a linked list, determine if the linked list has a cycle in it. Return true if there is a cycle, otherwise return false.',
    examples: [
      { input: 'head = [3,2,0,-4], pos = 1', output: 'true' },
      { input: 'head = [1,2], pos = 0', output: 'true' },
      { input: 'head = [1], pos = -1', output: 'false' },
    ],
    edgeCases: [
      'What if the list has only one node with no cycle?',
      'What if the list is empty?',
    ],
    constraints: [
      '0 <= number of nodes <= 10^4',
      '-10^5 <= Node.val <= 10^5',
    ],
    starterCode: {
      python: 'def hasCycle(head):\n    # Write your solution here\n    pass',
      javascript: 'function hasCycle(head) {\n    // Write your solution here\n}',
      java: 'class Solution {\n    public boolean hasCycle(ListNode head) {\n        // Write your solution here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    bool hasCycle(ListNode *head) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { label: 'Case 1', displayInput: 'no cycle [1,2,3]', expected: 'false' },
      { label: 'Case 2', displayInput: 'no cycle [1]', expected: 'false' },
      { label: 'Edge Case', displayInput: 'empty list []', expected: 'false', isEdgeCase: true },
    ],
  },

  find_minimum_rotated: {
    id: 'find_minimum_rotated',
    title: 'Find Minimum in Rotated Sorted Array',
    difficulty: 'Medium',
    difficultyColor: '#fbbf24',
    difficultyBg: '#2a1f00',
    pattern: 'Binary Search',
    description: 'Suppose an array of length n sorted in ascending order is rotated between 1 and n times. Given the sorted rotated array nums of unique elements, return the minimum element of this array. You must write an algorithm that runs in O(log n) time.',
    examples: [
      { input: 'nums = [3,4,5,1,2]', output: '1' },
      { input: 'nums = [4,5,6,7,0,1,2]', output: '0' },
      { input: 'nums = [11,13,15,17]', output: '11' },
    ],
    edgeCases: [
      'What if the array was not rotated at all?',
      'What if the array has only one element?',
    ],
    constraints: [
      '1 <= nums.length <= 5000',
      '-5000 <= nums[i] <= 5000',
      'All integers are unique',
    ],
    starterCode: {
      python: 'def findMin(nums):\n    # Write your solution here\n    pass',
      javascript: 'function findMin(nums) {\n    // Write your solution here\n}',
      java: 'class Solution {\n    public int findMin(int[] nums) {\n        // Write your solution here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    int findMin(vector<int>& nums) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { label: 'Case 1', displayInput: 'nums=[3,4,5,1,2]', expected: '1' },
      { label: 'Case 2', displayInput: 'nums=[4,5,6,7,0,1,2]', expected: '0' },
      { label: 'Edge Case', displayInput: 'nums=[1]', expected: '1', isEdgeCase: true },
    ],
  },

  product_except_self: {
    id: 'product_except_self',
    title: 'Product of Array Except Self',
    difficulty: 'Medium',
    difficultyColor: '#fbbf24',
    difficultyBg: '#2a1f00',
    pattern: 'Array',
    description: 'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. You must write an algorithm that runs in O(n) time and without using the division operation.',
    examples: [
      { input: 'nums = [1,2,3,4]', output: '[24,12,8,6]' },
      { input: 'nums = [-1,1,0,-3,3]', output: '[0,0,9,0,0]' },
    ],
    edgeCases: [
      'What if the array contains a zero?',
      'What if the array contains two zeros?',
    ],
    constraints: [
      '2 <= nums.length <= 10^5',
      '-30 <= nums[i] <= 30',
      'The product of any prefix or suffix fits in a 32-bit integer',
    ],
    starterCode: {
      python: 'def productExceptSelf(nums):\n    # Write your solution here\n    pass',
      javascript: 'function productExceptSelf(nums) {\n    // Write your solution here\n}',
      java: 'class Solution {\n    public int[] productExceptSelf(int[] nums) {\n        // Write your solution here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    vector<int> productExceptSelf(vector<int>& nums) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { label: 'Case 1', displayInput: 'nums=[1,2,3,4]', expected: '[24,12,8,6]' },
      { label: 'Case 2', displayInput: 'nums=[-1,1,0,-3,3]', expected: '[0,0,9,0,0]' },
      { label: 'Edge Case', displayInput: 'nums=[0,0]', expected: '[0,0]', isEdgeCase: true },
    ],
  },

  valid_anagram: {
    id: 'valid_anagram',
    title: 'Valid Anagram',
    difficulty: 'Easy',
    difficultyColor: '#4ade80',
    difficultyBg: '#1a3a1a',
    pattern: 'HashMap',
    description: `Given two strings s and t, return true if t is an anagram of s, and false otherwise. An anagram is a word formed by rearranging the letters of another word, using all original letters exactly once.`,
    examples: [
      { input: 's = "anagram", t = "nagaram"', output: 'true' },
      { input: 's = "rat", t = "car"', output: 'false' },
    ],
    constraints: [
      '1 <= s.length, t.length <= 5 * 10^4',
      's and t consist of lowercase English letters.',
    ],
    edgeCases: [
      'What if s and t have different lengths? Return false immediately — no rearrangement can fix a length mismatch.',
      'What if both strings are a single character? s="a", t="a" → true; s="a", t="b" → false.',
      'Does order matter? No — only character counts matter.',
    ],
    starterCode: {
      python: 'def isAnagram(s: str, t: str) -> bool:\n    # Write your solution here\n    pass',
      javascript: 'function isAnagram(s, t) {\n    // Write your solution here\n}',
      java: 'class Solution {\n    public boolean isAnagram(String s, String t) {\n        // Write your solution here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { label: 'Case 1', displayInput: 's="anagram", t="nagaram"', expected: 'true' },
      { label: 'Case 2', displayInput: 's="rat", t="car"', expected: 'false' },
      { label: 'Edge Case', displayInput: 's="a", t="a"', expected: 'true', isEdgeCase: true },
    ],
  },

  best_time_to_buy_sell_stock: {
    id: 'best_time_to_buy_sell_stock',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    difficultyColor: '#4ade80',
    difficultyBg: '#1a3a1a',
    pattern: 'Sliding Window',
    description: `You are given an array prices where prices[i] is the price of a stock on day i. Choose a single day to buy and a later day to sell to maximize profit. Return the maximum profit, or 0 if no profit is possible.`,
    examples: [
      { input: 'prices = [7,1,5,3,6,4]', output: '5 (buy day 2 at price 1, sell day 5 at price 6)' },
      { input: 'prices = [7,6,4,3,1]', output: '0 (no profitable transaction possible)' },
    ],
    constraints: [
      '1 <= prices.length <= 10^5',
      '0 <= prices[i] <= 10^4',
    ],
    edgeCases: [
      "What if prices has only one element? You can't transact — return 0.",
      'What if prices are strictly decreasing? No profit is possible — return 0, not a negative number.',
      'Must you sell after you buy? Yes — you must choose a buy day before the sell day.',
    ],
    starterCode: {
      python: 'def maxProfit(prices) -> int:\n    # Write your solution here\n    pass',
      javascript: 'function maxProfit(prices) {\n    // Write your solution here\n}',
      java: 'class Solution {\n    public int maxProfit(int[] prices) {\n        // Write your solution here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { label: 'Case 1', displayInput: 'prices=[7,1,5,3,6,4]', expected: '5' },
      { label: 'Case 2', displayInput: 'prices=[7,6,4,3,1]', expected: '0' },
      { label: 'Edge Case', displayInput: 'prices=[1]', expected: '0', isEdgeCase: true },
    ],
  },

  missing_number: {
    id: 'missing_number',
    title: 'Missing Number',
    difficulty: 'Easy',
    difficultyColor: '#4ade80',
    difficultyBg: '#1a3a1a',
    pattern: 'Math',
    description: `Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.`,
    examples: [
      { input: 'nums = [3,0,1]', output: '2' },
      { input: 'nums = [0,1]', output: '2' },
      { input: 'nums = [9,6,4,2,3,5,7,0,1]', output: '8' },
    ],
    constraints: [
      'n == nums.length',
      '1 <= n <= 10^4',
      '0 <= nums[i] <= n',
      'All numbers in nums are unique.',
    ],
    edgeCases: [
      'What if nums = [0]? The missing number is 1.',
      'What if nums = [1]? The missing number is 0.',
      'Can you solve in O(1) space? Yes — Gauss formula: expected sum is n*(n+1)/2, subtract actual sum.',
    ],
    starterCode: {
      python: 'def missingNumber(nums) -> int:\n    # Write your solution here\n    pass',
      javascript: 'function missingNumber(nums) {\n    // Write your solution here\n}',
      java: 'class Solution {\n    public int missingNumber(int[] nums) {\n        // Write your solution here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    int missingNumber(vector<int>& nums) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { label: 'Case 1', displayInput: 'nums=[3,0,1]', expected: '2' },
      { label: 'Case 2', displayInput: 'nums=[9,6,4,2,3,5,7,0,1]', expected: '8' },
      { label: 'Edge Case', displayInput: 'nums=[0]', expected: '1', isEdgeCase: true },
    ],
  },

  palindrome_number: {
    id: 'palindrome_number',
    title: 'Palindrome Number',
    difficulty: 'Easy',
    difficultyColor: '#4ade80',
    difficultyBg: '#1a3a1a',
    pattern: 'Math',
    description: `Given an integer x, return true if x is a palindrome, and false otherwise. An integer is a palindrome when it reads the same forward and backward.`,
    examples: [
      { input: 'x = 121', output: 'true (reads 121 both ways)' },
      { input: 'x = -121', output: 'false (reads -121 forward, 121- backward)' },
      { input: 'x = 10', output: 'false (reads 01 backward)' },
    ],
    constraints: [
      '-2^31 <= x <= 2^31 - 1',
    ],
    edgeCases: [
      'What if x is negative? All negative numbers return false — the minus sign breaks the palindrome.',
      'What if x ends in 0? Only x=0 itself is valid; 10, 100, etc. are not palindromes.',
      'Can you solve without string conversion? Yes — reverse the second half of the number and compare with the first half.',
    ],
    starterCode: {
      python: 'def isPalindrome(x: int) -> bool:\n    # Write your solution here\n    pass',
      javascript: 'function isPalindrome(x) {\n    // Write your solution here\n}',
      java: 'class Solution {\n    public boolean isPalindrome(int x) {\n        // Write your solution here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    bool isPalindrome(int x) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { label: 'Case 1', displayInput: 'x=121', expected: 'true' },
      { label: 'Case 2', displayInput: 'x=-121', expected: 'false' },
      { label: 'Edge Case', displayInput: 'x=0', expected: 'true', isEdgeCase: true },
    ],
  },

  fizz_buzz: {
    id: 'fizz_buzz',
    title: 'Fizz Buzz',
    difficulty: 'Easy',
    difficultyColor: '#4ade80',
    difficultyBg: '#1a3a1a',
    pattern: 'Math',
    description: `Given an integer n, return a string array (1-indexed) where: the element is "FizzBuzz" if divisible by both 3 and 5, "Fizz" if by 3 only, "Buzz" if by 5 only, and the number as a string otherwise.`,
    examples: [
      { input: 'n = 3', output: '["1","2","Fizz"]' },
      { input: 'n = 5', output: '["1","2","Fizz","4","Buzz"]' },
      { input: 'n = 15', output: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]' },
    ],
    constraints: [
      '1 <= n <= 10^4',
    ],
    edgeCases: [
      'Does FizzBuzz come before Fizz in your if-else? Check divisibility by 15 first — otherwise the Fizz/Buzz branches short-circuit it.',
      'What if n = 1? The output is just ["1"].',
      'Is it "FizzBuzz" or "Fizz Buzz"? One concatenated string — no space.',
    ],
    starterCode: {
      python: 'def fizzBuzz(n: int):\n    # Write your solution here\n    pass',
      javascript: 'function fizzBuzz(n) {\n    // Write your solution here\n}',
      java: 'class Solution {\n    public List<String> fizzBuzz(int n) {\n        // Write your solution here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    vector<string> fizzBuzz(int n) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { label: 'Case 1', displayInput: 'n=3', expected: '["1","2","Fizz"]' },
      { label: 'Case 2', displayInput: 'n=5', expected: '["1","2","Fizz","4","Buzz"]' },
      { label: 'Edge Case', displayInput: 'n=1', expected: '["1"]', isEdgeCase: true },
    ],
  },

  invert_binary_tree: {
    id: 'invert_binary_tree',
    title: 'Invert Binary Tree',
    difficulty: 'Easy',
    difficultyColor: '#4ade80',
    difficultyBg: '#1a3a1a',
    pattern: 'Tree',
    description: `Given the root of a binary tree, invert the tree (mirror it), and return its root. Every left child becomes the right child and vice versa at every node.`,
    examples: [
      { input: 'root = [4,2,7,1,3,6,9]', output: '[4,7,2,9,6,3,1]' },
      { input: 'root = [2,1,3]', output: '[2,3,1]' },
      { input: 'root = []', output: '[]' },
    ],
    constraints: [
      '0 <= number of nodes <= 100',
      '-100 <= Node.val <= 100',
    ],
    edgeCases: [
      'What if the tree is empty? Return null — nothing to invert.',
      'What if the tree has only one node? Return it unchanged — no children to swap.',
      'Do you need to recurse into both subtrees? Yes — swapping only the root children inverts just one level.',
    ],
    starterCode: {
      python: '# class TreeNode:\n#     def __init__(self, val=0, left=None, right=None):\n#         self.val = val\n#         self.left = left\n#         self.right = right\ndef invertTree(root):\n    # Write your solution here\n    pass',
      javascript: '// function TreeNode(val, left, right) { this.val = val; this.left = left || null; this.right = right || null; }\nfunction invertTree(root) {\n    // Write your solution here\n}',
      java: '// class TreeNode { int val; TreeNode left, right; TreeNode(int val) { this.val = val; } }\nclass Solution {\n    public TreeNode invertTree(TreeNode root) {\n        // Write your solution here\n    }\n}',
      cpp: '// struct TreeNode { int val; TreeNode *left, *right; TreeNode(int x) : val(x), left(nullptr), right(nullptr) {} };\nclass Solution {\npublic:\n    TreeNode* invertTree(TreeNode* root) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { label: 'Case 1', displayInput: 'root=[4,2,7,1,3,6,9]', expected: '[4,7,2,9,6,3,1]' },
      { label: 'Case 2', displayInput: 'root=[2,1,3]', expected: '[2,3,1]' },
      { label: 'Edge Case', displayInput: 'root=[]', expected: '[]', isEdgeCase: true },
    ],
  },

  symmetric_tree: {
    id: 'symmetric_tree',
    title: 'Symmetric Tree',
    difficulty: 'Easy',
    difficultyColor: '#4ade80',
    difficultyBg: '#1a3a1a',
    pattern: 'Tree',
    description: `Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).`,
    examples: [
      { input: 'root = [1,2,2,3,4,4,3]', output: 'true' },
      { input: 'root = [1,2,2,null,3,null,3]', output: 'false' },
    ],
    constraints: [
      '1 <= number of nodes <= 1000',
      '-100 <= Node.val <= 100',
    ],
    edgeCases: [
      'What if the tree has only one node? A single-node tree is always symmetric.',
      'Is comparing left.val == right.val enough? No — you must also check their children mirror each other recursively.',
      'BFS approach: use a queue of pairs. Enqueue (left.left, right.right) and (left.right, right.left) together.',
    ],
    starterCode: {
      python: '# class TreeNode:\n#     def __init__(self, val=0, left=None, right=None):\n#         self.val = val\n#         self.left = left\n#         self.right = right\ndef isSymmetric(root) -> bool:\n    # Write your solution here\n    pass',
      javascript: '// function TreeNode(val, left, right) { this.val = val; this.left = left || null; this.right = right || null; }\nfunction isSymmetric(root) {\n    // Write your solution here\n}',
      java: '// class TreeNode { int val; TreeNode left, right; TreeNode(int val) { this.val = val; } }\nclass Solution {\n    public boolean isSymmetric(TreeNode root) {\n        // Write your solution here\n    }\n}',
      cpp: '// struct TreeNode { int val; TreeNode *left, *right; TreeNode(int x) : val(x), left(nullptr), right(nullptr) {} };\nclass Solution {\npublic:\n    bool isSymmetric(TreeNode* root) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { label: 'Case 1', displayInput: 'root=[1,2,2,3,4,4,3]', expected: 'true' },
      { label: 'Case 2', displayInput: 'root=[1,2,2,null,3,null,3]', expected: 'false' },
      { label: 'Edge Case', displayInput: 'root=[1]', expected: 'true', isEdgeCase: true },
    ],
  },

  path_sum: {
    id: 'path_sum',
    title: 'Path Sum',
    difficulty: 'Easy',
    difficultyColor: '#4ade80',
    difficultyBg: '#1a3a1a',
    pattern: 'Tree',
    description: `Given the root of a binary tree and an integer targetSum, return true if the tree has a root-to-leaf path such that adding up all values along the path equals targetSum.`,
    examples: [
      { input: 'root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22', output: 'true (path: 5→4→11→2)' },
      { input: 'root = [1,2,3], targetSum = 5', output: 'false' },
      { input: 'root = [], targetSum = 0', output: 'false' },
    ],
    constraints: [
      '0 <= number of nodes <= 5000',
      '-1000 <= Node.val <= 1000',
      '-1000 <= targetSum <= 1000',
    ],
    edgeCases: [
      'What if the tree is empty? Return false — no paths exist.',
      'What if a node has only one child? That node is not a leaf — do not count paths that end there.',
      "Subtract as you go: reduce targetSum by each node's value. At a leaf, check if the remainder equals that leaf's value.",
    ],
    starterCode: {
      python: '# class TreeNode:\n#     def __init__(self, val=0, left=None, right=None):\n#         self.val = val\n#         self.left = left\n#         self.right = right\ndef hasPathSum(root, targetSum: int) -> bool:\n    # Write your solution here\n    pass',
      javascript: '// function TreeNode(val, left, right) { this.val = val; this.left = left || null; this.right = right || null; }\nfunction hasPathSum(root, targetSum) {\n    // Write your solution here\n}',
      java: '// class TreeNode { int val; TreeNode left, right; TreeNode(int val) { this.val = val; } }\nclass Solution {\n    public boolean hasPathSum(TreeNode root, int targetSum) {\n        // Write your solution here\n    }\n}',
      cpp: '// struct TreeNode { int val; TreeNode *left, *right; TreeNode(int x) : val(x), left(nullptr), right(nullptr) {} };\nclass Solution {\npublic:\n    bool hasPathSum(TreeNode* root, int targetSum) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { label: 'Case 1', displayInput: 'root=[5,4,8,11,null,13,4,7,2,...], targetSum=22', expected: 'true' },
      { label: 'Case 2', displayInput: 'root=[1,2,3], targetSum=5', expected: 'false' },
      { label: 'Edge Case', displayInput: 'root=[], targetSum=0', expected: 'false', isEdgeCase: true },
    ],
  },

  merge_two_sorted_lists: {
    id: 'merge_two_sorted_lists',
    title: 'Merge Two Sorted Lists',
    difficulty: 'Easy',
    difficultyColor: '#4ade80',
    difficultyBg: '#1a3a1a',
    pattern: 'Linked List',
    description: `You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list by splicing together the nodes of the first two lists. Return the head of the merged linked list.`,
    examples: [
      { input: 'list1 = [1,2,4], list2 = [1,3,4]', output: '[1,1,2,3,4,4]' },
      { input: 'list1 = [], list2 = []', output: '[]' },
      { input: 'list1 = [], list2 = [0]', output: '[0]' },
    ],
    constraints: [
      '0 <= number of nodes in each list <= 50',
      '-100 <= Node.val <= 100',
      'Both list1 and list2 are sorted in non-decreasing order.',
    ],
    edgeCases: [
      'What if one list is empty? Return the other list as-is — no merging needed.',
      'Are you creating new nodes or re-linking existing ones? Re-link existing nodes — no need to allocate new ones.',
      'Recursion approach: the smaller head becomes the next of whichever list you recurse into.',
    ],
    starterCode: {
      python: '# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\ndef mergeTwoLists(list1, list2):\n    # Write your solution here\n    pass',
      javascript: '// function ListNode(val, next) { this.val = val; this.next = next || null; }\nfunction mergeTwoLists(list1, list2) {\n    // Write your solution here\n}',
      java: '// class ListNode { int val; ListNode next; ListNode(int val) { this.val = val; } }\nclass Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        // Write your solution here\n    }\n}',
      cpp: '// struct ListNode { int val; ListNode *next; ListNode(int x) : val(x), next(nullptr) {} };\nclass Solution {\npublic:\n    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { label: 'Case 1', displayInput: 'list1=[1,2,4], list2=[1,3,4]', expected: '[1,1,2,3,4,4]' },
      { label: 'Case 2', displayInput: 'list1=[], list2=[0]', expected: '[0]' },
      { label: 'Edge Case', displayInput: 'list1=[], list2=[]', expected: '[]', isEdgeCase: true },
    ],
  },

  remove_duplicates_sorted_array: {
    id: 'remove_duplicates_sorted_array',
    title: 'Remove Duplicates from Sorted Array',
    difficulty: 'Easy',
    difficultyColor: '#4ade80',
    difficultyBg: '#1a3a1a',
    pattern: 'Two Pointers',
    description: `Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place so each unique element appears only once. Return k — the number of unique elements. The relative order must be kept.`,
    examples: [
      { input: 'nums = [1,1,2]', output: '2 (nums becomes [1,2,...])' },
      { input: 'nums = [0,0,1,1,1,2,2,3,3,4]', output: '5 (nums becomes [0,1,2,3,4,...])' },
    ],
    constraints: [
      '1 <= nums.length <= 3 * 10^4',
      '-100 <= nums[i] <= 100',
      'nums is sorted in non-decreasing order.',
    ],
    edgeCases: [
      'What if nums has only one element? k = 1 — already unique.',
      'Two-pointer trick: slow pointer k tracks where to place the next unique element; fast pointer scans ahead.',
      'Do you need O(1) extra space? Yes — modify in-place, no extra arrays.',
    ],
    starterCode: {
      python: 'def removeDuplicates(nums) -> int:\n    # Write your solution here\n    pass',
      javascript: 'function removeDuplicates(nums) {\n    // Write your solution here\n}',
      java: 'class Solution {\n    public int removeDuplicates(int[] nums) {\n        // Write your solution here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    int removeDuplicates(vector<int>& nums) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { label: 'Case 1', displayInput: 'nums=[1,1,2]', expected: '2' },
      { label: 'Case 2', displayInput: 'nums=[0,0,1,1,1,2,2,3,3,4]', expected: '5' },
      { label: 'Edge Case', displayInput: 'nums=[1]', expected: '1', isEdgeCase: true },
    ],
  },

  move_zeroes: {
    id: 'move_zeroes',
    title: 'Move Zeroes',
    difficulty: 'Easy',
    difficultyColor: '#4ade80',
    difficultyBg: '#1a3a1a',
    pattern: 'Two Pointers',
    description: `Given an integer array nums, move all 0s to the end while maintaining the relative order of the non-zero elements. You must do this in-place without making a copy of the array.`,
    examples: [
      { input: 'nums = [0,1,0,3,12]', output: '[1,3,12,0,0]' },
      { input: 'nums = [0]', output: '[0]' },
    ],
    constraints: [
      '1 <= nums.length <= 10^4',
      '-2^31 <= nums[i] <= 2^31 - 1',
    ],
    edgeCases: [
      'What if the array has no zeroes? No movement needed — it already satisfies the condition.',
      'What if all elements are zero? Nothing moves — result is all zeros.',
      'Two-pointer trick: keep a slow pointer for the next non-zero slot; swap when you find a non-zero element.',
    ],
    starterCode: {
      python: 'def moveZeroes(nums) -> None:\n    # Modify nums in-place. Return nums for the test runner.\n    pass\n    return nums',
      javascript: 'function moveZeroes(nums) {\n    // Modify nums in-place. Return nums for the test runner.\n    return nums;\n}',
      java: 'class Solution {\n    public void moveZeroes(int[] nums) {\n        // Write your solution here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    void moveZeroes(vector<int>& nums) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { label: 'Case 1', displayInput: 'nums=[0,1,0,3,12]', expected: '[1,3,12,0,0]' },
      { label: 'Case 2', displayInput: 'nums=[0]', expected: '[0]' },
      { label: 'Edge Case', displayInput: 'nums=[1]', expected: '[1]', isEdgeCase: true },
    ],
  },

  three_sum: {
    id: 'three_sum',
    title: '3Sum',
    difficulty: 'Medium',
    difficultyColor: '#fbbf24',
    difficultyBg: '#2a1f00',
    pattern: 'Two Pointers',
    description: `Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i, j, k are distinct indices, nums[i] + nums[j] + nums[k] == 0, and the solution set must not contain duplicate triplets.`,
    examples: [
      { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]' },
      { input: 'nums = [0,1,1]', output: '[]' },
      { input: 'nums = [0,0,0]', output: '[[0,0,0]]' },
    ],
    constraints: [
      '3 <= nums.length <= 3000',
      '-10^5 <= nums[i] <= 10^5',
    ],
    edgeCases: [
      'How do you avoid duplicate triplets? Sort first, then skip duplicate values for both the outer and inner pointers.',
      'What if nums = [0,0,0,0]? Only [[0,0,0]] — not four separate triplets.',
      'Two-pointer approach: fix i, then use left=i+1 and right=end to find pairs summing to -nums[i].',
    ],
    starterCode: {
      python: 'def threeSum(nums):\n    # Write your solution here\n    pass',
      javascript: 'function threeSum(nums) {\n    // Write your solution here\n}',
      java: 'class Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        // Write your solution here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { label: 'Case 1', displayInput: 'nums=[-1,0,1,2,-1,-4]', expected: '[[-1,-1,2],[-1,0,1]]' },
      { label: 'Case 2', displayInput: 'nums=[0,1,1]', expected: '[]' },
      { label: 'Edge Case', displayInput: 'nums=[0,0,0]', expected: '[[0,0,0]]', isEdgeCase: true },
    ],
  },

  container_with_most_water: {
    id: 'container_with_most_water',
    title: 'Container With Most Water',
    difficulty: 'Medium',
    difficultyColor: '#fbbf24',
    difficultyBg: '#2a1f00',
    pattern: 'Two Pointers',
    description: `You are given an integer array height of length n. There are n vertical lines such that the ith line has height[i]. Find two lines that form a container holding the most water. Return the maximum amount of water.`,
    examples: [
      { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49' },
      { input: 'height = [1,1]', output: '1' },
    ],
    constraints: [
      'n == height.length',
      '2 <= n <= 10^5',
      '0 <= height[i] <= 10^4',
    ],
    edgeCases: [
      'Why always move the shorter pointer? Moving the taller one keeps the same limiting height but shrinks width — no gain possible.',
      'What if all heights are equal? Width determines everything — the widest pair wins.',
      'Does a wider container always hold more? No — a taller narrow one can beat it.',
    ],
    starterCode: {
      python: 'def maxArea(height) -> int:\n    # Write your solution here\n    pass',
      javascript: 'function maxArea(height) {\n    // Write your solution here\n}',
      java: 'class Solution {\n    public int maxArea(int[] height) {\n        // Write your solution here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { label: 'Case 1', displayInput: 'height=[1,8,6,2,5,4,8,3,7]', expected: '49' },
      { label: 'Case 2', displayInput: 'height=[1,1]', expected: '1' },
      { label: 'Edge Case', displayInput: 'height=[4,3,2,1,4]', expected: '16', isEdgeCase: true },
    ],
  },

  longest_common_subsequence: {
    id: 'longest_common_subsequence',
    title: 'Longest Common Subsequence',
    difficulty: 'Medium',
    difficultyColor: '#fbbf24',
    difficultyBg: '#2a1f00',
    pattern: 'DP',
    description: `Given two strings text1 and text2, return the length of their longest common subsequence. A subsequence is derived by deleting some (or no) elements without changing the order of the remaining elements.`,
    examples: [
      { input: 'text1 = "abcde", text2 = "ace"', output: '3 (subsequence "ace")' },
      { input: 'text1 = "abc", text2 = "abc"', output: '3' },
      { input: 'text1 = "abc", text2 = "def"', output: '0 (no common subsequence)' },
    ],
    constraints: [
      '1 <= text1.length, text2.length <= 1000',
      'text1 and text2 consist of only lowercase English characters.',
    ],
    edgeCases: [
      'What if both strings are identical? The LCS is the full string itself.',
      'What if they share no characters? The LCS length is 0.',
      'DP table: dp[i][j] = LCS of text1[:i] and text2[:j]. If characters match, dp[i][j] = dp[i-1][j-1] + 1.',
    ],
    starterCode: {
      python: 'def longestCommonSubsequence(text1: str, text2: str) -> int:\n    # Write your solution here\n    pass',
      javascript: 'function longestCommonSubsequence(text1, text2) {\n    // Write your solution here\n}',
      java: 'class Solution {\n    public int longestCommonSubsequence(String text1, String text2) {\n        // Write your solution here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    int longestCommonSubsequence(string text1, string text2) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { label: 'Case 1', displayInput: 'text1="abcde", text2="ace"', expected: '3' },
      { label: 'Case 2', displayInput: 'text1="abc", text2="abc"', expected: '3' },
      { label: 'Edge Case', displayInput: 'text1="abc", text2="def"', expected: '0', isEdgeCase: true },
    ],
  },

  house_robber: {
    id: 'house_robber',
    title: 'House Robber',
    difficulty: 'Medium',
    difficultyColor: '#fbbf24',
    difficultyBg: '#2a1f00',
    pattern: 'DP',
    description: `You are a professional robber planning to rob houses along a street. Robbing two adjacent houses triggers an alarm. Given an integer array nums representing the amount of money at each house, return the maximum amount you can rob tonight without alerting the police.`,
    examples: [
      { input: 'nums = [1,2,3,1]', output: '4 (rob house 1 and house 3: 1+3=4)' },
      { input: 'nums = [2,7,9,3,1]', output: '12 (rob house 1, 3, and 5: 2+9+1=12)' },
    ],
    constraints: [
      '1 <= nums.length <= 100',
      '0 <= nums[i] <= 400',
    ],
    edgeCases: [
      'What if nums has only one house? Rob it — return nums[0].',
      'What if nums has two houses? Return the max of the two — you can only rob one.',
      'Recurrence: dp[i] = max(dp[i-1], dp[i-2] + nums[i]) — skip this house or rob it.',
    ],
    starterCode: {
      python: 'def rob(nums) -> int:\n    # Write your solution here\n    pass',
      javascript: 'function rob(nums) {\n    // Write your solution here\n}',
      java: 'class Solution {\n    public int rob(int[] nums) {\n        // Write your solution here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    int rob(vector<int>& nums) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { label: 'Case 1', displayInput: 'nums=[1,2,3,1]', expected: '4' },
      { label: 'Case 2', displayInput: 'nums=[2,7,9,3,1]', expected: '12' },
      { label: 'Edge Case', displayInput: 'nums=[1]', expected: '1', isEdgeCase: true },
    ],
  },

  coin_change: {
    id: 'coin_change',
    title: 'Coin Change',
    difficulty: 'Medium',
    difficultyColor: '#fbbf24',
    difficultyBg: '#2a1f00',
    pattern: 'DP',
    description: `You are given an integer array coins representing coin denominations and an integer amount. Return the fewest number of coins needed to make up that amount. If it is impossible, return -1. You may use each coin type an unlimited number of times.`,
    examples: [
      { input: 'coins = [1,2,5], amount = 11', output: '3 (5+5+1)' },
      { input: 'coins = [2], amount = 3', output: '-1 (impossible)' },
      { input: 'coins = [1], amount = 0', output: '0' },
    ],
    constraints: [
      '1 <= coins.length <= 12',
      '1 <= coins[i] <= 2^31 - 1',
      '0 <= amount <= 10^4',
    ],
    edgeCases: [
      'What if amount = 0? The answer is 0 — no coins needed.',
      'What if no combination can reach amount? Return -1.',
      'Bottom-up DP: dp[i] = min coins to make amount i. Initialize dp[0]=0, all others to infinity.',
    ],
    starterCode: {
      python: 'def coinChange(coins, amount: int) -> int:\n    # Write your solution here\n    pass',
      javascript: 'function coinChange(coins, amount) {\n    // Write your solution here\n}',
      java: 'class Solution {\n    public int coinChange(int[] coins, int amount) {\n        // Write your solution here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { label: 'Case 1', displayInput: 'coins=[1,2,5], amount=11', expected: '3' },
      { label: 'Case 2', displayInput: 'coins=[2], amount=3', expected: '-1' },
      { label: 'Edge Case', displayInput: 'coins=[1], amount=0', expected: '0', isEdgeCase: true },
    ],
  },

  word_search: {
    id: 'word_search',
    title: 'Word Search',
    difficulty: 'Medium',
    difficultyColor: '#fbbf24',
    difficultyBg: '#2a1f00',
    pattern: 'Backtracking',
    description: `Given an m x n grid of characters board and a string word, return true if word exists in the grid. The word can be constructed from letters of sequentially adjacent cells (horizontally or vertically), and the same cell may not be used more than once.`,
    examples: [
      { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"', output: 'true' },
      { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"', output: 'true' },
      { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"', output: 'false' },
    ],
    constraints: [
      'm == board.length',
      'n == board[i].length',
      '1 <= m, n <= 6',
      '1 <= word.length <= 15',
    ],
    edgeCases: [
      'How do you prevent reusing a cell? Mark it as visited before recursing, then restore it after (backtrack).',
      'What if the first letter of word is not in board? Return false immediately.',
      'DFS from every cell: try all four directions recursively, continuing only when the next character matches.',
    ],
    starterCode: {
      python: 'def exist(board, word: str) -> bool:\n    # Write your solution here\n    pass',
      javascript: 'function exist(board, word) {\n    // Write your solution here\n}',
      java: 'class Solution {\n    public boolean exist(char[][] board, String word) {\n        // Write your solution here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    bool exist(vector<vector<char>>& board, string word) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { label: 'Case 1', displayInput: 'board=ABCE/SFCS/ADEE, word="ABCCED"', expected: 'true' },
      { label: 'Case 2', displayInput: 'board=ABCE/SFCS/ADEE, word="SEE"', expected: 'true' },
      { label: 'Edge Case', displayInput: 'board=ABCE/SFCS/ADEE, word="ABCB"', expected: 'false', isEdgeCase: true },
    ],
  },

  permutations: {
    id: 'permutations',
    title: 'Permutations',
    difficulty: 'Medium',
    difficultyColor: '#fbbf24',
    difficultyBg: '#2a1f00',
    pattern: 'Backtracking',
    description: `Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order.`,
    examples: [
      { input: 'nums = [1,2,3]', output: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]' },
      { input: 'nums = [0,1]', output: '[[0,1],[1,0]]' },
      { input: 'nums = [1]', output: '[[1]]' },
    ],
    constraints: [
      '1 <= nums.length <= 6',
      '-10 <= nums[i] <= 10',
      'All integers in nums are unique.',
    ],
    edgeCases: [
      'What if nums has one element? Return [[nums[0]]] — only one permutation.',
      'How many permutations are there? n! — for nums.length=6 that is 720 results.',
      'Backtracking: at each step, pick an unused number, recurse, then unpick it (restore state).',
    ],
    starterCode: {
      python: 'def permute(nums):\n    # Write your solution here\n    pass',
      javascript: 'function permute(nums) {\n    // Write your solution here\n}',
      java: 'class Solution {\n    public List<List<Integer>> permute(int[] nums) {\n        // Write your solution here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    vector<vector<int>> permute(vector<int>& nums) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { label: 'Case 1', displayInput: 'nums=[1,2,3]', expected: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]' },
      { label: 'Case 2', displayInput: 'nums=[0,1]', expected: '[[0,1],[1,0]]' },
      { label: 'Edge Case', displayInput: 'nums=[1]', expected: '[[1]]', isEdgeCase: true },
    ],
  },

  rotate_image: {
    id: 'rotate_image',
    title: 'Rotate Image',
    difficulty: 'Medium',
    difficultyColor: '#fbbf24',
    difficultyBg: '#2a1f00',
    pattern: 'Matrix',
    description: `You are given an n x n 2D matrix representing an image. Rotate the image by 90 degrees clockwise in-place. You must modify the input matrix directly without allocating another 2D matrix.`,
    examples: [
      { input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', output: '[[7,4,1],[8,5,2],[9,6,3]]' },
      { input: 'matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]', output: '[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]' },
    ],
    constraints: [
      'n == matrix.length == matrix[i].length',
      '1 <= n <= 20',
      '-1000 <= matrix[i][j] <= 1000',
    ],
    edgeCases: [
      'What if n = 1? A single-element matrix rotates to itself.',
      'Two-step trick: transpose the matrix (swap [i][j] with [j][i]), then reverse each row.',
      'Return matrix at the end — the function modifies in-place and returns it for the test runner.',
    ],
    starterCode: {
      python: 'def rotate(matrix) -> None:\n    # Modify matrix in-place. Return matrix for the test runner.\n    pass\n    return matrix',
      javascript: 'function rotate(matrix) {\n    // Modify matrix in-place. Return matrix for the test runner.\n    return matrix;\n}',
      java: 'class Solution {\n    public void rotate(int[][] matrix) {\n        // Write your solution here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    void rotate(vector<vector<int>>& matrix) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { label: 'Case 1', displayInput: 'matrix=[[1,2,3],[4,5,6],[7,8,9]]', expected: '[[7,4,1],[8,5,2],[9,6,3]]' },
      { label: 'Case 2', displayInput: 'matrix=[[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]', expected: '[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]' },
      { label: 'Edge Case', displayInput: 'matrix=[[1]]', expected: '[[1]]', isEdgeCase: true },
    ],
  },

  spiral_matrix: {
    id: 'spiral_matrix',
    title: 'Spiral Matrix',
    difficulty: 'Medium',
    difficultyColor: '#fbbf24',
    difficultyBg: '#2a1f00',
    pattern: 'Matrix',
    description: `Given an m x n matrix, return all elements of the matrix in spiral order (clockwise from the top-left corner).`,
    examples: [
      { input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', output: '[1,2,3,6,9,8,7,4,5]' },
      { input: 'matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]', output: '[1,2,3,4,8,12,11,10,9,5,6,7]' },
    ],
    constraints: [
      'm == matrix.length',
      'n == matrix[i].length',
      '1 <= m, n <= 10',
      '-100 <= matrix[i][j] <= 100',
    ],
    edgeCases: [
      'What if the matrix is a single row? Return the row itself.',
      'What if the matrix is a single column? Return elements top-to-bottom.',
      'Layer-by-layer approach: shrink the boundaries (top, bottom, left, right) as you traverse each ring.',
    ],
    starterCode: {
      python: 'def spiralOrder(matrix):\n    # Write your solution here\n    pass',
      javascript: 'function spiralOrder(matrix) {\n    // Write your solution here\n}',
      java: 'class Solution {\n    public List<Integer> spiralOrder(int[][] matrix) {\n        // Write your solution here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    vector<int> spiralOrder(vector<vector<int>>& matrix) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { label: 'Case 1', displayInput: 'matrix=[[1,2,3],[4,5,6],[7,8,9]]', expected: '[1,2,3,6,9,8,7,4,5]' },
      { label: 'Case 2', displayInput: 'matrix=[[1,2,3,4],[5,6,7,8],[9,10,11,12]]', expected: '[1,2,3,4,8,12,11,10,9,5,6,7]' },
      { label: 'Edge Case', displayInput: 'matrix=[[1]]', expected: '[1]', isEdgeCase: true },
    ],
  },
};

const LANGUAGES = [
  { label: 'Python', value: 'python', judge0Id: 71 },
  { label: 'JavaScript', value: 'javascript', judge0Id: 63 },
  { label: 'Java', value: 'java', judge0Id: 62 },
  { label: 'C++', value: 'cpp', judge0Id: 54 },
];

const AI_MODES = ['hint', 'logic', 'humanize', 'debug', 'optimize'];
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

  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const initialProblem = searchParams?.get('problem') && PROBLEMS[searchParams.get('problem')]
    ? searchParams.get('problem')
    : 'two_sum';

  const [problemId, setProblemId] = useState(initialProblem);
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [code, setCode] = useState(PROBLEMS[initialProblem].starterCode['python']);
  const [aiMode, setAiMode] = useState('hint');
  const [aiMessage, setAiMessage] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [credits, setCredits] = useState({ daily: 5, dailyLimit: 5, pack: 0, resetAt: null });
  const [aiHistory, setAiHistory] = useState([
    { role: 'assistant', content: getWelcomeMessage(PROBLEMS[initialProblem].title) }
  ]);
  const [streamingContent, setStreamingContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [executeResult, setExecuteResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [diffFilter, setDiffFilter] = useState('All');
  const [patternFilter, setPatternFilter] = useState('All');
  const chatEndRef = useRef(null);
  const dropdownRef = useRef(null);

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

  useEffect(() => {
    setMounted(true);
    axios.get('/api/credits/balance')
      .then(res => setCredits({
        daily: res.data.dailyCredits,
        dailyLimit: res.data.dailyLimit,
        pack: res.data.packCredits,
        resetAt: res.data.resetAt,
      }))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (!dropdownOpen) return;
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  function handleShare() {
    const url = `${window.location.origin}/compiler?problem=${problemId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const problem = PROBLEMS[problemId];
  const problemNumber = PROBLEM_KEYS.indexOf(problemId) + 1;

  const filteredProblems = Object.values(PROBLEMS).filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (diffFilter === 'All' || p.difficulty === diffFilter) &&
    (patternFilter === 'All' || p.pattern === patternFilter)
  );

  function selectProblem(newId) {
    const newProblem = PROBLEMS[newId];
    setProblemId(newId);
    setCode(newProblem.starterCode[language.value]);
    setExecuteResult(null);
    setAiMessage('');
    setDropdownOpen(false);
    setSearchQuery('');
    setDiffFilter('All');
    setPatternFilter('All');
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
    if (!aiMessage.trim() || isPaywalled || isStreaming) return;

    const userMsg = aiMessage;
    const currentHistory = aiHistory;

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
      if (res.data.creditsRemaining) {
        setCredits(prev => ({ ...prev, daily: res.data.creditsRemaining.daily, pack: res.data.creditsRemaining.pack }));
      }
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
      if (err.response?.status === 402) {
        setCredits(prev => ({
          ...prev,
          daily: 0,
          pack: 0,
          ...(err.response.data?.resetAt ? { resetAt: err.response.data.resetAt } : {}),
        }));
        setAiHistory(prev => prev.slice(0, -1));
      }
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

      const allPassed = res.data.type === 'test' && res.data.passed === res.data.total && res.data.total > 0;
      axios.post('/api/attempts/update', { problemId, solved: allPassed }).catch(() => {});
    } catch (err) {
      console.error(err);
      setIsRunning(false);
      setExecuteResult({ error: 'Failed to run code. Check your connection and try again.' });
    }
  }

  const isPaywalled = credits.daily === 0 && credits.pack === 0;
  const dailyUsed = credits.dailyLimit - credits.daily;
  const progressPercent = Math.min((dailyUsed / credits.dailyLimit) * 100, 100);
  const progressColor = credits.daily === 0 ? '#ef4444' : credits.daily <= 1 ? '#f97316' : '#3B82F6';

  const avatarInitial = session?.user?.name?.[0]?.toUpperCase()
    || session?.user?.email?.[0]?.toUpperCase()
    || null;

  if (!mounted) {
    return (
      <div style={{
        display: 'flex', height: '100vh', background: '#0B0F19',
        alignItems: 'center', justifyContent: 'center',
        color: '#3f3f46', fontSize: '14px', fontFamily: 'system-ui',
      }}>
        Loading TutorAI...
      </div>
    );
  }

  if (isMobile) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999, background: '#0B0F19',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '32px', textAlign: 'center',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>💻</div>
        <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
          Desktop Required
        </h2>
        <p style={{ color: '#71717a', fontSize: '14px', lineHeight: '1.6', maxWidth: '280px' }}>
          TutorAI works best on a desktop or laptop. Mobile support is coming soon.
        </p>
        <a href="/" style={{ marginTop: '24px', color: '#3B82F6', fontSize: '13px' }}>← Back to home</a>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', background: '#0B0F19', color: '#f4f4f5', overflow: 'hidden' }}>

      {/* TOP BAR */}
      <div style={{ height: '48px', flexShrink: 0, display: 'flex', alignItems: 'center', padding: '0 16px', borderBottom: '1px solid #1e1e1e', background: '#0d1117', gap: '12px' }}>

        {/* Logo + nav icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <a href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '7px', textDecoration: 'none' }}>
            <span style={{ color: '#3B82F6', fontWeight: '700', fontSize: '14px', fontFamily: 'monospace', letterSpacing: '-0.02em' }}>&lt;/&gt;</span>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#f4f4f5', letterSpacing: '-0.01em' }}>TutorAI</span>
          </a>
          <div style={{ width: '1px', height: '14px', background: '#27272a', margin: '0 2px' }} />
          <a href="/dashboard/profile" title="Profile" style={{ color: '#52525b', display: 'flex', alignItems: 'center', textDecoration: 'none', transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#a1a1aa'}
            onMouseLeave={e => e.currentTarget.style.color = '#52525b'}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </a>
          <a href="/dashboard/settings" title="Settings" style={{ color: '#52525b', display: 'flex', alignItems: 'center', textDecoration: 'none', transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#a1a1aa'}
            onMouseLeave={e => e.currentTarget.style.color = '#52525b'}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </a>
        </div>

        {/* Problem selector — center */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen(o => !o)}
              style={{
                background: '#0f1729', color: '#f4f4f5', border: '1px solid #1e1e1e',
                borderRadius: '6px', padding: '5px 10px', fontSize: '13px',
                cursor: 'pointer', outline: 'none', maxWidth: '280px',
                display: 'flex', alignItems: 'center', gap: '6px',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '220px' }}>
                {problem.title}
              </span>
              <span style={{ fontSize: '10px', color: '#52525b', flexShrink: 0 }}>▾</span>
            </button>

            {dropdownOpen && (
              <div style={{
                position: 'absolute', top: '110%', left: '50%', transform: 'translateX(-50%)',
                background: '#0d1117', border: '1px solid #1e1e1e', borderRadius: '8px',
                zIndex: 1000, minWidth: '340px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              }}>
                <div style={{ padding: '10px 12px', borderBottom: '1px solid #1e1e1e' }}>
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search problems..."
                    style={{
                      width: '100%', padding: '6px 10px', borderRadius: '6px',
                      background: '#0B0F19', border: '1px solid #1e1e1e',
                      color: '#f4f4f5', fontSize: '12px', outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#3B82F6'; }}
                    onBlur={e => { e.target.style.borderColor = '#1e1e1e'; }}
                  />
                </div>
                <div style={{ padding: '8px 12px', borderBottom: '1px solid #1e1e1e', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {['All', 'Easy', 'Medium', 'Hard'].map(d => (
                    <button
                      key={d}
                      onClick={() => setDiffFilter(d)}
                      style={{
                        padding: '3px 10px', borderRadius: '20px', border: 'none',
                        fontSize: '11px', fontWeight: '500', cursor: 'pointer',
                        background: diffFilter === d ? '#3B82F6' : '#0f1729',
                        color: diffFilter === d ? '#fff' : '#71717a',
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
                <div style={{ padding: '8px 12px', borderBottom: '1px solid #1e1e1e', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                  {['All', 'HashMap', 'Sliding Window', 'Stack', 'Binary Search', 'DP', 'Linked List', 'BFS/DFS', 'Greedy', 'Array', 'Math', 'Tree', 'Two Pointers', 'Backtracking', 'Matrix'].map(pat => (
                    <button
                      key={pat}
                      onClick={() => setPatternFilter(pat)}
                      style={{
                        padding: '3px 9px', borderRadius: '20px', border: 'none',
                        fontSize: '11px', fontWeight: '500', cursor: 'pointer',
                        background: patternFilter === pat ? '#3B82F6' : '#0f1729',
                        color: patternFilter === pat ? '#fff' : '#71717a',
                      }}
                    >
                      {pat}
                    </button>
                  ))}
                </div>
                <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                  {filteredProblems.length === 0 ? (
                    <div style={{ padding: '16px', textAlign: 'center', color: '#52525b', fontSize: '12px' }}>
                      No problems match
                    </div>
                  ) : filteredProblems.map(p => (
                    <button
                      key={p.id}
                      onClick={() => selectProblem(p.id)}
                      style={{
                        width: '100%', textAlign: 'left', padding: '9px 14px',
                        background: p.id === problemId ? '#0f1729' : 'transparent',
                        border: 'none', cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'space-between', gap: '8px',
                        color: '#f4f4f5', fontSize: '13px',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#0f1729'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = p.id === problemId ? '#0f1729' : 'transparent'; }}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <span style={{ color: '#3f3f46', marginRight: '8px', fontSize: '12px' }}>
                          {PROBLEM_KEYS.indexOf(p.id) + 1}.
                        </span>
                        {p.title}
                      </span>
                      <span style={{
                        fontSize: '10px', padding: '2px 7px', borderRadius: '4px',
                        background: p.difficultyBg, color: p.difficultyColor,
                        fontWeight: '600', flexShrink: 0,
                      }}>
                        {p.difficulty}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <span style={{
            fontSize: '11px', padding: '2px 8px', borderRadius: '4px',
            background: problem.difficultyBg, color: problem.difficultyColor,
            fontWeight: '600', letterSpacing: '0.02em', flexShrink: 0,
          }}>
            {problem.difficulty}
          </span>
          <button
            onClick={handleShare}
            title="Copy share link"
            style={{
              background: 'transparent',
              border: `1px solid ${copied ? '#1f3a1f' : '#1e1e1e'}`,
              color: copied ? '#4ade80' : '#71717a',
              borderRadius: '6px', padding: '4px 9px', fontSize: '11px',
              fontWeight: '500', cursor: 'pointer', display: 'flex',
              alignItems: 'center', gap: '5px', transition: 'color 0.15s, border-color 0.15s',
              flexShrink: 0,
            }}
          >
            <span>📋</span>
            <span>{copied ? 'Copied!' : 'Share'}</span>
          </button>
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
                  <span style={{ fontSize: '11px', color: '#3f3f46' }}>
                    {credits.daily} daily{credits.pack > 0 ? ` + ${credits.pack} pack` : ''} left
                  </span>
                  <div style={{ height: '2px', width: '72px', background: 'rgba(255,255,255,0.08)', borderRadius: '1px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${progressPercent}%`, background: progressColor, borderRadius: '1px', transition: 'all 0.3s ease' }} />
                  </div>
                </div>

                {isPaywalled ? (
                  <div style={{ background: '#0d1117', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: '#f4f4f5', margin: '0 0 4px' }}>
                      No credits remaining
                    </p>
                    <p style={{ fontSize: '12px', color: '#52525b', margin: '0 0 12px' }}>
                      {credits.resetAt
                        ? `Resets in ~${Math.max(1, Math.ceil((new Date(credits.resetAt) - new Date()) / 3600000))}h`
                        : 'Daily credits reset every 24 hours'}
                    </p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{
                        flex: 1, background: '#18181b', color: '#71717a',
                        border: '1px solid #27272a', borderRadius: '6px',
                        padding: '8px 12px', fontSize: '12px', fontWeight: '600', cursor: 'not-allowed',
                      }}>
                        Buy Credits — Soon
                      </button>
                      <button style={{
                        flex: 1, background: '#3B82F6', color: '#fff', border: 'none',
                        borderRadius: '6px', padding: '8px 12px', fontSize: '12px',
                        fontWeight: '600', cursor: 'not-allowed', opacity: 0.65,
                      }}>
                        Subscribe — Soon
                      </button>
                    </div>
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
