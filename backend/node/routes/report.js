const express = require('express');
const router = express.Router();

// Mock raw submissions data
const mockSubmissions = [
  { id: 1, problemId: 101, title: 'Two Sum', topic: 'Arrays', difficulty: 'Easy', status: 'Solved', timeTakenSec: 720, attempts: 2, createdAt: '2025-01-15T10:30:00Z' },
  { id: 2, problemId: 102, title: 'Binary Tree', topic: 'Trees', difficulty: 'Medium', status: 'Failed', timeTakenSec: 2700, attempts: 3, createdAt: '2025-01-14T14:20:00Z' },
  { id: 3, problemId: 103, title: 'Valid Parentheses', topic: 'Strings', difficulty: 'Easy', status: 'Solved', timeTakenSec: 480, attempts: 1, createdAt: '2025-01-13T09:15:00Z' },
  { id: 4, problemId: 104, title: 'Merge Sort', topic: 'Arrays', difficulty: 'Medium', status: 'Solved', timeTakenSec: 1800, attempts: 4, createdAt: '2025-01-12T15:45:00Z' },
  { id: 5, problemId: 105, title: 'Graph DFS', topic: 'Graphs', difficulty: 'Hard', status: 'Failed', timeTakenSec: 3600, attempts: 5, createdAt: '2025-01-11T11:20:00Z' },
  { id: 6, problemId: 106, title: 'Fibonacci DP', topic: 'DP', difficulty: 'Medium', status: 'Solved', timeTakenSec: 900, attempts: 2, createdAt: '2025-01-10T16:30:00Z' }
];

// Business logic calculations
function calculateAnalytics(submissions) {
  const accepted = submissions.filter(s => s.status === 'Solved');
  const totalAttempted = submissions.length;
  const totalSolved = accepted.length;
  
  const successRate = totalAttempted > 0 ? (totalSolved / totalAttempted * 100) : 0;
  const avgTimePerProblemSec = accepted.length > 0 
    ? Math.round(accepted.reduce((sum, s) => sum + s.timeTakenSec, 0) / accepted.length)
    : 0;
  
  const streaks = calculateStreaks(submissions);
  const topicStats = calculateTopicStats(submissions);
  const difficultyBreakdown = calculateDifficultyBreakdown(submissions);
  const commonErrors = [{ errorType: 'off_by_one', count: 12 }, { errorType: 'tle', count: 5 }];
  const activityHeatmap = calculateActivityHeatmap(submissions);
  const recommendations = generateRecommendations(topicStats, avgTimePerProblemSec);
  
  return {
    summary: {
      totalSolved,
      totalAttempted,
      successRate: Math.round(successRate * 10) / 10,
      avgTimePerProblemSec,
      currentStreakDays: streaks.current,
      bestStreakDays: streaks.best
    },
    topicStats,
    difficultyBreakdown,
    commonErrors,
    activityHeatmap,
    recommendations
  };
}

function calculateTopicStats(submissions) {
  const topics = {};
  submissions.forEach(sub => {
    if (!topics[sub.topic]) topics[sub.topic] = { solved: 0, attempted: 0, totalTime: 0 };
    topics[sub.topic].attempted++;
    if (sub.status === 'Solved') {
      topics[sub.topic].solved++;
      topics[sub.topic].totalTime += sub.timeTakenSec;
    }
  });
  
  return Object.entries(topics).map(([topic, stats]) => ({
    topic,
    solved: stats.solved,
    attempted: stats.attempted,
    accuracy: stats.attempted > 0 ? Math.round(stats.solved / stats.attempted * 100) : 0,
    avgTimeSec: stats.solved > 0 ? Math.round(stats.totalTime / stats.solved) : 0
  }));
}

function calculateDifficultyBreakdown(submissions) {
  const difficulties = { easy: { solved: 0, attempted: 0 }, medium: { solved: 0, attempted: 0 }, hard: { solved: 0, attempted: 0 } };
  submissions.forEach(sub => {
    const diff = sub.difficulty.toLowerCase();
    if (difficulties[diff]) {
      difficulties[diff].attempted++;
      if (sub.status === 'Solved') difficulties[diff].solved++;
    }
  });
  Object.keys(difficulties).forEach(diff => {
    const stats = difficulties[diff];
    stats.accuracy = stats.attempted > 0 ? Math.round(stats.solved / stats.attempted * 100) : 0;
  });
  return difficulties;
}

