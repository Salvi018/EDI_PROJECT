const { completeLesson, getCompletedLessons } = require('../models/lessonModel');
const { updateUserXP } = require('../models/userModel');

// Mark lesson as completed
const markLessonCompleted = async (req, res) => {
  try {
    const { lessonId, xpReward } = req.body;

    if (!lessonId) {
      return res.status(400).json({ error: 'Lesson ID required' });
    }

    // Save completed lesson
    const completed = await completeLesson(req.userId, lessonId);

    if (!completed) {
      return res.json({ message: 'Lesson already completed' });
    }

    // Update user XP
    const xpGained = xpReward || 5;
    const userStats = await updateUserXP(req.userId, xpGained);

    res.json({
      message: 'Lesson marked as completed',
      completed,
      level: userStats.level,
      xp: userStats.xp,
      xpGained
    });
  } catch (error) {
    console.error('Complete lesson error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all completed lessons
const getAllCompletedLessons = async (req, res) => {
  try {
    const lessons = await getCompletedLessons(req.userId);
    res.json({ lessons, total: lessons.length });
  } catch (error) {
    console.error('Get completed lessons error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  markLessonCompleted,
  getAllCompletedLessons
};
