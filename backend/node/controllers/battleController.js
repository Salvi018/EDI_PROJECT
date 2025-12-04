const { saveBattleResult, getBattleHistory } = require('../models/battleModel');
const { updateUserXP } = require('../models/userModel');

// Save battle result
const saveBattle = async (req, res) => {
  try {
    const { opponentId, result, xpReward } = req.body;

    if (!opponentId || !result) {
      return res.status(400).json({ error: 'Opponent ID and result required' });
    }

    if (!['win', 'loss', 'draw'].includes(result)) {
      return res.status(400).json({ error: 'Invalid result. Must be win, loss, or draw' });
    }

    // Calculate XP
    const xpGained = result === 'win' ? (xpReward || 20) : (result === 'draw' ? 10 : 0);

    // Save battle
    const battle = await saveBattleResult(req.userId, opponentId, result, xpGained);

    // Update user XP
    if (xpGained > 0) {
      await updateUserXP(req.userId, xpGained);
    }

    res.json({
      message: 'Battle result saved',
      battle,
      xpGained
    });
  } catch (error) {
    console.error('Save battle error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get battle history
const getBattles = async (req, res) => {
  try {
    const battles = await getBattleHistory(req.userId);
    res.json({ battles, total: battles.length });
  } catch (error) {
    console.error('Get battles error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  saveBattle,
  getBattles
};
