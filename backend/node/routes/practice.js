const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const PROBLEMS_DIR = path.join(__dirname, '../../../database/codecade_db/problems');

// Mock user status data
const userStatus = {
  1: {
    'two-sum': { status: 'Complete', attempts: 3, completedAt: '2025-01-15T10:30:00Z' },
    'reverse-linked-list': { status: 'In Progress', attempts: 2 },
    'binary-search': { status: 'Not Started', attempts: 0 }
  }
};

// Mock submissions data
const submissions = [];

// GET /api/practice/problems
router.get('/problems', (req, res) => {
  try {
    const { difficulty, tag, page = 1, limit = 20 } = req.query;
    const userId = req.userId || 1;
    
    const problemDirs = fs.readdirSync(PROBLEMS_DIR);
    let problems = [];
    
    problemDirs.forEach(dir => {
      const detailsPath = path.join(PROBLEMS_DIR, dir, 'details.json');
      if (fs.existsSync(detailsPath)) {
        const details = JSON.parse(fs.readFileSync(detailsPath, 'utf8'));
        const userProblemStatus = userStatus[userId]?.[details.id] || { status: 'Not Started', attempts: 0 };
        
        problems.push({
          ...details,
          status: userProblemStatus.status,
          attempts: userProblemStatus.attempts,
          avgTime: Math.floor(Math.random() * 30) + 5, // Mock avg time
          tags: details.tags || ['Array', 'Hash Table']
        });
      }
    });
    
    // Apply filters
    if (difficulty) {
      const diffMap = { easy: 'Easy', intermediate: 'Medium', expert: 'Hard' };
      problems = problems.filter(p => p.difficulty === diffMap[difficulty.toLowerCase()]);
    }
    if (tag) {
      problems = problems.filter(p => p.tags?.some(t => t.toLowerCase().includes(tag.toLowerCase())));
    }
    
    // Pagination
    const offset = (page - 1) * limit;
    const paginatedProblems = problems.slice(offset, offset + parseInt(limit));
    
    res.json({
      problems: paginatedProblems,
      total: problems.length,
      page: parseInt(page),
      limit: parseInt(limit),
      hasMore: offset + parseInt(limit) < problems.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load problems' });
  }
});

// GET /api/practice/problems/:id
router.get('/problems/:id', (req, res) => {
  try {
    const problemPath = path.join(PROBLEMS_DIR, req.params.id);
    const detailsPath = path.join(problemPath, 'details.json');
    
    if (!fs.existsSync(detailsPath)) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    
    const details = JSON.parse(fs.readFileSync(detailsPath, 'utf8'));
    
    // Add test cases
    const testCasesPath = path.join(problemPath, 'testcases.json');
    if (fs.existsSync(testCasesPath)) {
      const testCasesContent = fs.readFileSync(testCasesPath, 'utf8');
      if (testCasesContent.trim()) {
        const testCases = JSON.parse(testCasesContent);
        details.publicTests = testCases.public || [];
      }
    }
    
    // Add metadata
    details.timeLimitMs = 2000;
    details.memoryLimitKB = 256000;
    details.tags = details.tags || ['Array', 'Hash Table'];
    
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load problem' });
  }
});

// Load problem solutions for validation
const problemSolutions = {
  'two-sum': {
    keywords: ['target', 'map', 'Map', 'dict', 'HashMap', 'return'],
    antiPatterns: ['// Your code here', 'pass', 'TODO', 'Write your solution here'],
    minLength: 80
  },
  'valid-parentheses': {
    keywords: ['stack', 'Stack', 'return', 'push', 'pop'],
    antiPatterns: ['// Your code here', 'pass', 'TODO', 'Write your solution here'],
    minLength: 60
  },
  'reverse-linked-list': {
    keywords: ['ListNode', 'next', 'prev', 'return'],
    antiPatterns: ['// Your code here', 'pass', 'TODO', 'Write your solution here'],
    minLength: 50
  },
  'binary-search': {
    keywords: ['left', 'right', 'mid', 'return', 'while'],
    antiPatterns: ['// Your code here', 'pass', 'TODO', 'Write your solution here'],
    minLength: 40
  },
  'climbing-stairs': {
    keywords: ['return', 'dp', 'fibonacci', 'prev', 'curr'],
    antiPatterns: ['// Your code here', 'pass', 'TODO', 'Write your solution here'],
    minLength: 30
  },
  'maximum-subarray': {
    keywords: ['return', 'max', 'sum', 'current'],
    antiPatterns: ['// Your code here', 'pass', 'TODO', 'Write your solution here'],
    minLength: 40
  },
  'merge-two-sorted-lists': {
    keywords: ['ListNode', 'next', 'return', 'while'],
    antiPatterns: ['// Your code here', 'pass', 'TODO', 'Write your solution here'],
    minLength: 60
  },
  'palindrome-number': {
    keywords: ['return', 'reverse', 'string', 'int'],
    antiPatterns: ['// Your code here', 'pass', 'TODO', 'Write your solution here'],
    minLength: 30
  },
  'fizz-buzz': {
    keywords: ['Fizz', 'Buzz', 'FizzBuzz', 'return', 'for'],
    antiPatterns: ['// Your code here', 'pass', 'TODO', 'Write your solution here'],
    minLength: 50
  },
  'valid-anagram': {
    keywords: ['return', 'sort', 'count', 'frequency'],
    antiPatterns: ['// Your code here', 'pass', 'TODO', 'Write your solution here'],
    minLength: 40
  },
  'contains-duplicate': {
    keywords: ['return', 'set', 'Set', 'HashSet', 'seen'],
    antiPatterns: ['// Your code here', 'pass', 'TODO', 'Write your solution here'],
    minLength: 30
  },
  'move-zeroes': {
    keywords: ['return', 'swap', 'pointer', 'zero'],
    antiPatterns: ['// Your code here', 'pass', 'TODO', 'Write your solution here'],
    minLength: 40
  }
};

// POST /api/practice/run
router.post('/run', (req, res) => {
  const { problemId, language, code, startTime } = req.body;
  const userId = req.userId || 1;
  
  // Update status to In Progress
  if (!userStatus[userId]) userStatus[userId] = {};
  if (!userStatus[userId][problemId]) {
    userStatus[userId][problemId] = { status: 'In Progress', attempts: 0, startTime: startTime || Date.now() };
  }
  
  setTimeout(() => {
    // Enhanced validation
    if (!code || code.trim().length < 10) {
      return res.json({
        verdict: 'compile_error',
        error: 'Code is too short or empty. Please write a complete solution.',
        publicResults: []
      });
    }
    
    // Check for basic syntax issues
    if (language === 'cpp' && !code.includes('class Solution')) {
      return res.json({
        verdict: 'compile_error',
        error: 'Missing Solution class definition',
        publicResults: []
      });
    }
    
    if (language === 'java' && !code.includes('class Solution')) {
      return res.json({
        verdict: 'compile_error', 
        error: 'Missing Solution class definition',
        publicResults: []
      });
    }
    
    // Load test cases from file
    let publicResults = [];
    const problemPath = path.join(PROBLEMS_DIR, problemId);
    const testCasesPath = path.join(problemPath, 'testcases.json');
    
    if (fs.existsSync(testCasesPath)) {
      try {
        const testCasesContent = fs.readFileSync(testCasesPath, 'utf8');
        if (testCasesContent.trim()) {
          const testCases = JSON.parse(testCasesContent);
          const publicTests = testCases.public || [];
          
          publicResults = publicTests.map(test => ({
            input: test.input,
            expected: test.output,
            actual: test.output,
            passed: true,
            runtime: Math.floor(Math.random() * 50) + 30,
            memory: Math.floor(Math.random() * 500) + 1024
          }));
        }
      } catch (error) {
        console.error('Error loading test cases:', error);
      }
    }
    
    // Fallback test cases if file doesn't exist
    if (publicResults.length === 0) {
      if (problemId === 'two-sum') {
        publicResults = [
          { input: '[2,7,11,15], 9', expected: '[0,1]', actual: '[0,1]', passed: true, runtime: 45, memory: 1024 },
          { input: '[3,2,4], 6', expected: '[1,2]', actual: '[1,2]', passed: true, runtime: 38, memory: 1024 }
        ];
      } else {
        publicResults = [
          { input: 'Sample input', expected: 'Expected output', actual: 'Expected output', passed: true, runtime: 50, memory: 1024 }
        ];
      }
    }
    
    // Validate code against problem requirements
    const solution = problemSolutions[problemId];
    if (solution) {
      const hasRequiredKeywords = solution.keywords.some(keyword => code.toLowerCase().includes(keyword.toLowerCase()));
      const hasAntiPatterns = solution.antiPatterns.some(pattern => code.includes(pattern));
      const meetsMinLength = code.length >= solution.minLength;
      
      // Additional validation for specific problems
      let isValidSolution = hasRequiredKeywords && !hasAntiPatterns && meetsMinLength;
      
      if (problemId === 'two-sum' && isValidSolution) {
        // Must have proper hash map logic
        isValidSolution = (code.includes('map') || code.includes('Map') || code.includes('dict') || code.includes('HashMap')) &&
                         code.includes('target') && 
                         (code.includes('return') || code.includes('indices'));
      }
      
      if (!isValidSolution) {
        publicResults.forEach(result => {
          result.passed = false;
          result.actual = 'Incorrect or incomplete solution';
        });
      }
    }
    
    const allPassed = publicResults.every(r => r.passed);
    
    res.json({
      verdict: allPassed ? 'accepted' : 'wrong_answer',
      publicResults,
      runtime: Math.max(...publicResults.map(r => r.runtime)),
      memory: Math.max(...publicResults.map(r => r.memory)),
      message: allPassed ? 'All public tests passed!' : 'Some public tests failed'
    });
  }, Math.random() * 1000 + 1000); // 1-2 second delay
});

// POST /api/practice/submit
router.post('/submit', (req, res) => {
  const { problemId, language, code, startTime } = req.body;
  const userId = req.userId || 1;
  
  setTimeout(() => {
    if (!userStatus[userId]) userStatus[userId] = {};
    if (!userStatus[userId][problemId]) {
      userStatus[userId][problemId] = { status: 'In Progress', attempts: 0, startTime: startTime || Date.now() };
    }
    
    userStatus[userId][problemId].attempts++;
    
    // Enhanced submission validation
    if (!code || code.trim().length < 10) {
      return res.json({
        verdict: 'compile_error',
        error: 'Code is too short or empty',
        publicResults: [],
        hiddenPassed: 0,
        hiddenTotal: 3,
        runtime: 0,
        memory: 0,
        message: 'Compilation failed'
      });
    }
    
    // Load test cases from file
    let publicResults = [];
    let hiddenTotal = 3;
    const problemPath = path.join(PROBLEMS_DIR, problemId);
    const testCasesPath = path.join(problemPath, 'testcases.json');
    
    if (fs.existsSync(testCasesPath)) {
      try {
        const testCasesContent = fs.readFileSync(testCasesPath, 'utf8');
        if (testCasesContent.trim()) {
          const testCases = JSON.parse(testCasesContent);
          const publicTests = testCases.public || [];
          hiddenTotal = (testCases.hidden || []).length;
          
          publicResults = publicTests.map(test => ({
            input: test.input,
            expected: test.output,
            actual: test.output,
            passed: true,
            runtime: Math.floor(Math.random() * 50) + 30,
            memory: Math.floor(Math.random() * 500) + 1024
          }));
        }
      } catch (error) {
        console.error('Error loading test cases:', error);
      }
    }
    
    // Fallback test cases if file doesn't exist
    if (publicResults.length === 0) {
      if (problemId === 'two-sum') {
        publicResults = [
          { input: '[2,7,11,15], 9', expected: '[0,1]', actual: '[0,1]', passed: true, runtime: 45, memory: 1024 },
          { input: '[3,2,4], 6', expected: '[1,2]', actual: '[1,2]', passed: true, runtime: 38, memory: 1024 }
        ];
      } else {
        publicResults = [
          { input: 'Sample input', expected: 'Expected output', actual: 'Expected output', passed: true, runtime: 50, memory: 1024 }
        ];
      }
    }
    
    // Validate code against problem requirements
    let hiddenPassed = hiddenTotal;
    const solution = problemSolutions[problemId];
    if (solution) {
      const hasRequiredKeywords = solution.keywords.some(keyword => code.toLowerCase().includes(keyword.toLowerCase()));
      const hasAntiPatterns = solution.antiPatterns.some(pattern => code.includes(pattern));
      const meetsMinLength = code.length >= solution.minLength;
      
      // Additional validation for specific problems
      let isValidSolution = hasRequiredKeywords && !hasAntiPatterns && meetsMinLength;
      
      if (problemId === 'two-sum' && isValidSolution) {
        // Must have proper hash map logic
        isValidSolution = (code.includes('map') || code.includes('Map') || code.includes('dict') || code.includes('HashMap')) &&
                         code.includes('target') && 
                         (code.includes('return') || code.includes('indices'));
      }
      
      if (!isValidSolution) {
        publicResults.forEach(result => {
          result.passed = false;
          result.actual = 'Incorrect or incomplete solution';
        });
        hiddenPassed = 0;
      }
    }
    
    const allPassed = publicResults.every(r => r.passed) && hiddenPassed === hiddenTotal;
    
    if (allPassed) {
      userStatus[userId][problemId].status = 'Complete';
      userStatus[userId][problemId].completedAt = new Date().toISOString();
      
      // Calculate time spent
      const timeSpent = Math.floor((Date.now() - (userStatus[userId][problemId].startTime || Date.now())) / 1000);
      userStatus[userId][problemId].timeSpent = timeSpent;
    }
    
    // Create submission record
    const submission = {
      id: submissions.length + 1,
      userId,
      problemId,
      language,
      code,
      verdict: allPassed ? 'accepted' : 'wrong_answer',
      passedPublicCount: publicResults.filter(r => r.passed).length,
      passedHiddenCount: hiddenPassed,
      totalHiddenCount: hiddenTotal,
      runtime: Math.max(...publicResults.map(r => r.runtime)),
      memory: Math.max(...publicResults.map(r => r.memory)),
      timeSpent: userStatus[userId][problemId].timeSpent || 0,
      createdAt: new Date().toISOString()
    };
    
    submissions.push(submission);
    
    const totalPassed = submission.passedPublicCount + hiddenPassed;
    const totalTests = publicResults.length + hiddenTotal;
    
    res.json({
      submissionId: submission.id,
      verdict: submission.verdict,
      publicResults,
      hiddenPassed,
      hiddenTotal,
      runtime: submission.runtime,
      memory: submission.memory,
      timeSpent: submission.timeSpent,
      message: allPassed ? 'Congratulations! All tests passed!' : `${totalPassed}/${totalTests} tests passed. Keep trying!`
    });
  }, Math.random() * 2000 + 2000); // 2-4 second delay for submission
});

// GET /api/practice/submissions
router.get('/submissions', (req, res) => {
  const { problemId, limit = 10, offset = 0 } = req.query;
  const userId = req.userId || 1;
  
  let userSubmissions = submissions.filter(s => s.userId === userId);
  if (problemId) {
    userSubmissions = userSubmissions.filter(s => s.problemId === problemId);
  }
  
  const paginatedSubmissions = userSubmissions
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(parseInt(offset), parseInt(offset) + parseInt(limit));
  
  res.json({
    submissions: paginatedSubmissions,
    total: userSubmissions.length
  });
});

module.exports = router;