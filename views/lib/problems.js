export const PROBLEMS = [
  { id: 'two_sum',                       title: 'Two Sum',                                      difficulty: 'Easy',   pattern: 'HashMap'       },
  { id: 'longest_substring',             title: 'Longest Substring Without Repeating Chars',    difficulty: 'Medium', pattern: 'Sliding Window' },
  { id: 'valid_parentheses',             title: 'Valid Parentheses',                            difficulty: 'Easy',   pattern: 'Stack'         },
  { id: 'binary_search',                 title: 'Binary Search',                                difficulty: 'Easy',   pattern: 'Binary Search' },
  { id: 'maximum_subarray',              title: "Maximum Subarray (Kadane's)",                  difficulty: 'Medium', pattern: 'DP'            },
  { id: 'reverse_linked_list',           title: 'Reverse Linked List',                          difficulty: 'Easy',   pattern: 'Linked List'   },
  { id: 'number_of_islands',             title: 'Number of Islands',                            difficulty: 'Medium', pattern: 'BFS/DFS'       },
  { id: 'climbing_stairs',               title: 'Climbing Stairs',                              difficulty: 'Easy',   pattern: 'DP'            },
  { id: 'merge_intervals',               title: 'Merge Intervals',                              difficulty: 'Medium', pattern: 'Greedy'        },
  { id: 'binary_tree_level_order',       title: 'Binary Tree Level Order Traversal',            difficulty: 'Medium', pattern: 'BFS/DFS'       },
  { id: 'contains_duplicate',            title: 'Contains Duplicate',                           difficulty: 'Easy',   pattern: 'HashMap'       },
  { id: 'maximum_depth_binary_tree',     title: 'Maximum Depth of Binary Tree',                 difficulty: 'Easy',   pattern: 'BFS/DFS'       },
  { id: 'linked_list_cycle',             title: 'Linked List Cycle',                            difficulty: 'Easy',   pattern: 'Linked List'   },
  { id: 'find_minimum_rotated',          title: 'Find Minimum in Rotated Sorted Array',         difficulty: 'Medium', pattern: 'Binary Search' },
  { id: 'product_except_self',           title: 'Product of Array Except Self',                 difficulty: 'Medium', pattern: 'Array'         },
  { id: 'valid_anagram',                 title: 'Valid Anagram',                                difficulty: 'Easy',   pattern: 'HashMap'       },
  { id: 'best_time_to_buy_sell_stock',   title: 'Best Time to Buy and Sell Stock',              difficulty: 'Easy',   pattern: 'Sliding Window'},
  { id: 'missing_number',               title: 'Missing Number',                               difficulty: 'Easy',   pattern: 'Math'          },
  { id: 'palindrome_number',             title: 'Palindrome Number',                            difficulty: 'Easy',   pattern: 'Math'          },
  { id: 'fizz_buzz',                     title: 'Fizz Buzz',                                    difficulty: 'Easy',   pattern: 'Math'          },
  { id: 'invert_binary_tree',            title: 'Invert Binary Tree',                           difficulty: 'Easy',   pattern: 'Tree'          },
  { id: 'symmetric_tree',               title: 'Symmetric Tree',                               difficulty: 'Easy',   pattern: 'Tree'          },
  { id: 'path_sum',                      title: 'Path Sum',                                     difficulty: 'Easy',   pattern: 'Tree'          },
  { id: 'merge_two_sorted_lists',        title: 'Merge Two Sorted Lists',                       difficulty: 'Easy',   pattern: 'Linked List'   },
  { id: 'remove_duplicates_sorted_array',title: 'Remove Duplicates from Sorted Array',          difficulty: 'Easy',   pattern: 'Two Pointers'  },
  { id: 'move_zeroes',                   title: 'Move Zeroes',                                  difficulty: 'Easy',   pattern: 'Two Pointers'  },
  { id: 'three_sum',                     title: '3Sum',                                         difficulty: 'Medium', pattern: 'Two Pointers'  },
  { id: 'container_with_most_water',     title: 'Container With Most Water',                    difficulty: 'Medium', pattern: 'Two Pointers'  },
  { id: 'longest_common_subsequence',    title: 'Longest Common Subsequence',                   difficulty: 'Medium', pattern: 'DP'            },
  { id: 'house_robber',                  title: 'House Robber',                                 difficulty: 'Medium', pattern: 'DP'            },
  { id: 'coin_change',                   title: 'Coin Change',                                  difficulty: 'Medium', pattern: 'DP'            },
  { id: 'word_search',                   title: 'Word Search',                                  difficulty: 'Medium', pattern: 'Backtracking'  },
  { id: 'permutations',                  title: 'Permutations',                                 difficulty: 'Medium', pattern: 'Backtracking'  },
  { id: 'rotate_image',                  title: 'Rotate Image',                                 difficulty: 'Medium', pattern: 'Matrix'        },
  { id: 'spiral_matrix',                 title: 'Spiral Matrix',                                difficulty: 'Medium', pattern: 'Matrix'        },

  // ── Stack ──────────────────────────────────────────────────────────────────

  {
    id: 'min_stack',
    title: 'Min Stack',
    difficulty: 'Medium',
    difficultyColor: '#fbbf24',
    difficultyBg: '#2a1f00',
    pattern: 'Stack',
    description: `Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.\n\nImplement the MinStack class:\n- MinStack() initializes the stack object.\n- push(val) pushes the element val onto the stack.\n- pop() removes the element on top of the stack.\n- top() gets the top element of the stack.\n- getMin() retrieves the minimum element in the stack.\n\nEvery operation must run in O(1) time.`,
    examples: [
      { input: 'push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()', output: '-3, 0, -2' },
      { input: 'push(1), getMin(), push(0), getMin(), pop(), getMin()', output: '1, 0, 1' },
    ],
    constraints: [
      '-2^31 <= val <= 2^31 - 1',
      'pop, top, and getMin are always called on non-empty stacks.',
      'At most 3 * 10^4 calls will be made.',
    ],
    edgeCases: [
      'What if you push the same minimum value twice then pop once? getMin() must still return that value.',
      'What if the stack has only one element? That element is both the top and the minimum.',
      'What if all pushed values are the same? getMin() should always return that value regardless of pop order.',
    ],
    starterCode: {
      python: 'class MinStack:\n    def __init__(self):\n        pass\n\n    def push(self, val: int) -> None:\n        pass\n\n    def pop(self) -> None:\n        pass\n\n    def top(self) -> int:\n        pass\n\n    def getMin(self) -> int:\n        pass',
      javascript: 'class MinStack {\n    constructor() {\n        // Write your solution here\n    }\n\n    push(val) {\n    }\n\n    pop() {\n    }\n\n    top() {\n    }\n\n    getMin() {\n    }\n}',
      java: 'class MinStack {\n    public MinStack() {\n    }\n\n    public void push(int val) {\n    }\n\n    public void pop() {\n    }\n\n    public int top() {\n        return 0;\n    }\n\n    public int getMin() {\n        return 0;\n    }\n}',
      cpp: 'class MinStack {\npublic:\n    MinStack() {\n    }\n\n    void push(int val) {\n    }\n\n    void pop() {\n    }\n\n    int top() {\n        return 0;\n    }\n\n    int getMin() {\n        return 0;\n    }\n};',
    },
    testCases: [
      { input: 'push(-2), push(0), push(-3), getMin()', expected: '-3' },
      { input: 'push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()', expected: '-3, 0, -2' },
      { input: 'push(1), getMin(), push(0), getMin(), pop(), getMin()', expected: '1, 0, 1' },
    ],
  },

  {
    id: 'daily_temperatures',
    title: 'Daily Temperatures',
    difficulty: 'Medium',
    difficultyColor: '#fbbf24',
    difficultyBg: '#2a1f00',
    pattern: 'Stack',
    description: `Given an array of integers temperatures representing daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature. If no future day is warmer, keep answer[i] == 0.`,
    examples: [
      { input: 'temperatures = [73,74,75,71,69,72,76,73]', output: '[1,1,4,2,1,1,0,0]' },
      { input: 'temperatures = [30,40,50,60]', output: '[1,1,1,0]' },
      { input: 'temperatures = [30,60,90]', output: '[1,1,0]' },
    ],
    constraints: [
      '1 <= temperatures.length <= 10^5',
      '30 <= temperatures[i] <= 100',
    ],
    edgeCases: [
      'What if the array is strictly decreasing? Every answer[i] = 0 — no warmer day ever comes.',
      'What if there is only one temperature? The result is [0] — there are no future days.',
      'What if all temperatures are equal? No day is strictly warmer, so all answers are 0.',
    ],
    starterCode: {
      python: 'def dailyTemperatures(temperatures: list[int]) -> list[int]:\n    # Write your solution here\n    pass',
      javascript: 'function dailyTemperatures(temperatures) {\n    // Write your solution here\n}',
      java: 'class Solution {\n    public int[] dailyTemperatures(int[] temperatures) {\n        // Write your solution here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    vector<int> dailyTemperatures(vector<int>& temperatures) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { input: '[73,74,75,71,69,72,76,73]', expected: '[1,1,4,2,1,1,0,0]' },
      { input: '[30,40,50,60]', expected: '[1,1,1,0]' },
      { input: '[60,60,60]', expected: '[0,0,0]' },
    ],
  },

  {
    id: 'largest_rectangle_histogram',
    title: 'Largest Rectangle in Histogram',
    difficulty: 'Hard',
    difficultyColor: '#f87171',
    difficultyBg: '#2a0a0a',
    pattern: 'Stack',
    description: `Given an array of integers heights representing the histogram's bar heights where the width of each bar is 1, return the area of the largest rectangle in the histogram.`,
    examples: [
      { input: 'heights = [2,1,5,6,2,3]', output: '10' },
      { input: 'heights = [2,4]', output: '4' },
    ],
    constraints: [
      '1 <= heights.length <= 10^5',
      '0 <= heights[i] <= 10^4',
    ],
    edgeCases: [
      'What if all bars have height 0? The largest rectangle has area 0.',
      'What if there is only one bar? The answer is heights[0] * 1.',
      'What if all heights are the same? The rectangle spans all bars: height * total_width.',
    ],
    starterCode: {
      python: 'def largestRectangleArea(heights: list[int]) -> int:\n    # Write your solution here\n    pass',
      javascript: 'function largestRectangleArea(heights) {\n    // Write your solution here\n}',
      java: 'class Solution {\n    public int largestRectangleArea(int[] heights) {\n        // Write your solution here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    int largestRectangleArea(vector<int>& heights) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { input: '[2,1,5,6,2,3]', expected: '10' },
      { input: '[2,4]', expected: '4' },
      { input: '[1]', expected: '1' },
    ],
  },

  // ── Heap / Priority Queue ──────────────────────────────────────────────────

  {
    id: 'kth_largest_element',
    title: 'Kth Largest Element in an Array',
    difficulty: 'Medium',
    difficultyColor: '#fbbf24',
    difficultyBg: '#2a1f00',
    pattern: 'Heap',
    description: `Given an integer array nums and an integer k, return the kth largest element in the array. Note that it is the kth largest in sorted order, not the kth distinct element. Can you solve it without fully sorting?`,
    examples: [
      { input: 'nums = [3,2,1,5,6,4], k = 2', output: '5' },
      { input: 'nums = [3,2,3,1,2,4,5,5,6], k = 4', output: '4' },
    ],
    constraints: [
      '1 <= k <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4',
    ],
    edgeCases: [
      'What if k = 1? You want the maximum element.',
      'What if k = nums.length? You want the minimum element.',
      'What if there are duplicate values? Count by position, not uniqueness — [3,3,3], k=2 → 3.',
    ],
    starterCode: {
      python: 'def findKthLargest(nums: list[int], k: int) -> int:\n    # Write your solution here\n    pass',
      javascript: 'function findKthLargest(nums, k) {\n    // Write your solution here\n}',
      java: 'class Solution {\n    public int findKthLargest(int[] nums, int k) {\n        // Write your solution here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    int findKthLargest(vector<int>& nums, int k) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { input: 'nums=[3,2,1,5,6,4], k=2', expected: '5' },
      { input: 'nums=[3,2,3,1,2,4,5,5,6], k=4', expected: '4' },
      { input: 'nums=[1], k=1', expected: '1' },
    ],
  },

  {
    id: 'top_k_frequent',
    title: 'Top K Frequent Elements',
    difficulty: 'Medium',
    difficultyColor: '#fbbf24',
    difficultyBg: '#2a1f00',
    pattern: 'Heap',
    description: `Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order. Your algorithm's time complexity must be better than O(n log n).`,
    examples: [
      { input: 'nums = [1,1,1,2,2,3], k = 2', output: '[1,2]' },
      { input: 'nums = [1], k = 1', output: '[1]' },
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4',
      'k is in the range [1, the number of unique elements in the array].',
      'The answer is guaranteed to be unique.',
    ],
    edgeCases: [
      'What if k equals the number of unique elements? Return all unique elements.',
      'What if all elements appear exactly once? Any k elements are valid answers.',
      'What if the array has only one unique element? That element is always the answer.',
    ],
    starterCode: {
      python: 'def topKFrequent(nums: list[int], k: int) -> list[int]:\n    # Write your solution here\n    pass',
      javascript: 'function topKFrequent(nums, k) {\n    // Write your solution here\n}',
      java: 'class Solution {\n    public int[] topKFrequent(int[] nums, int k) {\n        // Write your solution here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    vector<int> topKFrequent(vector<int>& nums, int k) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { input: 'nums=[1,1,1,2,2,3], k=2', expected: '[1,2]' },
      { input: 'nums=[1], k=1', expected: '[1]' },
      { input: 'nums=[1,2], k=2', expected: '[1,2]' },
    ],
  },

  {
    id: 'find_median_data_stream',
    title: 'Find Median from Data Stream',
    difficulty: 'Hard',
    difficultyColor: '#f87171',
    difficultyBg: '#2a0a0a',
    pattern: 'Heap',
    description: `The median is the middle value in an ordered list. If the list has an even size, the median is the mean of the two middle values.\n\nImplement the MedianFinder class:\n- MedianFinder() initializes the object.\n- addNum(int num) adds the integer to the data structure.\n- findMedian() returns the median of all elements so far. Answers within 10^-5 of the actual answer are accepted.`,
    examples: [
      { input: 'addNum(1), addNum(2), findMedian(), addNum(3), findMedian()', output: '1.5, 2.0' },
    ],
    constraints: [
      '-10^5 <= num <= 10^5',
      'findMedian is only called after at least one addNum.',
      'At most 5 * 10^4 calls total.',
    ],
    edgeCases: [
      'What if there is only one element? The median is that element as a float.',
      'What if two elements are equal? The median is that value.',
      'What if elements are added in decreasing order? Both heaps must rebalance to give the correct median.',
    ],
    starterCode: {
      python: 'class MedianFinder:\n    def __init__(self):\n        pass\n\n    def addNum(self, num: int) -> None:\n        pass\n\n    def findMedian(self) -> float:\n        pass',
      javascript: 'class MedianFinder {\n    constructor() {\n    }\n\n    addNum(num) {\n    }\n\n    findMedian() {\n    }\n}',
      java: 'class MedianFinder {\n    public MedianFinder() {\n    }\n\n    public void addNum(int num) {\n    }\n\n    public double findMedian() {\n        return 0.0;\n    }\n}',
      cpp: 'class MedianFinder {\npublic:\n    MedianFinder() {\n    }\n\n    void addNum(int num) {\n    }\n\n    double findMedian() {\n        return 0.0;\n    }\n};',
    },
    testCases: [
      { input: 'addNum(1), addNum(2), findMedian()', expected: '1.5' },
      { input: 'addNum(1), addNum(2), findMedian(), addNum(3), findMedian()', expected: '1.5, 2.0' },
      { input: 'addNum(6), findMedian()', expected: '6.0' },
    ],
  },

  // ── Backtracking ───────────────────────────────────────────────────────────

  {
    id: 'subsets',
    title: 'Subsets',
    difficulty: 'Medium',
    difficultyColor: '#fbbf24',
    difficultyBg: '#2a1f00',
    pattern: 'Backtracking',
    description: `Given an integer array nums of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets. Return the solution in any order.`,
    examples: [
      { input: 'nums = [1,2,3]', output: '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]' },
      { input: 'nums = [0]', output: '[[],[0]]' },
    ],
    constraints: [
      '1 <= nums.length <= 10',
      '-10 <= nums[i] <= 10',
      'All elements of nums are unique.',
    ],
    edgeCases: [
      'The empty subset [] must always be included — it is a valid subset of every set.',
      'What if the array has one element? Return [[], [element]] only.',
      'What if the array has 10 elements? There will be 2^10 = 1024 subsets — ensure nothing is missed or duplicated.',
    ],
    starterCode: {
      python: 'def subsets(nums: list[int]) -> list[list[int]]:\n    # Write your solution here\n    pass',
      javascript: 'function subsets(nums) {\n    // Write your solution here\n}',
      java: 'class Solution {\n    public List<List<Integer>> subsets(int[] nums) {\n        // Write your solution here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    vector<vector<int>> subsets(vector<int>& nums) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { input: '[1,2,3]', expected: '8 subsets including [] and [1,2,3]' },
      { input: '[0]', expected: '[[], [0]]' },
      { input: '[1,2]', expected: '[[], [1], [2], [1,2]]' },
    ],
  },

  {
    id: 'combination_sum',
    title: 'Combination Sum',
    difficulty: 'Medium',
    difficultyColor: '#fbbf24',
    difficultyBg: '#2a1f00',
    pattern: 'Backtracking',
    description: `Given an array of distinct integers candidates and a target integer target, return all unique combinations of candidates where the chosen numbers sum to target. The same number may be chosen from candidates an unlimited number of times. Two combinations are unique if the frequency of at least one chosen number differs.`,
    examples: [
      { input: 'candidates = [2,3,6,7], target = 7', output: '[[2,2,3],[7]]' },
      { input: 'candidates = [2,3,5], target = 8', output: '[[2,2,2,2],[2,3,3],[3,5]]' },
      { input: 'candidates = [2], target = 1', output: '[]' },
    ],
    constraints: [
      '1 <= candidates.length <= 30',
      '2 <= candidates[i] <= 40',
      'All elements of candidates are distinct.',
      '1 <= target <= 500',
    ],
    edgeCases: [
      'What if no candidates sum to target? Return an empty list [].',
      'What if one candidate equals the target exactly? That single-element combination is valid.',
      'Can a candidate be used more than once? Yes — the same number may appear multiple times in a combination.',
    ],
    starterCode: {
      python: 'def combinationSum(candidates: list[int], target: int) -> list[list[int]]:\n    # Write your solution here\n    pass',
      javascript: 'function combinationSum(candidates, target) {\n    // Write your solution here\n}',
      java: 'class Solution {\n    public List<List<Integer>> combinationSum(int[] candidates, int target) {\n        // Write your solution here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { input: 'candidates=[2,3,6,7], target=7', expected: '[[2,2,3],[7]]' },
      { input: 'candidates=[2,3,5], target=8', expected: '[[2,2,2,2],[2,3,3],[3,5]]' },
      { input: 'candidates=[2], target=1', expected: '[]' },
    ],
  },

  {
    id: 'letter_combinations',
    title: 'Letter Combinations of a Phone Number',
    difficulty: 'Medium',
    difficultyColor: '#fbbf24',
    difficultyBg: '#2a1f00',
    pattern: 'Backtracking',
    description: `Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent. Return the answer in any order.\n\nPhone digit mapping: 2→abc, 3→def, 4→ghi, 5→jkl, 6→mno, 7→pqrs, 8→tuv, 9→wxyz.`,
    examples: [
      { input: 'digits = "23"', output: '["ad","ae","af","bd","be","bf","cd","ce","cf"]' },
      { input: 'digits = ""', output: '[]' },
      { input: 'digits = "2"', output: '["a","b","c"]' },
    ],
    constraints: [
      '0 <= digits.length <= 4',
      "digits[i] is a digit in ['2', '9'].",
    ],
    edgeCases: [
      'What if digits is an empty string? Return an empty list — not a list containing an empty string.',
      'What if there is only one digit? Return only the 3 or 4 letters mapped to that digit.',
      "What if a digit maps to 4 letters (7 or 9)? All 4 letters must appear in the combinations.",
    ],
    starterCode: {
      python: 'def letterCombinations(digits: str) -> list[str]:\n    # Write your solution here\n    pass',
      javascript: 'function letterCombinations(digits) {\n    // Write your solution here\n}',
      java: 'class Solution {\n    public List<String> letterCombinations(String digits) {\n        // Write your solution here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    vector<string> letterCombinations(string digits) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { input: '"23"', expected: '["ad","ae","af","bd","be","bf","cd","ce","cf"]' },
      { input: '""', expected: '[]' },
      { input: '"2"', expected: '["a","b","c"]' },
    ],
  },

  // ── Greedy ─────────────────────────────────────────────────────────────────

  {
    id: 'jump_game',
    title: 'Jump Game',
    difficulty: 'Medium',
    difficultyColor: '#fbbf24',
    difficultyBg: '#2a1f00',
    pattern: 'Greedy',
    description: `You are given an integer array nums. You are initially positioned at index 0, and each element represents your maximum jump length at that position.\n\nReturn true if you can reach the last index, or false otherwise.`,
    examples: [
      { input: 'nums = [2,3,1,1,4]', output: 'true' },
      { input: 'nums = [3,2,1,0,4]', output: 'false' },
    ],
    constraints: [
      '1 <= nums.length <= 10^4',
      '0 <= nums[i] <= 10^5',
    ],
    edgeCases: [
      'What if the array has only one element? You are already at the last index — return true.',
      'What if the first element is 0 and the array has more than one element? You cannot move — return false.',
      'What if a 0 appears in the middle? Only return false if it is unreachable or impossible to jump over it.',
    ],
    starterCode: {
      python: 'def canJump(nums: list[int]) -> bool:\n    # Write your solution here\n    pass',
      javascript: 'function canJump(nums) {\n    // Write your solution here\n}',
      java: 'class Solution {\n    public boolean canJump(int[] nums) {\n        // Write your solution here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    bool canJump(vector<int>& nums) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { input: '[2,3,1,1,4]', expected: 'true' },
      { input: '[3,2,1,0,4]', expected: 'false' },
      { input: '[0]', expected: 'true' },
    ],
  },

  {
    id: 'meeting_rooms',
    title: 'Meeting Rooms',
    difficulty: 'Easy',
    difficultyColor: '#4ade80',
    difficultyBg: '#1a3a1a',
    pattern: 'Greedy',
    description: `Given an array of meeting time intervals where intervals[i] = [start_i, end_i], determine if a person could attend all meetings without any two meetings overlapping.`,
    examples: [
      { input: 'intervals = [[0,30],[5,10],[15,20]]', output: 'false' },
      { input: 'intervals = [[7,10],[2,4]]', output: 'true' },
    ],
    constraints: [
      '0 <= intervals.length <= 10^4',
      'intervals[i].length == 2',
      '0 <= start_i < end_i <= 10^6',
    ],
    edgeCases: [
      'What if there are no meetings? An empty list has no conflicts — return true.',
      'What if two meetings share exactly one endpoint (end == next start)? That is NOT an overlap — [1,5] and [5,8] are fine.',
      'What if two meetings are identical? [5,10] and [5,10] overlap at every point — return false.',
    ],
    starterCode: {
      python: 'def canAttendMeetings(intervals: list[list[int]]) -> bool:\n    # Write your solution here\n    pass',
      javascript: 'function canAttendMeetings(intervals) {\n    // Write your solution here\n}',
      java: 'class Solution {\n    public boolean canAttendMeetings(int[][] intervals) {\n        // Write your solution here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    bool canAttendMeetings(vector<vector<int>>& intervals) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { input: '[[0,30],[5,10],[15,20]]', expected: 'false' },
      { input: '[[7,10],[2,4]]', expected: 'true' },
      { input: '[]', expected: 'true' },
    ],
  },

  {
    id: 'gas_station',
    title: 'Gas Station',
    difficulty: 'Medium',
    difficultyColor: '#fbbf24',
    difficultyBg: '#2a1f00',
    pattern: 'Greedy',
    description: `There are n gas stations along a circular route. The amount of gas at station i is gas[i], and it costs cost[i] to travel from station i to the next station.\n\nStarting with an empty tank, return the starting station's index if you can travel around the circuit once clockwise, or -1 if it is impossible. A solution is guaranteed to be unique if it exists.`,
    examples: [
      { input: 'gas = [1,2,3,4,5], cost = [3,4,5,1,2]', output: '3' },
      { input: 'gas = [2,3,4], cost = [3,4,3]', output: '-1' },
    ],
    constraints: [
      'n == gas.length == cost.length',
      '1 <= n <= 10^5',
      '0 <= gas[i], cost[i] <= 10^4',
    ],
    edgeCases: [
      'What if total gas < total cost? The circuit is impossible — return -1.',
      'What if there is only one station and gas[0] >= cost[0]? Starting at index 0 works.',
      'What if the answer is the last station? The greedy scan must not stop before considering the final index.',
    ],
    starterCode: {
      python: 'def canCompleteCircuit(gas: list[int], cost: list[int]) -> int:\n    # Write your solution here\n    pass',
      javascript: 'function canCompleteCircuit(gas, cost) {\n    // Write your solution here\n}',
      java: 'class Solution {\n    public int canCompleteCircuit(int[] gas, int[] cost) {\n        // Write your solution here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { input: 'gas=[1,2,3,4,5], cost=[3,4,5,1,2]', expected: '3' },
      { input: 'gas=[2,3,4], cost=[3,4,3]', expected: '-1' },
      { input: 'gas=[5], cost=[4]', expected: '0' },
    ],
  },

  // ── Bit Manipulation ───────────────────────────────────────────────────────

  {
    id: 'single_number',
    title: 'Single Number',
    difficulty: 'Easy',
    difficultyColor: '#4ade80',
    difficultyBg: '#1a3a1a',
    pattern: 'Bit Manipulation',
    description: `Given a non-empty array of integers nums, every element appears twice except for one. Find that single element.\n\nYou must implement a solution with linear runtime complexity and use only constant extra space.`,
    examples: [
      { input: 'nums = [2,2,1]', output: '1' },
      { input: 'nums = [4,1,2,1,2]', output: '4' },
      { input: 'nums = [1]', output: '1' },
    ],
    constraints: [
      '1 <= nums.length <= 3 * 10^4',
      '-3 * 10^4 <= nums[i] <= 3 * 10^4',
      'Every element appears twice except for one element which appears once.',
    ],
    edgeCases: [
      'What if the array has only one element? That element is the answer.',
      'What if the single number is 0? XOR with 0 is still 0 — handled correctly.',
      'What if the array contains negative numbers? XOR operates on bit patterns, so negatives work fine.',
    ],
    starterCode: {
      python: 'def singleNumber(nums: list[int]) -> int:\n    # Write your solution here\n    pass',
      javascript: 'function singleNumber(nums) {\n    // Write your solution here\n}',
      java: 'class Solution {\n    public int singleNumber(int[] nums) {\n        // Write your solution here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    int singleNumber(vector<int>& nums) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { input: '[2,2,1]', expected: '1' },
      { input: '[4,1,2,1,2]', expected: '4' },
      { input: '[1]', expected: '1' },
    ],
  },

  {
    id: 'counting_bits',
    title: 'Counting Bits',
    difficulty: 'Easy',
    difficultyColor: '#4ade80',
    difficultyBg: '#1a3a1a',
    pattern: 'Bit Manipulation',
    description: `Given an integer n, return an array ans of length n + 1 such that for each i (0 <= i <= n), ans[i] is the number of 1's in the binary representation of i.`,
    examples: [
      { input: 'n = 2', output: '[0,1,1]' },
      { input: 'n = 5', output: '[0,1,1,2,1,2]' },
    ],
    constraints: [
      '0 <= n <= 10^5',
    ],
    edgeCases: [
      'What if n = 0? Return [0] — the number 0 has zero set bits.',
      'What if n = 1? Return [0, 1].',
      'Can you solve this in O(n) without any built-in popcount? A DP recurrence using the lowest set bit makes it possible.',
    ],
    starterCode: {
      python: 'def countBits(n: int) -> list[int]:\n    # Write your solution here\n    pass',
      javascript: 'function countBits(n) {\n    // Write your solution here\n}',
      java: 'class Solution {\n    public int[] countBits(int n) {\n        // Write your solution here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    vector<int> countBits(int n) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { input: '2', expected: '[0,1,1]' },
      { input: '5', expected: '[0,1,1,2,1,2]' },
      { input: '0', expected: '[0]' },
    ],
  },

  {
    id: 'reverse_bits',
    title: 'Reverse Bits',
    difficulty: 'Easy',
    difficultyColor: '#4ade80',
    difficultyBg: '#1a3a1a',
    pattern: 'Bit Manipulation',
    description: `Reverse the bits of a given 32-bit unsigned integer and return the result.\n\nNote: In languages like Java that lack an unsigned integer type, the input and output are given as signed integers — the underlying bit manipulation is identical.`,
    examples: [
      { input: 'n = 00000010100101000001111010011100 (binary)', output: '964176192 (00111001011110000010100101000000)' },
      { input: 'n = 11111111111111111111111111111101 (binary)', output: '3221225471 (10111111111111111111111111111111)' },
    ],
    constraints: [
      'The input must be a binary string of length 32.',
    ],
    edgeCases: [
      'What if all bits are 0? Reversing all zeros gives 0.',
      'What if all bits are 1? The value is its own reverse.',
      'What if only the MSB is set? After reversal it becomes the LSB, yielding the value 1.',
    ],
    starterCode: {
      python: 'def reverseBits(n: int) -> int:\n    # Write your solution here\n    pass',
      javascript: 'function reverseBits(n) {\n    // Write your solution here\n}',
      java: 'public class Solution {\n    public int reverseBits(int n) {\n        // Write your solution here\n        return 0;\n    }\n}',
      cpp: 'class Solution {\npublic:\n    uint32_t reverseBits(uint32_t n) {\n        // Write your solution here\n        return 0;\n    }\n};',
    },
    testCases: [
      { input: '43261596', expected: '964176192' },
      { input: '4294967293', expected: '3221225471' },
      { input: '0', expected: '0' },
    ],
  },

  // ── Math ───────────────────────────────────────────────────────────────────

  {
    id: 'happy_number',
    title: 'Happy Number',
    difficulty: 'Easy',
    difficultyColor: '#4ade80',
    difficultyBg: '#1a3a1a',
    pattern: 'Math',
    description: `Write an algorithm to determine if a number n is happy.\n\nA happy number is defined by the following process: starting with any positive integer, replace it by the sum of the squares of its digits, and repeat until the number equals 1 (where it stays), or it loops endlessly in a cycle that does not include 1. Numbers that end at 1 are happy.\n\nReturn true if n is a happy number, and false if not.`,
    examples: [
      { input: 'n = 19', output: 'true  (1²+9²=82 → 8²+2²=68 → 6²+8²=100 → 1²=1)' },
      { input: 'n = 2', output: 'false' },
    ],
    constraints: [
      '1 <= n <= 2^31 - 1',
    ],
    edgeCases: [
      'What if n = 1? It is immediately happy — no iteration needed.',
      'What if the process cycles without reaching 1? Use a set (or fast/slow pointers) to detect the cycle and return false.',
      'What if n is very large? The sum of squared digits shrinks rapidly — it falls below 1000 within a few steps.',
    ],
    starterCode: {
      python: 'def isHappy(n: int) -> bool:\n    # Write your solution here\n    pass',
      javascript: 'function isHappy(n) {\n    // Write your solution here\n}',
      java: 'class Solution {\n    public boolean isHappy(int n) {\n        // Write your solution here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    bool isHappy(int n) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { input: '19', expected: 'true' },
      { input: '2', expected: 'false' },
      { input: '1', expected: 'true' },
    ],
  },

  {
    id: 'plus_one',
    title: 'Plus One',
    difficulty: 'Easy',
    difficultyColor: '#4ade80',
    difficultyBg: '#1a3a1a',
    pattern: 'Math',
    description: `You are given a large integer represented as an array of digits, where digits[i] is the ith digit. The digits are ordered most-significant to least-significant. The integer has no leading zeros.\n\nIncrement the integer by one and return the resulting digit array.`,
    examples: [
      { input: 'digits = [1,2,3]', output: '[1,2,4]' },
      { input: 'digits = [4,3,2,1]', output: '[4,3,2,2]' },
      { input: 'digits = [9]', output: '[1,0]' },
    ],
    constraints: [
      '1 <= digits.length <= 100',
      '0 <= digits[i] <= 9',
      'digits does not contain leading zeros.',
    ],
    edgeCases: [
      'What if the last digit is 9? A carry must propagate leftward.',
      'What if all digits are 9? The result needs an extra leading digit: [9,9,9] → [1,0,0,0].',
      'What if the array has a single element [0]? Adding 1 gives [1].',
    ],
    starterCode: {
      python: 'def plusOne(digits: list[int]) -> list[int]:\n    # Write your solution here\n    pass',
      javascript: 'function plusOne(digits) {\n    // Write your solution here\n}',
      java: 'class Solution {\n    public int[] plusOne(int[] digits) {\n        // Write your solution here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    vector<int> plusOne(vector<int>& digits) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { input: '[1,2,3]', expected: '[1,2,4]' },
      { input: '[9]', expected: '[1,0]' },
      { input: '[9,9,9]', expected: '[1,0,0,0]' },
    ],
  },

  {
    id: 'pow_x_n',
    title: 'Pow(x, n)',
    difficulty: 'Medium',
    difficultyColor: '#fbbf24',
    difficultyBg: '#2a1f00',
    pattern: 'Math',
    description: `Implement pow(x, n), which calculates x raised to the power n (i.e., x^n). Do not use the language's built-in power operator — implement fast (binary) exponentiation yourself.`,
    examples: [
      { input: 'x = 2.00000, n = 10', output: '1024.00000' },
      { input: 'x = 2.10000, n = 3', output: '9.26100' },
      { input: 'x = 2.00000, n = -2', output: '0.25000' },
    ],
    constraints: [
      '-100.0 < x < 100.0',
      '-2^31 <= n <= 2^31 - 1',
      'Either x is not zero or n > 0.',
      '-10^4 <= x^n <= 10^4',
    ],
    edgeCases: [
      'What if n is negative? x^(-n) = 1 / x^n — invert x and negate n.',
      'What if n = 0? x^0 = 1 for any non-zero x.',
      'What if n is INT_MIN (-2^31)? Negating it directly overflows 32-bit integers — cast to long first.',
    ],
    starterCode: {
      python: 'def myPow(x: float, n: int) -> float:\n    # Write your solution here\n    pass',
      javascript: 'function myPow(x, n) {\n    // Write your solution here\n}',
      java: 'class Solution {\n    public double myPow(double x, int n) {\n        // Write your solution here\n        return 0.0;\n    }\n}',
      cpp: 'class Solution {\npublic:\n    double myPow(double x, int n) {\n        // Write your solution here\n        return 0.0;\n    }\n};',
    },
    testCases: [
      { input: 'x=2.0, n=10', expected: '1024.0' },
      { input: 'x=2.0, n=-2', expected: '0.25' },
      { input: 'x=2.0, n=0', expected: '1.0' },
    ],
  },

  // ── Linked List ────────────────────────────────────────────────────────────

  {
    id: 'merge_k_sorted_lists',
    title: 'Merge K Sorted Lists',
    difficulty: 'Hard',
    difficultyColor: '#f87171',
    difficultyBg: '#2a0a0a',
    pattern: 'Linked List',
    description: `You are given an array of k linked-lists, each sorted in ascending order. Merge all linked-lists into one sorted linked-list and return its head.`,
    examples: [
      { input: 'lists = [[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]' },
      { input: 'lists = []', output: '[]' },
      { input: 'lists = [[]]', output: '[]' },
    ],
    constraints: [
      'k == lists.length',
      '0 <= k <= 10^4',
      '0 <= lists[i].length <= 500',
      '-10^4 <= lists[i][j] <= 10^4',
      'lists[i] is sorted in ascending order.',
      'The sum of all lists[i].length will not exceed 10^4.',
    ],
    edgeCases: [
      'What if the input array is empty? Return null — nothing to merge.',
      'What if there is only one list? Return it directly.',
      'What if some lists are empty (null head nodes)? Skip null pointers when initializing the min-heap.',
    ],
    starterCode: {
      python: '# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\n\ndef mergeKLists(lists: list) -> object:\n    # Write your solution here\n    pass',
      javascript: '// function ListNode(val, next) { this.val = val; this.next = next; }\n\nfunction mergeKLists(lists) {\n    // Write your solution here\n}',
      java: '// public class ListNode { int val; ListNode next; }\n\nclass Solution {\n    public ListNode mergeKLists(ListNode[] lists) {\n        // Write your solution here\n        return null;\n    }\n}',
      cpp: '// struct ListNode { int val; ListNode *next; };\n\nclass Solution {\npublic:\n    ListNode* mergeKLists(vector<ListNode*>& lists) {\n        // Write your solution here\n        return nullptr;\n    }\n};',
    },
    testCases: [
      { input: '[[1,4,5],[1,3,4],[2,6]]', expected: '[1,1,2,3,4,4,5,6]' },
      { input: '[]', expected: '[]' },
      { input: '[[1],[0]]', expected: '[0,1]' },
    ],
  },

  {
    id: 'reorder_list',
    title: 'Reorder List',
    difficulty: 'Medium',
    difficultyColor: '#fbbf24',
    difficultyBg: '#2a1f00',
    pattern: 'Linked List',
    description: `You are given the head of a singly linked-list: L0 → L1 → … → Ln-1 → Ln.\n\nReorder it to: L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → …\n\nYou may not modify the values in the list's nodes. Only nodes themselves may be changed.`,
    examples: [
      { input: 'head = [1,2,3,4]', output: '[1,4,2,3]' },
      { input: 'head = [1,2,3,4,5]', output: '[1,5,2,4,3]' },
    ],
    constraints: [
      'The number of nodes is in the range [1, 5 * 10^4].',
      '1 <= Node.val <= 1000',
    ],
    edgeCases: [
      'What if the list has only one node? No reordering needed — return as-is.',
      'What if the list has two nodes? The order does not change: L0 → L1.',
      'What if the list has an odd number of nodes? The middle node stays at the center of the reordered list.',
    ],
    starterCode: {
      python: '# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\n\ndef reorderList(head) -> None:\n    # Modify the list in-place. Do not return anything.\n    pass',
      javascript: '// function ListNode(val, next) { this.val = val; this.next = next; }\n\nfunction reorderList(head) {\n    // Modify in-place.\n}',
      java: '// public class ListNode { int val; ListNode next; }\n\nclass Solution {\n    public void reorderList(ListNode head) {\n        // Write your solution here\n    }\n}',
      cpp: '// struct ListNode { int val; ListNode *next; };\n\nclass Solution {\npublic:\n    void reorderList(ListNode* head) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { input: '[1,2,3,4]', expected: '[1,4,2,3]' },
      { input: '[1,2,3,4,5]', expected: '[1,5,2,4,3]' },
      { input: '[1]', expected: '[1]' },
    ],
  },
];
