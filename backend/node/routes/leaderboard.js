const fs = require('fs');
const path = require('path');

const ratingsFile = path.join(__dirname, '../../../database/codecade_db/ratings.json');

function getRankFromRating(rating) {
  if (rating >= 2000) return { tier: 'Diamond', level: 'I', color: '#b9f2ff' };
  if (rating >= 1800) return { tier: 'Platinum', level: 'I', color: '#e5e7eb' };
  if (rating >= 1600) return { tier: 'Gold', level: 'I', color: '#fbbf24' };
  if (rating >= 1400) return { tier: 'Silver', level: 'I', color: '#9ca3af' };
  return { tier: 'Bronze', level: 'I', color: '#cd7c2f' };
}

const router = require('express').Router();

router.get('/', (req, res) => {
  try {
    let ratings = {};
    if (fs.existsSync(ratingsFile)) {
      ratings = JSON.parse(fs.readFileSync(ratingsFile, 'utf8'));
    }
    
    if (Object.keys(ratings).length === 0) {
      return res.json([]);
    }
    
    const leaderboard = Object.entries(ratings)
      .map(([username, rating]) => ({
        username,
        rating,
        rank: getRankFromRating(rating)
      }))
      .sort((a, b) => b.rating - a.rating)
      .map((player, index) => ({
        ...player,
        position: index + 1
      }));
    
    res.json(leaderboard);
  } catch (err) {
    res.json([]);
  }
});

module.exports = router;