function calculateStreaks(submissions) {
  const solvedDates = submissions.filter(s => s.status === 'Solved').map(s => new Date(s.createdAt).toDateString()).sort();
  const uniqueDates = [...new Set(solvedDates)];
  let bestStreak = 0, tempStreak = 1;
  
  for (let i = 1; i < uniqueDates.length; i++) {
    const diffDays = (new Date(uniqueDates[i]) - new Date(uniqueDates[i - 1])) / (1000 * 60 * 60 * 24);
    if (diffDays === 1) tempStreak++; else { bestStreak = Math.max(bestStreak, tempStreak); tempStreak = 1; }
  }
  bestStreak = Math.max(bestStreak, tempStreak);
  
  const today = new Date().toDateString();
  const lastSolvedDate = uniqueDates[uniqueDates.length - 1];
  const daysSinceLastSolved = (new Date(today) - new Date(lastSolvedDate)) / (1000 * 60 * 60 * 24);
  const currentStreak = daysSinceLastSolved <= 1 ? tempStreak : 0;
  
  return { current: currentStreak, best: bestStreak };
}

function calculateActivityHeatmap(submissions) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const activity = {};
  days.forEach(day => activity[day] = 0);
  submissions.forEach(sub => {
    const dayName = days[new Date(sub.createdAt).getDay()];
    activity[dayName]++;
  });
  return Object.entries(activity).map(([day, count]) => ({ day, count }));
}

function generateRecommendations(topicStats, userMedianTime) {
  const recommendations = [];
  topicStats.forEach(topic => {
    const isWeakAccuracy = topic.accuracy < 60;
    const isSlowTime = topic.avgTimeSec > userMedianTime * 1.5;
    if (isWeakAccuracy && topic.attempted > 0) {
      recommendations.push(`Revise ${topic.topic}: reattempt ${Math.min(5, topic.attempted)} problems`);
    } else if (isSlowTime && topic.solved > 0) {
      recommendations.push(`Practice ${topic.topic} speed: focus on optimization`);
    }
  });
  if (recommendations.length === 0) recommendations.push('Great progress! Try harder difficulty problems');
  return recommendations.slice(0, 3);
}

const mockUserData = {};

// Auth middleware
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  try {
    req.userId = 1; // Mock user ID
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Input sanitization
const sanitizeQuery = (req, res, next) => {
  const { from, to, limit, offset } = req.query;
  
  if (from && !/^\d{4}-\d{2}-\d{2}$/.test(from)) {
    return res.status(400).json({ error: 'Invalid from date format' });
  }
  if (to && !/^\d{4}-\d{2}-\d{2}$/.test(to)) {
    return res.status(400).json({ error: 'Invalid to date format' });
  }
  
  req.query.limit = Math.min(parseInt(limit) || 50, 100);
  req.query.offset = Math.max(parseInt(offset) || 0, 0);
  next();
};

// GET /api/report/me
router.get('/me', requireAuth, sanitizeQuery, (req, res) => {
  const userData = mockUserData[req.userId] || { submissions: [], trend: [] };

  const analytics = calculateAnalytics(userData.submissions);
  
  res.json({
    ...analytics,
    trend: userData.trend
  });
});

// GET /api/report/me/submissions
router.get('/me/submissions', requireAuth, sanitizeQuery, (req, res) => {
  const { limit, offset, status, topic, difficulty } = req.query;
  const userData = mockUserData[req.userId] || { submissions: [] };

  let submissions = [...userData.submissions];

  if (status) submissions = submissions.filter(s => s.status.toLowerCase() === status.toLowerCase());
  if (topic) submissions = submissions.filter(s => s.topic.toLowerCase() === topic.toLowerCase());
  if (difficulty) submissions = submissions.filter(s => s.difficulty.toLowerCase() === difficulty.toLowerCase());

  const total = submissions.length;
  const paginatedSubmissions = submissions.slice(offset, offset + limit);

  res.json({
    submissions: paginatedSubmissions,
    pagination: { total, limit, offset, hasMore: offset + limit < total }
  });
});

module.exports = router;