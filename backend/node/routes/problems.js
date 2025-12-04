const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const PROBLEMS_DIR = path.join(__dirname, '../../../database/codecade_db/problems');

// Get all problems
router.get('/', (req, res) => {
  try {
    const problemDirs = fs.readdirSync(PROBLEMS_DIR);
    const problems = [];
    
    problemDirs.forEach(dir => {
      const detailsPath = path.join(PROBLEMS_DIR, dir, 'details.json');
      if (fs.existsSync(detailsPath)) {
        const details = JSON.parse(fs.readFileSync(detailsPath, 'utf8'));
        problems.push(details);
      }
    });
    
    res.json(problems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load problems' });
  }
});

// Get specific problem
router.get('/:id', (req, res) => {
  try {
    const problemPath = path.join(PROBLEMS_DIR, req.params.id);
    const detailsPath = path.join(problemPath, 'details.json');
    
    if (!fs.existsSync(detailsPath)) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    
    const details = JSON.parse(fs.readFileSync(detailsPath, 'utf8'));
    
    // Add test cases if available
    const testCasesPath = path.join(problemPath, 'testcases.json');
    if (fs.existsSync(testCasesPath)) {
      const testCasesContent = fs.readFileSync(testCasesPath, 'utf8');
      if (testCasesContent.trim()) {
        details.testCases = JSON.parse(testCasesContent);
      }
    }
    
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load problem' });
  }
});

// Run code
router.post('/:id/run', (req, res) => {
  const { code, language } = req.body;
  
  // Mock code execution
  setTimeout(() => {
    if (!code || code.trim().length < 10) {
      return res.json({
        success: false,
        output: 'Error: Code too short or empty',
        error: 'Please write more code'
      });
    }
    
    // Simple validation based on problem
    const problemId = req.params.id;
    let result = { success: true, output: 'Code executed successfully' };
    
    if (problemId === 'two-sum') {
      if (code.includes('target') && (code.includes('map') || code.includes('dict'))) {
        result.output = 'Test case 1: [0,1] ✓\nTest case 2: [1,2] ✓';
      } else {
        result = { success: false, output: 'Wrong approach. Try using a hash map.', error: 'Logic error' };
      }
    }
    
    res.json(result);
  }, 1000);
});

// Submit code
router.post('/:id/submit', (req, res) => {
  const { code, language } = req.body;
  
  // Mock submission with hidden tests
  setTimeout(() => {
    const problemId = req.params.id;
    let passed = 0;
    let total = 3;
    
    if (problemId === 'two-sum' && code.includes('target') && (code.includes('map') || code.includes('dict'))) {
      passed = 3;
    } else if (code.trim().length > 20) {
      passed = 1;
    }
    
    const success = passed === total;
    
    res.json({
      success,
      passed,
      total,
      message: success ? 'All test cases passed!' : `${passed}/${total} test cases passed`,
      status: success ? 'Accepted' : 'Wrong Answer'
    });
  }, 2000);
});

module.exports = router;