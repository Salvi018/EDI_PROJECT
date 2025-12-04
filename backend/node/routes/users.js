const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const router = express.Router();

const USERS_FILE = path.join(__dirname, '../../../database/codecade_db/users.csv');
const PROFILES_DIR = path.join(__dirname, '../../../database/codecade_db/profiles');
const SUBMISSIONS_DIR = path.join(__dirname, '../../../database/codecade_db/submissions');

// Mock data for development
const mockUsers = {
  test: {
    id: 'test',
    name: 'Test User',
    headline: 'Aspiring Software Engineer',
    college: 'Test University',
    xp: 1250,
    level: 3,
    streak: 7,
    avatar_url: 'https://via.placeholder.com/80',
    privacy_settings: { show_email: false, show_university: true }
  },
  salvi: {
    id: 'salvi',
    name: 'Salvi Bhanse',
    headline: 'Full Stack Developer',
    college: 'VIT',
    xp: 2100,
    level: 4,
    streak: 12,
    avatar_url: 'https://via.placeholder.com/80',
    privacy_settings: { show_email: false, show_university: true }
  }
};

const mockStats = {
  test: {
    totalSolved: 45,
    successRate: 78,
    avgTime: 180,
    easy: 20,
    medium: 18,
    hard: 7,
    recentActivity: [
      { problem: 'Two Sum', status: 'Accepted', date: '2025-01-15' },
      { problem: 'Valid Parentheses', status: 'Accepted', date: '2025-01-14' },
      { problem: 'Binary Search', status: 'Wrong Answer', date: '2025-01-14' }
    ]
  }
};

const mockSubmissions = {
  test: [
    {
      id: 1,
      problemTitle: 'Two Sum',
      verdict: 'accepted',
      language: 'python',
      runtime: 45,
      memory: 1024,
      createdAt: '2025-01-15T10:30:00Z'
    },
    {
      id: 2,
      problemTitle: 'Valid Parentheses',
      verdict: 'accepted',
      language: 'cpp',
      runtime: 32,
      memory: 512,
      createdAt: '2025-01-14T15:20:00Z'
    },
    {
      id: 3,
      problemTitle: 'Binary Search',
      verdict: 'wrong_answer',
      language: 'java',
      runtime: 0,
      memory: 0,
      createdAt: '2025-01-14T12:10:00Z'
    }
  ]
};

// GET /api/users/:id/profile
router.get('/:id/profile', (req, res) => {
  try {
    const userId = req.params.id;
    
    const profile = {
      id: userId,
      name: userId,
      headline: 'New User',
      college: null,
      xp: 0,
      level: 1,
      streak: 0,
      avatar_url: 'https://via.placeholder.com/80'
    };

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load profile' });
  }
});

// GET /api/users/:id/stats
router.get('/:id/stats', (req, res) => {
  try {
    const userId = req.params.id;
    const stats = {
      totalSolved: 0,
      successRate: 0,
      avgTime: 0,
      easy: 0,
      medium: 0,
      hard: 0,
      recentActivity: []
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load stats' });
  }
});

// GET /api/users/:id/submissions
router.get('/:id/submissions', (req, res) => {
  try {
    const userId = req.params.id;
    const { limit = 10, offset = 0 } = req.query;
    
    const userSubmissions = [];
    const paginatedSubmissions = userSubmissions.slice(
      parseInt(offset),
      parseInt(offset) + parseInt(limit)
    );

    res.json({
      submissions: paginatedSubmissions,
      total: userSubmissions.length,
      hasMore: parseInt(offset) + parseInt(limit) < userSubmissions.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load submissions' });
  }
});

// PATCH /api/users/:id
router.patch('/:id', (req, res) => {
  try {
    const userId = req.params.id;
    const { name, headline, college } = req.body;
    
    // In a real app, verify user ownership/auth here
    if (!mockUsers[userId]) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user data
    if (name) mockUsers[userId].name = name;
    if (headline) mockUsers[userId].headline = headline;
    if (college) mockUsers[userId].college = college;

    res.json({ success: true, user: mockUsers[userId] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// POST /api/users/:id/follow
router.post('/:id/follow', (req, res) => {
  try {
    const userId = req.params.id;
    const followerId = req.body.followerId || 'current_user';
    
    // Mock follow/unfollow logic
    const isFollowing = Math.random() > 0.5; // Random for demo
    
    res.json({
      success: true,
      following: !isFollowing,
      message: !isFollowing ? 'Now following user' : 'Unfollowed user'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to follow/unfollow user' });
  }
});

// GET /api/users/:id/badges
router.get('/:id/badges', (req, res) => {
  try {
    const userId = req.params.id;
    
    const badges = [
      { id: 1, name: 'First Solve', description: 'Solved your first problem', icon: '🥇', awarded_at: '2025-01-10' },
      { id: 2, name: 'Week Streak', description: '7 day solving streak', icon: '🔥', awarded_at: '2025-01-12' },
      { id: 3, name: 'Speed Demon', description: 'Solved a problem in under 30 seconds', icon: '⚡', awarded_at: '2025-01-14' }
    ];

    res.json({ badges });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load badges' });
  }
});

// POST /api/users/:id/avatar/upload-url
router.post('/:id/avatar/upload-url', (req, res) => {
  try {
    const userId = req.params.id;
    
    // Mock signed URL generation
    const uploadUrl = `https://mock-s3-bucket.s3.amazonaws.com/avatars/${userId}/${Date.now()}.jpg`;
    
    res.json({
      uploadUrl,
      fields: {
        key: `avatars/${userId}/${Date.now()}.jpg`,
        'Content-Type': 'image/jpeg'
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate upload URL' });
  }
});

module.exports = router;