const express = require('express');
const { getUserStats, getUserProgress } = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/stats', authMiddleware, getUserStats);
router.get('/progress', authMiddleware, getUserProgress);

module.exports = router;
