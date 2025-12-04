const pool = require('../db/connection');

// Create new user
const createUser = async (username, email, passwordHash) => {
  const query = `
    INSERT INTO users (username, email, password_hash) 
    VALUES ($1, $2, $3) 
    RETURNING id, username, email, level, xp, streak_days, created_at
  `;
  const result = await pool.query(query, [username, email, passwordHash]);
  return result.rows[0];
};

// Find user by email
const findUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

// Find user by ID
const findUserById = async (id) => {
  const query = 'SELECT id, username, email, level, xp, streak_days, college, created_at FROM users WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Update user XP and level
const updateUserXP = async (userId, xpGained) => {
  const query = `
    UPDATE users 
    SET xp = xp + $1, level = FLOOR((xp + $1) / 100) + 1 
    WHERE id = $2 
    RETURNING level, xp
  `;
  const result = await pool.query(query, [xpGained, userId]);
  return result.rows[0];
};

// Update streak
const updateStreak = async (userId) => {
  const query = `
    UPDATE users 
    SET streak_days = CASE 
      WHEN last_active = CURRENT_DATE - INTERVAL '1 day' THEN streak_days + 1
      WHEN last_active < CURRENT_DATE - INTERVAL '1 day' THEN 1
      ELSE streak_days
    END,
    last_active = CURRENT_DATE
    WHERE id = $1
    RETURNING streak_days
  `;
  const result = await pool.query(query, [userId]);
  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserXP,
  updateStreak
};
