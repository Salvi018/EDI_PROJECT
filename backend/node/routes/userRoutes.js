const express = require('express');
const { getUserStats, getUserProgress, deleteUserProfile } = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/stats', authMiddleware, getUserStats);
router.get('/progress', authMiddleware, getUserProgress);
router.delete('/profile', authMiddleware, deleteUserProfile);

module.exports = router;
