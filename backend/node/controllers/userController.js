const { findUserById, updateStreak, deleteUser } = require('../models/userModel');
const { getSolvedProblems } = require('../models/problemModel');
const { getCompletedLessons } = require('../models/lessonModel');

// Get user stats (level, xp, streak)
const getUserStats = async (req, res) => {
  try {
    const user = await findUserById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update streak
    await updateStreak(req.userId);
    const updatedUser = await findUserById(req.userId);

    res.json({
      level: updatedUser.level,
      xp: updatedUser.xp,
      streak_days: updatedUser.streak_days,
      username: updatedUser.username,
      college: updatedUser.college
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get user progress (solved problems + completed lessons)
const getUserProgress = async (req, res) => {
  try {
    const solvedProblems = await getSolvedProblems(req.userId);
    const completedLessons = await getCompletedLessons(req.userId);

    res.json({
      solvedProblems,
      completedLessons,
      totalSolved: solvedProblems.length,
      totalLessons: completedLessons.length
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteUserProfile = async (req, res) => {
  try {
    await deleteUser(req.userId);
    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getUserStats,
  getUserProgress,
  deleteUserProfile
};
