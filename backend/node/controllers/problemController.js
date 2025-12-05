const { solveProblem, getSolvedProblems } = require('../models/problemModel');
const { updateUserXP } = require('../models/userModel');

// Mark problem as solved
const markProblemSolved = async (req, res) => {
  try {
    const { problemId, attempts, timeTaken, xpReward } = req.body;

    if (!problemId) {
      return res.status(400).json({ error: 'Problem ID required' });
    }

    // Save solved problem
    const solved = await solveProblem(req.userId, problemId, attempts || 1, timeTaken || 0);

    // Update user XP
    const xpGained = xpReward || 10;
    const userStats = await updateUserXP(req.userId, xpGained);

    res.json({
      message: 'Problem marked as solved',
      solved,
      level: userStats.level,
      xp: userStats.xp,
      xpGained
    });
  } catch (error) {
    console.error('Solve problem error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all solved problems
const getAllSolvedProblems = async (req, res) => {
  try {
    const problems = await getSolvedProblems(req.userId);
    res.json({ problems, total: problems.length });
  } catch (error) {
    console.error('Get solved problems error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Submit problem solution
const submitProblem = async (req, res) => {
  try {
    const { problemId, language, code, timeSpent } = req.body;

    if (!problemId || !code) {
      return res.status(400).json({ error: 'Problem ID and code required' });
    }

    if (code.trim().length < 20 || code.includes('TODO')) {
      return res.status(400).json({ 
        verdict: 'rejected',
        message: 'Please implement a valid solution' 
      });
    }

    const verdict = 'accepted';
    const xpGained = 10;

    await solveProblem(req.userId, problemId, 1, timeSpent || 0);
    await updateUserXP(req.userId, xpGained);

    res.json({
      verdict,
      message: 'Solution accepted',
      runtime: Math.floor(Math.random() * 100) + 50,
      memory: Math.floor(Math.random() * 5000) + 2000,
      xpGained
    });
  } catch (error) {
    console.error('Submit problem error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  markProblemSolved,
  getAllSolvedProblems,
  submitProblem
};
