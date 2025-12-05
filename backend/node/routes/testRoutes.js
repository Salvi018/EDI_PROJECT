const express = require('express');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get 5 random questions for test
router.get('/questions', authMiddleware, async (req, res) => {
  try {
    const questions = [
      {
        id: 'two-sum',
        title: 'Two Sum',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.',
        example: 'Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: nums[0] + nums[1] = 9',
        constraints: '• 2 <= nums.length <= 10^4\n• -10^9 <= nums[i] <= 10^9\n• Only one valid answer exists',
        testCases: [
          { input: '[2,7,11,15], 9', expected: '[0,1]' },
          { input: '[3,2,4], 6', expected: '[1,2]' }
        ]
      },
      {
        id: 'valid-parentheses',
        title: 'Valid Parentheses',
        description: 'Given a string containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
        example: 'Input: s = "()"\nOutput: true\n\nInput: s = "()[]{}"\nOutput: true',
        constraints: '• 1 <= s.length <= 10^4\n• s consists of parentheses only',
        testCases: [
          { input: '"()"', expected: 'true' },
          { input: '"()[]{}"', expected: 'true' }
        ]
      },
      {
        id: 'reverse-linked-list',
        title: 'Reverse Linked List',
        description: 'Given the head of a singly linked list, reverse the list and return the reversed list.',
        example: 'Input: head = [1,2,3,4,5]\nOutput: [5,4,3,2,1]',
        constraints: '• The number of nodes is in range [0, 5000]\n• -5000 <= Node.val <= 5000',
        testCases: [
          { input: '[1,2,3,4,5]', expected: '[5,4,3,2,1]' },
          { input: '[1,2]', expected: '[2,1]' }
        ]
      },
      {
        id: 'binary-search',
        title: 'Binary Search',
        description: 'Given a sorted array of integers nums and an integer target, write a function to search target in nums. Return the index if found, otherwise return -1.',
        example: 'Input: nums = [-1,0,3,5,9,12], target = 9\nOutput: 4\nExplanation: 9 exists in nums and its index is 4',
        constraints: '• 1 <= nums.length <= 10^4\n• -10^4 < nums[i], target < 10^4\n• All integers in nums are unique',
        testCases: [
          { input: '[-1,0,3,5,9,12], 9', expected: '4' },
          { input: '[-1,0,3,5,9,12], 2', expected: '-1' }
        ]
      },
      {
        id: 'climbing-stairs',
        title: 'Climbing Stairs',
        description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. How many distinct ways can you climb to the top?',
        example: 'Input: n = 2\nOutput: 2\nExplanation: Two ways: 1+1 or 2\n\nInput: n = 3\nOutput: 3\nExplanation: Three ways: 1+1+1, 1+2, or 2+1',
        constraints: '• 1 <= n <= 45',
        testCases: [
          { input: '2', expected: '2' },
          { input: '3', expected: '3' }
        ]
      }
    ];
    
    res.json({ questions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit test results
router.post('/submit', authMiddleware, async (req, res) => {
  try {
    const { score, percentage, timeTaken } = req.body;
    const userId = req.userId || req.user?.id;
    
    const { getDB } = require('../db/mongodb');
    const db = getDB();
    
    if (db) {
      await db.collection('test_results').insertOne({
        user_id: userId,
        score,
        percentage,
        time_taken: timeTaken,
        completed_at: new Date()
      });
    }
    
    res.json({ success: true, message: 'Test results saved' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user test history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId || req.user?.id;
    const { getDB } = require('../db/mongodb');
    const { ObjectId } = require('mongodb');
    const db = getDB();
    
    if (!db) {
      return res.json({ tests: [] });
    }
    
    const tests = await db.collection('test_results')
      .find({ user_id: new ObjectId(userId) })
      .sort({ completed_at: -1 })
      .limit(10)
      .toArray();
    
    res.json({ tests });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
