const express = require('express');
const router = express.Router();
const battleController = require('../controllers/battleController');
const authMiddleware = require('../middleware/auth');

router.get('/stats', authMiddleware, battleController.getUserStats);
router.get('/online', authMiddleware, battleController.getOnlinePlayers);
router.get('/:battleId/questions', authMiddleware, battleController.getBattleQuestions);
router.post('/:battleId/finish', authMiddleware, battleController.finishBattle);
router.get('/leaderboard', battleController.getLeaderboard);

module.exports = router;
