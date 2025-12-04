const express = require('express');
const { saveBattle, getBattles } = require('../controllers/battleController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/result', authMiddleware, saveBattle);
router.get('/history', authMiddleware, getBattles);

module.exports = router;
