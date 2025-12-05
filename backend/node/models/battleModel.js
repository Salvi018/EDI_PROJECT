const { getDB } = require('../db/mongodb');
const { ObjectId } = require('mongodb');

const createBattle = async (player1Id, player2Id) => {
    const db = getDB();
    if (!db) {
        throw new Error('Database not connected');
    }
    
    const battle = {
        player1_id: new ObjectId(player1Id),
        player2_id: new ObjectId(player2Id),
        status: 'active',
        created_at: new Date(),
        questions: [],
        player1_score: 0,
        player2_score: 0
    };
    
    const result = await db.collection('battles').insertOne(battle);
    return { id: result.insertedId.toString(), ...battle, _id: result.insertedId };
};

const getBattleById = async (battleId) => {
    const db = getDB();
    if (!db) {
        return null;
    }
    try {
        return await db.collection('battles').findOne({ _id: new ObjectId(battleId) });
    } catch (error) {
        console.error('Invalid battle ID format:', error.message);
        return null;
    }
};

const updateBattleScore = async (battleId, playerId, score) => {
    const db = getDB();
    if (!db) {
        return;
    }
    
    const battle = await getBattleById(battleId);
    if (!battle) {
        throw new Error('Battle not found');
    }
    
    const field = battle.player1_id.toString() === playerId ? 'player1_score' : 'player2_score';
    
    await db.collection('battles').updateOne(
        { _id: new ObjectId(battleId) },
        { $set: { [field]: score } }
    );
};

const completeBattle = async (battleId, winnerId) => {
    const db = getDB();
    if (!db) {
        return;
    }
    
    await db.collection('battles').updateOne(
        { _id: new ObjectId(battleId) },
        { 
            $set: { 
                status: 'completed',
                winner_id: new ObjectId(winnerId),
                completed_at: new Date()
            }
        }
    );
};

const getUserBattleHistory = async (userId, limit = 10) => {
    const db = getDB();
    if (!db) {
        return [];
    }
    
    try {
        return await db.collection('battles')
            .find({
                $or: [
                    { player1_id: new ObjectId(userId) },
                    { player2_id: new ObjectId(userId) }
                ],
                status: 'completed'
            })
            .sort({ completed_at: -1 })
            .limit(limit)
            .toArray();
    } catch (error) {
        console.error('Error fetching battle history:', error);
        return [];
    }
};

module.exports = {
    createBattle,
    getBattleById,
    updateBattleScore,
    completeBattle,
    getUserBattleHistory
};
