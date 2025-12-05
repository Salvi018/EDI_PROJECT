const { getDB } = require('../db/mongodb');
const { ObjectId } = require('mongodb');

// In-memory storage for active battles and online players
const activeBattles = new Map();
const onlinePlayers = new Map();
const matchmakingQueue = [];

// Get user battle stats
const getUserStats = async (req, res) => {
    try {
        const db = getDB();
        if (!db) {
            return res.json({ wins: 0, losses: 0, rating: 1200, totalBattles: 0 });
        }
        
        const userId = req.userId || req.user?.id;
        
        const battles = await db.collection('battles').find({ 
            $or: [{ player1_id: new ObjectId(userId) }, { player2_id: new ObjectId(userId) }]
        }).toArray();
        
        const wins = battles.filter(b => b.winner_id?.toString() === userId).length;
        const losses = battles.length - wins;
        
        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
        const rating = user?.battle_rating || 1200;
        
        res.json({ wins, losses, rating, totalBattles: battles.length });
    } catch (error) {
        console.error('Get battle stats error:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
};

// Get online players
const getOnlinePlayers = async (req, res) => {
    try {
        const players = Array.from(onlinePlayers.values())
            .filter(p => p.id !== req.user.id)
            .map(p => ({
                id: p.id,
                username: p.username,
                level: p.level,
                rating: p.rating
            }));
        
        res.json(players);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch players' });
    }
};

// Get battle questions
const getBattleQuestions = async (req, res) => {
    try {
        const { battleId } = req.params;
        const battle = activeBattles.get(battleId);
        
        if (!battle) {
            return res.status(404).json({ error: 'Battle not found' });
        }
        
        // Generate random questions from database
        const db = getDB();
        if (db) {
            try {
                const questions = await db.collection('problems')
                    .aggregate([{ $sample: { size: 5 } }])
                    .toArray();
                
                if (questions && questions.length > 0) {
                    const formattedQuestions = questions.map(q => ({
                        id: q._id,
                        title: q.title,
                        description: q.description,
                        options: q.options || generateOptions(q),
                        correctAnswer: q.correct_answer || 0
                    }));
                    return res.json(formattedQuestions);
                }
            } catch (dbError) {
                console.error('Database error in getBattleQuestions:', dbError);
            }
        }
        
        // Fallback to mock questions
        res.json(generateMockQuestions());
    } catch (error) {
        console.error('Error in getBattleQuestions:', error);
        res.json(generateMockQuestions());
    }
};

// Finish battle
const finishBattle = async (req, res) => {
    try {
        const { battleId } = req.params;
        const { score, answers, timeSpent } = req.body;
        const userId = req.user.id;
        
        const db = getDB();
        const battle = activeBattles.get(battleId);
        
        if (!battle) {
            return res.status(404).json({ error: 'Battle not found' });
        }
        
        // Update battle results
        battle.results = battle.results || {};
        battle.results[userId] = { score, answers, timeSpent };
        
        // Check if both players finished
        const bothFinished = Object.keys(battle.results).length === 2;
        
        if (bothFinished) {
            const player1Result = battle.results[battle.player1.id];
            const player2Result = battle.results[battle.player2.id];
            
            const winner = player1Result.score > player2Result.score ? battle.player1 : battle.player2;
            
            // Save to database if connected
            if (db) {
                try {
                    await db.collection('battles').insertOne({
                        player1_id: new ObjectId(battle.player1.id),
                        player2_id: new ObjectId(battle.player2.id),
                        winner_id: new ObjectId(winner.id),
                        player1_score: player1Result.score,
                        player2_score: player2Result.score,
                        player1_time: player1Result.timeSpent,
                        player2_time: player2Result.timeSpent,
                        questions: answers,
                        created_at: new Date()
                    });
                    
                    // Update ratings
                    await updateRatings(battle.player1.id, battle.player2.id, winner.id);
                } catch (dbError) {
                    console.error('Database error in finishBattle:', dbError);
                }
            }
            
            activeBattles.delete(battleId);
            
            res.json({
                winner,
                player1: { ...battle.player1, score: player1Result.score, time: player1Result.timeSpent },
                player2: { ...battle.player2, score: player2Result.score, time: player2Result.timeSpent },
                performance: {
                    accuracy: Math.round((answers.filter(a => a.correct).length / answers.length) * 100),
                    avgTime: Math.round(timeSpent / answers.length),
                    correctAnswers: answers.filter(a => a.correct).length,
                    totalQuestions: answers.length
                }
            });
        } else {
            res.json({ status: 'waiting', message: 'Waiting for opponent to finish' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to finish battle' });
    }
};

// Get leaderboard
const getLeaderboard = async (req, res) => {
    try {
        const db = getDB();
        if (!db) {
            return res.json([]);
        }
        
        const users = await db.collection('users')
            .find({})
            .sort({ battle_rating: -1 })
            .limit(100)
            .toArray();
        
        const leaderboard = users.map((user, index) => ({
            rank: index + 1,
            username: user.username,
            rating: user.battle_rating || 1200,
            wins: user.battle_wins || 0,
            losses: user.battle_losses || 0
        }));
        
        res.json(leaderboard);
    } catch (error) {
        console.error('Error in getLeaderboard:', error);
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
};

// Helper functions
async function updateRatings(player1Id, player2Id, winnerId) {
    const db = getDB();
    if (!db) {
        return; // Skip rating update if DB not connected
    }
    
    try {
        const K = 32; // K-factor for ELO rating
        
        const player1 = await db.collection('users').findOne({ _id: new ObjectId(player1Id) });
        const player2 = await db.collection('users').findOne({ _id: new ObjectId(player2Id) });
        
        if (!player1 || !player2) {
            console.error('Players not found for rating update');
            return;
        }
        
        const rating1 = player1.battle_rating || 1200;
        const rating2 = player2.battle_rating || 1200;
        
        const expected1 = 1 / (1 + Math.pow(10, (rating2 - rating1) / 400));
        const expected2 = 1 / (1 + Math.pow(10, (rating1 - rating2) / 400));
        
        const score1 = winnerId === player1Id ? 1 : 0;
        const score2 = winnerId === player2Id ? 1 : 0;
        
        const newRating1 = Math.round(rating1 + K * (score1 - expected1));
        const newRating2 = Math.round(rating2 + K * (score2 - expected2));
        
        await db.collection('users').updateOne(
            { _id: new ObjectId(player1Id) },
            { 
                $set: { battle_rating: newRating1 },
                $inc: { battle_wins: score1, battle_losses: 1 - score1 }
            }
        );
        
        await db.collection('users').updateOne(
            { _id: new ObjectId(player2Id) },
            { 
                $set: { battle_rating: newRating2 },
                $inc: { battle_wins: score2, battle_losses: 1 - score2 }
            }
        );
    } catch (error) {
        console.error('Error updating ratings:', error);
    }
}

function generateOptions(problem) {
    return [
        "Option A - Correct approach",
        "Option B - Alternative method",
        "Option C - Incorrect approach",
        "Option D - Inefficient solution"
    ];
}

function generateMockQuestions() {
    return [
        {
            id: 1,
            title: "Two Sum",
            description: "Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.",
            options: ["Use nested loops", "Use hash map", "Sort and two pointers", "Binary search"],
            correctAnswer: 1
        },
        {
            id: 2,
            title: "Valid Parentheses",
            description: "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
            options: ["Use stack", "Use queue", "Use recursion", "Use counter"],
            correctAnswer: 0
        },
        {
            id: 3,
            title: "Binary Search",
            description: "What is the time complexity of binary search?",
            options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
            correctAnswer: 1
        },
        {
            id: 4,
            title: "Linked List Cycle",
            description: "How to detect a cycle in a linked list?",
            options: ["Use hash set", "Floyd's cycle detection", "Both A and B", "Not possible"],
            correctAnswer: 2
        },
        {
            id: 5,
            title: "Maximum Subarray",
            description: "Which algorithm solves maximum subarray problem efficiently?",
            options: ["Brute force", "Kadane's algorithm", "Divide and conquer", "Dynamic programming"],
            correctAnswer: 1
        }
    ];
}

// Socket.IO handlers (to be integrated with server.js)
function setupBattleSocket(io) {
    io.on('connection', (socket) => {
        console.log('Player connected:', socket.id);
        
        socket.on('join_lobby', async (data) => {
            const user = socket.user || data.user;
            if (!user || !user.userId) {
                console.log('Invalid user data in join_lobby');
                return;
            }
            
            onlinePlayers.set(socket.id, {
                id: user.userId,
                username: user.username || 'Player',
                level: user.level || 1,
                rating: user.battle_rating || 1200,
                socketId: socket.id
            });
            
            io.emit('players_update', Array.from(onlinePlayers.values()));
        });
        
        socket.on('find_match', async (data) => {
            const player = onlinePlayers.get(socket.id);
            matchmakingQueue.push({ ...player, ...data, socketId: socket.id });
            
            // Try to find a match
            const match = findMatch(player, data);
            if (match) {
                const battleId = generateBattleId();
                const battle = {
                    id: battleId,
                    player1: player,
                    player2: match,
                    startTime: Date.now()
                };
                
                activeBattles.set(battleId, battle);
                
                io.to(socket.id).emit('match_found', { battleId, ...battle });
                io.to(match.socketId).emit('match_found', { battleId, ...battle });
                
                // Remove from queue
                const index = matchmakingQueue.findIndex(p => p.socketId === match.socketId);
                if (index > -1) matchmakingQueue.splice(index, 1);
            }
        });
        
        socket.on('answer_submitted', (data) => {
            const battle = activeBattles.get(data.battleId);
            if (battle) {
                const opponentSocketId = battle.player1.socketId === socket.id ? 
                    battle.player2.socketId : battle.player1.socketId;
                io.to(opponentSocketId).emit('opponent_answered', { score: data.score });
            }
        });
        
        socket.on('disconnect', () => {
            onlinePlayers.delete(socket.id);
            io.emit('players_update', Array.from(onlinePlayers.values()));
            
            // Notify opponent if in battle
            for (const [battleId, battle] of activeBattles.entries()) {
                if (battle.player1.socketId === socket.id || battle.player2.socketId === socket.id) {
                    const opponentSocketId = battle.player1.socketId === socket.id ? 
                        battle.player2.socketId : battle.player1.socketId;
                    io.to(opponentSocketId).emit('opponent_disconnected');
                    activeBattles.delete(battleId);
                }
            }
        });
    });
}

function findMatch(player, criteria) {
    for (let i = 0; i < matchmakingQueue.length; i++) {
        const candidate = matchmakingQueue[i];
        if (candidate.socketId === player.socketId) continue;
        
        // Check skill level match
        if (criteria.skillLevel !== 'any' && candidate.skillLevel !== criteria.skillLevel) continue;
        
        // Check topic match
        if (criteria.topic !== 'any' && candidate.topic !== criteria.topic) continue;
        
        return candidate;
    }
    return null;
}

function generateBattleId() {
    return 'battle_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

module.exports = {
    getUserStats,
    getOnlinePlayers,
    getBattleQuestions,
    finishBattle,
    getLeaderboard,
    setupBattleSocket,
    activeBattles,
    onlinePlayers
};
