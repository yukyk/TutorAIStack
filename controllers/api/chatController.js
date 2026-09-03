const Groq = require('groq-sdk');
const { FOUNDATION_PROMPT, MODE_PROMPTS } = require('../../models/prompts/modes');
const { incrementAI } = require('./adminController');

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

console.log('Groq Key loaded:', process.env.GROQ_API_KEY ? 'YES' : 'NO');

const requestCounts = {};

const rateLimit = (req, res, next) => {
    const adminToken = req.headers['x-admin-token'];
    if (adminToken && adminToken === process.env.ADMIN_PASSWORD) return next();

    const ip = req.ip;
    const now = Date.now();

    if (!requestCounts[ip]) {
        requestCounts[ip] = { count: 1, resetAt: now + 60000 };
        return next();
    }

    if (now > requestCounts[ip].resetAt) {
        requestCounts[ip] = { count: 1, resetAt: now + 60000 };
        return next();
    }

    if (requestCounts[ip].count >= 10) {
        return res.status(429).json({
            error: 'Too many requests. Max 10 per minute.'
        });
    }

    requestCounts[ip].count++;
    next();
};

const PROBLEMS = {
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
            'stuck', 'confused', 'why', 'how', 'what']
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
            'why', 'how', 'what', 'explain', 'understand', 'hint', 'debug']
    },

    valid_parentheses: {
        title: 'Valid Parentheses',
        description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if open brackets are closed by the same type of brackets and in the correct order.`,
        example: 'Input: s="()" → Output: true\nInput: s="()[]{}" → Output: true\nInput: s="(]" → Output: false',
        constraints: '1 <= s.length <= 10^4. s consists of parentheses/bracket characters only.',
        topics: ['stack', 'bracket', 'parentheses', 'open', 'close', 'match', 'valid', 'push', 'pop',
            'character', 'string', 'order', 'balance', 'empty', 'code', 'debug', 'error',
            'hint', 'help', 'stuck', 'confused', 'why', 'how', 'what', 'explain', 'understand', 'approach']
    },

    binary_search: {
        title: 'Binary Search',
        description: `Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. Return the index if the target is found, otherwise return -1.`,
        example: 'Input: nums=[-1,0,3,5,9,12], target=9 → Output: 4\nInput: nums=[-1,0,3,5,9,12], target=2 → Output: -1',
        constraints: '1 <= nums.length <= 10^4. All integers are unique. nums is sorted in ascending order.',
        topics: ['binary search', 'sorted', 'array', 'mid', 'left', 'right', 'pointer', 'index',
            'divide', 'half', 'target', 'logarithmic', 'search', 'code', 'debug', 'error',
            'hint', 'help', 'stuck', 'confused', 'why', 'how', 'what', 'explain', 'understand', 'approach']
    },

    maximum_subarray: {
        title: "Maximum Subarray (Kadane's Algorithm)",
        description: `Given an integer array nums, find the subarray with the largest sum and return its sum.`,
        example: 'Input: nums=[-2,1,-3,4,-1,2,1,-5,4] → Output: 6\nInput: nums=[1] → Output: 1\nInput: nums=[5,4,-1,7,8] → Output: 23',
        constraints: '1 <= nums.length <= 10^5. -10^4 <= nums[i] <= 10^4.',
        topics: ['subarray', 'maximum', 'sum', 'dynamic', 'dp', 'kadane', 'current', 'global',
            'negative', 'running', 'extend', 'restart', 'contiguous', 'code', 'debug', 'error',
            'hint', 'help', 'stuck', 'confused', 'why', 'how', 'what', 'explain', 'understand', 'approach']
    },

    reverse_linked_list: {
        title: 'Reverse Linked List',
        description: `Given the head of a singly linked list, reverse the list and return the reversed list.`,
        example: 'Input: head=[1,2,3,4,5] → Output: [5,4,3,2,1]\nInput: head=[1,2] → Output: [2,1]\nInput: head=[] → Output: []',
        constraints: '0 <= number of nodes <= 5000. -5000 <= Node.val <= 5000.',
        topics: ['linked list', 'reverse', 'node', 'pointer', 'prev', 'next', 'current', 'head',
            'iterative', 'recursive', 'null', 'direction', 'code', 'debug', 'error',
            'hint', 'help', 'stuck', 'confused', 'why', 'how', 'what', 'explain', 'understand', 'approach']
    },

    number_of_islands: {
        title: 'Number of Islands',
        description: `Given an m x n 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.`,
        example: 'Input: grid with 3 separate land masses → Output: 3',
        constraints: 'm == grid.length, n == grid[i].length, 1 <= m, n <= 300. grid[i][j] is "0" or "1".',
        topics: ['grid', 'island', 'bfs', 'dfs', 'flood fill', 'visited', 'connected', 'adjacent',
            'land', 'water', 'matrix', 'traversal', 'recursion', 'queue', 'code', 'debug', 'error',
            'hint', 'help', 'stuck', 'confused', 'why', 'how', 'what', 'explain', 'understand', 'approach']
    },

    climbing_stairs: {
        title: 'Climbing Stairs',
        description: `You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?`,
        example: 'Input: n=2 → Output: 2 (1+1, or 2)\nInput: n=3 → Output: 3 (1+1+1, 1+2, or 2+1)',
        constraints: '1 <= n <= 45.',
        topics: ['dp', 'dynamic programming', 'fibonacci', 'stairs', 'ways', 'climb',
            'memoization', 'bottom up', 'top down', 'subproblem', 'base case', 'n',
            'code', 'debug', 'error', 'hint', 'help', 'stuck', 'confused', 'why', 'how',
            'what', 'explain', 'understand', 'approach']
    },

    merge_intervals: {
        title: 'Merge Intervals',
        description: `Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals and return an array of the non-overlapping intervals that cover all the intervals in the input.`,
        example: 'Input: [[1,3],[2,6],[8,10],[15,18]] → Output: [[1,6],[8,10],[15,18]]\nInput: [[1,4],[4,5]] → Output: [[1,5]]',
        constraints: '1 <= intervals.length <= 10^4. intervals[i].length == 2. 0 <= starti <= endi <= 10^4.',
        topics: ['interval', 'merge', 'overlap', 'sort', 'start', 'end', 'greedy', 'combine',
            'compare', 'array', 'range', 'code', 'debug', 'error', 'hint', 'help', 'stuck',
            'confused', 'why', 'how', 'what', 'explain', 'understand', 'approach']
    },

    binary_tree_level_order: {
        title: 'Binary Tree Level Order Traversal',
        description: `Given the root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).`,
        example: "Input: root=[3,9,20,null,null,15,7] → Output: [[3],[9,20],[15,7]]\nInput: root=[] → Output: []",
        constraints: '0 <= number of nodes <= 2000. -1000 <= Node.val <= 1000.',
        topics: ['binary tree', 'bfs', 'level order', 'queue', 'left', 'right', 'node',
            'children', 'depth', 'width', 'traversal', 'root', 'code', 'debug', 'error',
            'hint', 'help', 'stuck', 'confused', 'why', 'how', 'what', 'explain', 'understand', 'approach']
    }
};

// Off-topic guard
function isMessageOffTopic(message, problem) {
    const msg = message.toLowerCase().trim();

    const alwaysAllow = [
        'hint', 'help', 'stuck', 'confused', 'explain', 'understand',
        'why', 'how', 'what', 'approach', 'solution', 'code', 'error',
        'debug', 'wrong', 'optimize', 'complexity', 'time', 'space'
    ];
    if (alwaysAllow.some(word => msg.includes(word))) return false;

    const blockList = [
        'weather', 'joke', 'who are you', 'what are you',
        'how old', 'politics', 'news', 'movie', 'sport', 'food',
        'recipe', 'girlfriend', 'boyfriend', 'love', 'game',
        'ignore', 'forget', 'pretend', 'act as', 'jailbreak',
        'ignore previous', 'ignore instructions', 'ignore your rules',
        'you are now', 'new persona', 'bypass'
    ];
    if (blockList.some(word => msg.includes(word))) return true;

    const wordCount = msg.split(' ').length;
    if (wordCount < 6) return false;

    const hasRelevantTopic = problem.topics
        ? problem.topics.some(topic => msg.includes(topic))
        : true;

    return !hasRelevantTopic;
}

const handleChat = async (req, res) => {
    const { message, mode, problemId, history, userCode } = req.body;

    if (!message || !mode || !problemId) {
        return res.status(400).json({
            error: 'message, mode, and problemId are required'
        });
    }

    if (!MODE_PROMPTS[mode]) {
        return res.status(400).json({
            error: `Invalid mode. Choose: ${Object.keys(MODE_PROMPTS).join(', ')}`
        });
    }

    const problem = PROBLEMS[problemId];
    if (!problem) {
        return res.status(404).json({ error: 'Problem not found' });
    }

    // Off-topic guard — runs before AI, saves tokens
    if (isMessageOffTopic(message, problem)) {
        return res.json({
            reply: `I can only help with questions about this problem. What part of "${problem.title}" are you stuck on?`,
            mode,
            blocked: true
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
${userCode ? `\nUSER'S CURRENT CODE:\n\`\`\`\n${userCode}\n\`\`\`` : '\nNo code submitted yet.'}

${'─'.repeat(60)}

${MODE_PROMPTS[mode]}
  `.trim();

    const messages = [
        { role: 'system', content: systemPrompt },
        ...(history || []).slice(-6).map(msg => ({ role: msg.role, content: msg.content })),
        { role: 'user', content: message }
    ];

    try {
        const response = await client.chat.completions.create({
            model: 'openai/gpt-oss-120b',
            max_tokens: 400,
            temperature: 0.7,
            messages: messages
        });

        incrementAI(mode);
        res.json({
            reply: response.choices[0].message.content,
            mode,
            usage: response.usage
        });

    } catch (error) {
        console.error('Chat API error:', error);
        res.status(500).json({
            error: 'Failed to generate response',
            details: error.message
        });
    }
};

module.exports = { rateLimit, handleChat };