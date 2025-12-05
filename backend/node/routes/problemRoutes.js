const express = require('express');
const { markProblemSolved, getAllSolvedProblems, submitProblem } = require('../controllers/problemController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/solve', authMiddleware, markProblemSolved);
router.get('/solved', authMiddleware, getAllSolvedProblems);
router.post('/submit', authMiddleware, submitProblem);

module.exports = router;
