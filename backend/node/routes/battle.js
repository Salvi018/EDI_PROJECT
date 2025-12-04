const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

// In-memory storage (replace with DB in production)
let waitingPlayers = [];
let activeMatches = new Map();
let userRatings = new Map();

// Load user ratings from file
const ratingsFile = path.join(__dirname, '../codecade_db/ratings.json');
try {
  if (fs.existsSync(ratingsFile)) {
    const data = JSON.parse(fs.readFileSync(ratingsFile, 'utf8'));
    userRatings = new Map(Object.entries(data));
  }
} catch (err) {
  console.log('No ratings file found, starting fresh');
}

// Save ratings to file
function saveRatings() {
  const ratingsObj = Object.fromEntries(userRatings);
  fs.writeFileSync(ratingsFile, JSON.stringify(ratingsObj, null, 2));
}

// Get random problem
function getRandomProblem() {
  const problemsDir = path.join(__dirname, '../codecade_db/problems');
  const problems = fs.readdirSync(problemsDir);
  const randomProblem = problems[Math.floor(Math.random() * problems.length)];
  
  try {
    const detailsPath = path.join(problemsDir, randomProblem, 'details.json');
    const details = JSON.parse(fs.readFileSync(detailsPath, 'utf8'));
    return { id: randomProblem, ...details };
  } catch (err) {
    return null;
  }
}

// Calculate ELO rating change
function calculateELO(playerRating, opponentRating, result) {
  const K = 32; // K-factor
  const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
  return Math.round(K * (result - expectedScore));
}

// Get user rating
function getUserRating(username) {
  return userRatings.get(username) || 1200; // Default rating
}

// Update user rating
function updateUserRating(username, newRating) {
  userRatings.set(username, Math.max(800, newRating)); // Minimum 800 rating
  saveRatings();
}

// Get rank from rating
function getRankFromRating(rating) {
  if (rating >= 2000) return { tier: 'Diamond', level: 'I' };
  if (rating >= 1800) return { tier: 'Platinum', level: 'I' };
  if (rating >= 1600) return { tier: 'Gold', level: 'I' };
  if (rating >= 1400) return { tier: 'Silver', level: 'I' };
  return { tier: 'Bronze', level: 'I' };
}

// Find match for player
function findMatch(player, io) {
  const playerRating = getUserRating(player.username);
  
  // Look for opponent within ±150 rating
  const matchIndex = waitingPlayers.findIndex(p => 
    p.username !== player.username && 
    Math.abs(getUserRating(p.username) - playerRating) <= 150
  );
  
  if (matchIndex !== -1) {
    const opponent = waitingPlayers.splice(matchIndex, 1)[0];
    const problem = getRandomProblem();
    
    if (!problem) return false;
    
    const matchId = `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const match = {
      id: matchId,
      players: [player, opponent],
      problem,
      startTime: Date.now(),
      submissions: new Map(),
      finished: false
    };
    
    activeMatches.set(matchId, match);
    
    // Notify both players
    io.to(player.socketId).emit('matchFound', {
      matchId,
      opponent: { username: opponent.username, rating: getUserRating(opponent.username) },
      problem: { id: problem.id, title: problem.title, description: problem.description, difficulty: problem.difficulty }
    });
    
    io.to(opponent.socketId).emit('matchFound', {
      matchId,
      opponent: { username: player.username, rating: getUserRating(player.username) },
      problem: { id: problem.id, title: problem.title, description: problem.description, difficulty: problem.difficulty }
    });
    
    return true;
  }
  
  return false;
}

// API Routes
const router = require('express').Router();

// Get user profile
router.get('/profile/:username', (req, res) => {
  const { username } = req.params;
  const rating = getUserRating(username);
  const rank = getRankFromRating(rating);
  
  res.json({
    username,
    rating,
    rank: `${rank.tier} ${rank.level}`,
    tier: rank.tier,
    level: rank.level
  });
});

// Submit solution
router.post('/submit', (req, res) => {
  const { matchId, code, language } = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const username = decoded.username;
    
    const match = activeMatches.get(matchId);
    if (!match || match.finished) {
      return res.status(400).json({ error: 'Invalid or finished match' });
    }
    
    // Simple validation (in production, use proper code execution)
    const isCorrect = code.includes('return') && code.length > 20;
    const timeTaken = Date.now() - match.startTime;
    
    match.submissions.set(username, {
      code,
      language,
      correct: isCorrect,
      timeTaken,
      submittedAt: Date.now()
    });
    
    // Check if match is complete
    if (match.submissions.size === 2) {
      const [player1, player2] = match.players;
      const sub1 = match.submissions.get(player1.username);
      const sub2 = match.submissions.get(player2.username);
      
      let winner = null;
      if (sub1.correct && !sub2.correct) winner = player1.username;
      else if (!sub1.correct && sub2.correct) winner = player2.username;
      else if (sub1.correct && sub2.correct) {
        winner = sub1.timeTaken < sub2.timeTaken ? player1.username : player2.username;
      }
      
      // Update ratings
      if (winner) {
        const winnerRating = getUserRating(winner);
        const loserRating = getUserRating(winner === player1.username ? player2.username : player1.username);
        const ratingChange = calculateELO(winnerRating, loserRating, 1);
        
        updateUserRating(winner, winnerRating + ratingChange);
        updateUserRating(winner === player1.username ? player2.username : player1.username, loserRating - ratingChange);
      }
      
      match.finished = true;
      match.winner = winner;
    }
    
    res.json({ success: true, correct: isCorrect, timeTaken });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Get match status
router.get('/match/:matchId', (req, res) => {
  const match = activeMatches.get(req.params.matchId);
  if (!match) return res.status(404).json({ error: 'Match not found' });
  
  res.json({
    id: match.id,
    finished: match.finished,
    winner: match.winner,
    submissions: match.submissions.size
  });
});

module.exports = { router, findMatch, waitingPlayers, activeMatches, getUserRating, getRankFromRating };