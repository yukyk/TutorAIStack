import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { FOUNDATION_PROMPT, MODE_PROMPTS } from '@/lib/prompts/modes';
import { incrementAI, trackSession } from '@/lib/counters';
import { sanitizeString } from '@/lib/sanitize';
import { validateOrigin } from '@/lib/csrf';

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

// In-memory rate limiter — resets on cold start; per-instance in serverless
const requestCounts: Record<string, { count: number; resetAt: number }> = {};

interface Problem {
  title: string;
  description: string;
  example: string;
  constraints: string;
  topics: string[];
}

const PROBLEMS: Record<string, Problem> = {
  two_sum: {
    title: 'Two Sum',
    description: `Given an array of integers nums and an integer target,
return indices of two numbers that add up to target.`,
    example: 'Input: nums=[2,7,11,15], target=9 → Output: [0,1]',
    constraints: 'Each input has exactly one solution.',
    topics: ['array', 'hash', 'map', 'sum', 'target', 'index', 'loop',
      'two sum', 'complement', 'brute force', 'complexity',
      'optimize', 'nested', 'pointer', 'solution', 'approach',
      'time', 'space', 'o(n)', 'dictionary', 'code', 'debug',
      'error', 'wrong', 'understand', 'explain', 'hint', 'help',
      'stuck', 'confused', 'why', 'how', 'what'],
  },
  longest_substring: {
    title: 'Longest Substring Without Repeating Characters',
    description: `Given a string s, find the length of the longest substring
without repeating characters. A substring is a contiguous sequence of
characters within a string.`,
    example: 'Input: s="abcabcbb" → Output: 3 ("abc")\nInput: s="bbbbb" → Output: 1\nInput: s="pwwkew" → Output: 3 ("wke")',
    constraints: '0 <= s.length <= 5 * 10^4. s consists of English letters, digits, symbols and spaces.',
    topics: ['string', 'substring', 'window', 'sliding', 'pointer', 'left', 'right',
      'character', 'repeat', 'duplicate', 'set', 'map', 'hash', 'length',
      'longest', 'index', 'shrink', 'expand', 'approach', 'brute',
      'optimize', 'complexity', 'o(n)', 'help', 'stuck', 'confused',
      'why', 'how', 'what', 'explain', 'understand', 'hint', 'debug'],
  },
  valid_parentheses: {
    title: 'Valid Parentheses',
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if open brackets are closed by the same type of brackets and in the correct order.`,
    example: 'Input: s="()" → Output: true\nInput: s="()[]{}" → Output: true\nInput: s="(]" → Output: false',
    constraints: '1 <= s.length <= 10^4. s consists of parentheses/bracket characters only.',
    topics: ['stack', 'bracket', 'parentheses', 'open', 'close', 'match', 'valid', 'push', 'pop',
      'character', 'string', 'order', 'balance', 'empty', 'code', 'debug', 'error',
      'hint', 'help', 'stuck', 'confused', 'why', 'how', 'what', 'explain', 'understand', 'approach'],
  },
  binary_search: {
    title: 'Binary Search',
    description: `Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. Return the index if the target is found, otherwise return -1.`,
    example: 'Input: nums=[-1,0,3,5,9,12], target=9 → Output: 4\nInput: nums=[-1,0,3,5,9,12], target=2 → Output: -1',
    constraints: '1 <= nums.length <= 10^4. All integers are unique. nums is sorted in ascending order.',
    topics: ['binary search', 'sorted', 'array', 'mid', 'left', 'right', 'pointer', 'index',
      'divide', 'half', 'target', 'logarithmic', 'search', 'code', 'debug', 'error',
      'hint', 'help', 'stuck', 'confused', 'why', 'how', 'what', 'explain', 'understand', 'approach'],
  },
  maximum_subarray: {
    title: "Maximum Subarray (Kadane's Algorithm)",
    description: `Given an integer array nums, find the subarray with the largest sum and return its sum.`,
    example: 'Input: nums=[-2,1,-3,4,-1,2,1,-5,4] → Output: 6\nInput: nums=[1] → Output: 1\nInput: nums=[5,4,-1,7,8] → Output: 23',
    constraints: '1 <= nums.length <= 10^5. -10^4 <= nums[i] <= 10^4.',
    topics: ['subarray', 'maximum', 'sum', 'dynamic', 'dp', 'kadane', 'current', 'global',
      'negative', 'running', 'extend', 'restart', 'contiguous', 'code', 'debug', 'error',
      'hint', 'help', 'stuck', 'confused', 'why', 'how', 'what', 'explain', 'understand', 'approach'],
  },
  reverse_linked_list: {
    title: 'Reverse Linked List',
    description: `Given the head of a singly linked list, reverse the list and return the reversed list.`,
    example: 'Input: head=[1,2,3,4,5] → Output: [5,4,3,2,1]\nInput: head=[1,2] → Output: [2,1]\nInput: head=[] → Output: []',
    constraints: '0 <= number of nodes <= 5000. -5000 <= Node.val <= 5000.',
    topics: ['linked list', 'reverse', 'node', 'pointer', 'prev', 'next', 'current', 'head',
      'iterative', 'recursive', 'null', 'direction', 'code', 'debug', 'error',
      'hint', 'help', 'stuck', 'confused', 'why', 'how', 'what', 'explain', 'understand', 'approach'],
  },
  number_of_islands: {
    title: 'Number of Islands',
    description: `Given an m x n 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.`,
    example: 'Input: grid with 3 separate land masses → Output: 3',
    constraints: 'm == grid.length, n == grid[i].length, 1 <= m, n <= 300. grid[i][j] is "0" or "1".',
    topics: ['grid', 'island', 'bfs', 'dfs', 'flood fill', 'visited', 'connected', 'adjacent',
      'land', 'water', 'matrix', 'traversal', 'recursion', 'queue', 'code', 'debug', 'error',
      'hint', 'help', 'stuck', 'confused', 'why', 'how', 'what', 'explain', 'understand', 'approach'],
  },
  climbing_stairs: {
    title: 'Climbing Stairs',
    description: `You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?`,
    example: 'Input: n=2 → Output: 2 (1+1, or 2)\nInput: n=3 → Output: 3 (1+1+1, 1+2, or 2+1)',
    constraints: '1 <= n <= 45.',
    topics: ['dp', 'dynamic programming', 'fibonacci', 'stairs', 'ways', 'climb',
      'memoization', 'bottom up', 'top down', 'subproblem', 'base case', 'n',
      'code', 'debug', 'error', 'hint', 'help', 'stuck', 'confused', 'why', 'how',
      'what', 'explain', 'understand', 'approach'],
  },
  merge_intervals: {
    title: 'Merge Intervals',
    description: `Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals and return an array of the non-overlapping intervals that cover all the intervals in the input.`,
    example: 'Input: [[1,3],[2,6],[8,10],[15,18]] → Output: [[1,6],[8,10],[15,18]]\nInput: [[1,4],[4,5]] → Output: [[1,5]]',
    constraints: '1 <= intervals.length <= 10^4. intervals[i].length == 2. 0 <= starti <= endi <= 10^4.',
    topics: ['interval', 'merge', 'overlap', 'sort', 'start', 'end', 'greedy', 'combine',
      'compare', 'array', 'range', 'code', 'debug', 'error', 'hint', 'help', 'stuck',
      'confused', 'why', 'how', 'what', 'explain', 'understand', 'approach'],
  },
  binary_tree_level_order: {
    title: 'Binary Tree Level Order Traversal',
    description: `Given the root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).`,
    example: 'Input: root=[3,9,20,null,null,15,7] → Output: [[3],[9,20],[15,7]]\nInput: root=[] → Output: []',
    constraints: '0 <= number of nodes <= 2000. -1000 <= Node.val <= 1000.',
    topics: ['binary tree', 'bfs', 'level order', 'queue', 'left', 'right', 'node',
      'children', 'depth', 'width', 'traversal', 'root', 'code', 'debug', 'error',
      'hint', 'help', 'stuck', 'confused', 'why', 'how', 'what', 'explain', 'understand', 'approach'],
  },
  contains_duplicate: {
    title: 'Contains Duplicate',
    description: `Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.`,
    example: 'Input: nums=[1,2,3,1] → Output: true\nInput: nums=[1,2,3,4] → Output: false',
    constraints: '1 <= nums.length <= 10^5. -10^9 <= nums[i] <= 10^9.',
    topics: ['duplicate', 'array', 'hash', 'set', 'unique', 'distinct', 'repeat', 'contains',
      'count', 'frequency', 'check', 'value', 'element', 'code', 'debug', 'error',
      'hint', 'help', 'stuck', 'confused', 'why', 'how', 'what', 'explain', 'understand', 'approach'],
  },
  maximum_depth_binary_tree: {
    title: 'Maximum Depth of Binary Tree',
    description: `Given the root of a binary tree, return its maximum depth. The maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.`,
    example: 'Input: root=[3,9,20,null,null,15,7] → Output: 3\nInput: root=[1,null,2] → Output: 2',
    constraints: '0 <= number of nodes <= 10^4. -100 <= Node.val <= 100.',
    topics: ['binary tree', 'tree', 'depth', 'height', 'recursion', 'dfs', 'bfs', 'root', 'leaf',
      'left', 'right', 'node', 'level', 'traversal', 'max', 'longest', 'path', 'code', 'debug',
      'error', 'hint', 'help', 'stuck', 'confused', 'why', 'how', 'what', 'explain', 'understand', 'approach'],
  },
  linked_list_cycle: {
    title: 'Linked List Cycle',
    description: `Given head, the head of a linked list, determine if the linked list has a cycle in it. Return true if there is a cycle, otherwise return false.`,
    example: 'Input: head=[3,2,0,-4], pos=1 → Output: true\nInput: head=[1], pos=-1 → Output: false',
    constraints: '0 <= number of nodes <= 10^4. -10^5 <= Node.val <= 10^5.',
    topics: ['linked list', 'cycle', 'loop', 'pointer', 'fast', 'slow', 'tortoise', 'hare',
      'floyd', 'node', 'next', 'head', 'detect', 'visited', 'set', 'code', 'debug', 'error',
      'hint', 'help', 'stuck', 'confused', 'why', 'how', 'what', 'explain', 'understand', 'approach'],
  },
  find_minimum_rotated: {
    title: 'Find Minimum in Rotated Sorted Array',
    description: `Suppose an array of length n sorted in ascending order is rotated between 1 and n times. Given the sorted rotated array nums of unique elements, return the minimum element of this array. You must write an algorithm that runs in O(log n) time.`,
    example: 'Input: nums=[3,4,5,1,2] → Output: 1\nInput: nums=[4,5,6,7,0,1,2] → Output: 0',
    constraints: '1 <= nums.length <= 5000. -5000 <= nums[i] <= 5000. All integers unique.',
    topics: ['rotated', 'sorted', 'binary search', 'minimum', 'min', 'pivot', 'array', 'mid',
      'left', 'right', 'pointer', 'logarithmic', 'o(log n)', 'divide', 'half', 'code', 'debug',
      'error', 'hint', 'help', 'stuck', 'confused', 'why', 'how', 'what', 'explain', 'understand', 'approach'],
  },
  product_except_self: {
    title: 'Product of Array Except Self',
    description: `Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. You must write an algorithm that runs in O(n) time and without using the division operation.`,
    example: 'Input: nums=[1,2,3,4] → Output: [24,12,8,6]\nInput: nums=[-1,1,0,-3,3] → Output: [0,0,9,0,0]',
    constraints: '2 <= nums.length <= 10^5. -30 <= nums[i] <= 30.',
    topics: ['product', 'array', 'prefix', 'suffix', 'left', 'right', 'multiply', 'except',
      'self', 'division', 'zero', 'o(n)', 'space', 'answer', 'result', 'code', 'debug', 'error',
      'hint', 'help', 'stuck', 'confused', 'why', 'how', 'what', 'explain', 'understand', 'approach'],
  },
};

function isMessageOffTopic(message: string, problem: Problem): boolean {
  const msg = message.toLowerCase().trim();

  // Short messages are almost always DSA follow-ups
  if (msg.split(/\s+/).length <= 10) return false;

  // Conversational continuers signal an ongoing DSA discussion
  const conversationWords = [
    'okay', 'ohh', 'oh ', 'ah ', 'yeah', 'yep', 'hmm', 'wait',
    'right', 'so ', 'i think', 'i need', 'i want', 'i should',
    'that means', 'what if', 'basically', 'actually',
  ];
  if (conversationWords.some(word => msg.includes(word))) return false;

  // Any programming/DSA-adjacent word → allow
  const alwaysAllow = [
    'hint', 'help', 'stuck', 'confused', 'explain', 'understand',
    'why', 'how', 'what', 'approach', 'solution', 'code', 'error',
    'debug', 'wrong', 'optimize', 'complexity', 'time', 'space',
    'move', 'shift', 'ahead', 'behind', 'value', 'variable',
    'index', 'array', 'loop', 'check', 'need', 'nums', 'target',
    'result', 'return', 'function', 'method', 'work', 'fix',
    'change', 'update', 'try', 'use', 'get', 'put', 'set',
    'add', 'remove', 'find', 'search', 'sort', 'think', 'means',
    'should', 'would', 'could',
  ];
  if (alwaysAllow.some(word => msg.includes(word))) return false;

  // Explicit off-topic / jailbreak phrases only
  const blockList = [
    'weather', 'joke', 'politics', 'news', 'movie', 'sport', 'food',
    'recipe', 'girlfriend', 'boyfriend', 'game',
    'act as', 'jailbreak', 'ignore previous', 'ignore instructions',
    'ignore your rules', 'you are now', 'new persona', 'bypass',
  ];
  if (blockList.some(word => msg.includes(word))) return true;

  // Last resort: require at least one topic keyword match
  return !problem.topics.some(topic => msg.includes(topic));
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!validateOrigin(request)) {
    return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
  }

  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength) > 51200) {
    return NextResponse.json({ error: 'Request too large' }, { status: 413 });
  }
  console.log('GROQ key present:', !!process.env.GROQ_API_KEY);
  const adminToken = request.headers.get('x-admin-token');
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  trackSession(ip);
  if (!adminToken || adminToken !== process.env.ADMIN_PASSWORD) {
    const now = Date.now();
    if (!requestCounts[ip]) {
      requestCounts[ip] = { count: 1, resetAt: now + 60000 };
    } else if (now > requestCounts[ip].resetAt) {
      requestCounts[ip] = { count: 1, resetAt: now + 60000 };
    } else if (requestCounts[ip].count >= 10) {
      return NextResponse.json({ error: 'Too many requests. Max 10 per minute.' }, { status: 429 });
    } else {
      requestCounts[ip].count++;
    }
  }

  let body: {
    message?: string;
    mode?: string;
    problemId?: string;
    history?: Array<{ role: string; content: string }>;
    userCode?: string;
  };
  try {
    const rawText = await request.text();
    if (rawText.length > 51200) {
      return NextResponse.json({ error: 'Request body too large.' }, { status: 413 });
    }
    body = JSON.parse(rawText);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { message, mode, problemId, history, userCode } = body;

  const cleanMessage = message ? sanitizeString(message, 2000) : undefined;
  const cleanCode = userCode ? sanitizeString(userCode, 10000) : undefined;

  if (!cleanMessage || !mode || !problemId) {
    return NextResponse.json({ error: 'message, mode, and problemId are required' }, { status: 400 });
  }

  if (!MODE_PROMPTS[mode]) {
    return NextResponse.json(
      { error: `Invalid mode. Choose: ${Object.keys(MODE_PROMPTS).join(', ')}` },
      { status: 400 }
    );
  }

  const problem = PROBLEMS[problemId];
  if (!problem) {
    return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
  }

  if (isMessageOffTopic(cleanMessage, problem)) {
    return NextResponse.json({
      reply: `I can only help with questions about this problem. What part of "${problem.title}" are you stuck on?`,
      mode,
      blocked: true,
    });
  }

  const systemPrompt = `
${FOUNDATION_PROMPT}

${'─'.repeat(60)}

CURRENT PROBLEM:
Title: ${problem.title}
Description: ${problem.description}
Example: ${problem.example}
Constraints: ${problem.constraints}
${cleanCode ? `\nUSER'S CURRENT CODE:\n\`\`\`\n${cleanCode}\n\`\`\`` : '\nNo code submitted yet.'}

${'─'.repeat(60)}

${MODE_PROMPTS[mode]}
  `.trim();

  const messages = [
    { role: 'system' as const, content: systemPrompt },
    ...(history ?? []).slice(-6).map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    })),
    { role: 'user' as const, content: cleanMessage },
  ];

  try {
    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 400,
      temperature: 0.7,
      messages,
    });

    incrementAI(mode);

    return NextResponse.json({
      reply: response.choices[0].message.content,
      mode,
      usage: response.usage,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
