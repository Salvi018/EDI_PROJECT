const { getDB } = require('../db/mongodb');

const createUser = async (username, email, passwordHash) => {
  const db = getDB();
  const user = {
    username,
    email,
    password_hash: passwordHash,
    level: 1,
    xp: 0,
    streak_days: 0,
    college: '',
    created_at: new Date()
  };
  
  const result = await db.collection('users').insertOne(user);
  return { id: result.insertedId, ...user };
};

const findUserByEmail = async (email) => {
  const db = getDB();
  return await db.collection('users').findOne({ email });
};

const findUserById = async (id) => {
  const db = getDB();
  const { ObjectId } = require('mongodb');
  return await db.collection('users').findOne({ _id: new ObjectId(id) });
};

const updateUserXP = async (userId, xpGained) => {
  const db = getDB();
  const { ObjectId } = require('mongodb');
  const user = await findUserById(userId);
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
  const { ObjectId } = require('mongodb');
  const user = await findUserById(userId);
  
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

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserXP,
  updateStreak
};
