const { getDB } = require('../db/mongodb');

const createUser = async (username, email, passwordHash) => {
  const db = getDB();
  if (!db) {
    throw new Error('Database not connected');
  }
  
  const user = {
    username,
    email,
    password_hash: passwordHash,
    level: 1,
    xp: 0,
    streak_days: 0,
    college: '',
    battle_rating: 1200,
    battle_wins: 0,
    battle_losses: 0,
    created_at: new Date()
  };
  
  const result = await db.collection('users').insertOne(user);
  return { id: result.insertedId.toString(), ...user, _id: result.insertedId };
};

const findUserByEmail = async (email) => {
  const db = getDB();
  if (!db) {
    return null;
  }
  return await db.collection('users').findOne({ email });
};

const findUserById = async (id) => {
  const db = getDB();
  if (!db) {
    return null;
  }
  const { ObjectId } = require('mongodb');
  try {
    return await db.collection('users').findOne({ _id: new ObjectId(id) });
  } catch (error) {
    console.error('Invalid user ID format:', error.message);
    return null;
  }
};

const updateUserXP = async (userId, xpGained) => {
  const db = getDB();
  if (!db) {
    return { level: 1, xp: 0 };
  }
  const { ObjectId } = require('mongodb');
  const user = await findUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  const newXP = (user.xp || 0) + xpGained;
  const newLevel = Math.floor(newXP / 100) + 1;
  
  await db.collection('users').updateOne(
    { _id: new ObjectId(userId) },
    { $set: { xp: newXP, level: newLevel } }
  );
  
  return { level: newLevel, xp: newXP };
};

const updateStreak = async (userId) => {
  const db = getDB();
  if (!db) {
    return { streak_days: 0 };
  }
  const { ObjectId } = require('mongodb');
  const user = await findUserById(userId);
  if (!user) {
    return { streak_days: 0 };
  }
  
  const today = new Date().toDateString();
  const lastActive = user.last_active ? new Date(user.last_active).toDateString() : null;
  
  let streakDays = user.streak_days || 0;
  
  if (lastActive !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastActive === yesterday.toDateString()) {
      streakDays += 1;
    } else if (lastActive !== today) {
      streakDays = 1;
    }
    
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: { streak_days: streakDays, last_active: new Date() } }
    );
  }
  
  return { streak_days: streakDays };
};

const deleteUser = async (userId) => {
  const db = getDB();
  if (!db) {
    throw new Error('Database not connected');
  }
  const { ObjectId } = require('mongodb');
  await db.collection('users').deleteOne({ _id: new ObjectId(userId) });
  return { success: true };
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserXP,
  updateStreak,
  deleteUser
};
