const fs = require('fs').promises;
const path = require('path');

const USERS_FILE = path.join(__dirname, '../../../database/codecade_db/users.csv');
const TOKENS_FILE = path.join(__dirname, '../../../database/codecade_db/tokens.csv');

// Parse CSV line
const parseCSVLine = (line) => {
  const parts = line.split(',');
  return {
    username: parts[0],
    email: parts[1],
    password: parts[2] || parts[1], // fallback to email if no password
    level: parseInt(parts[3]) || 1,
    xp: parseInt(parts[4]) || 0,
    streak_days: parseInt(parts[5]) || 0,
    college: parts[6] || '',
    created_at: parts[7] || new Date().toISOString()
  };
};

// Read all users
const readUsers = async () => {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    const lines = data.trim().split('\n').slice(1); // Skip header
    return lines.map(parseCSVLine);
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
};

// Write all users
const writeUsers = async (users) => {
  const header = 'username,email,password,level,xp,streak_days,college,created_at\n';
  const lines = users.map(u => 
    `${u.username},${u.email},${u.password},${u.level || 1},${u.xp || 0},${u.streak_days || 0},${u.college || ''},${u.created_at || new Date().toISOString()}`
  );
  await fs.writeFile(USERS_FILE, header + lines.join('\n'));
};

// Create new user
const createUser = async (username, email, passwordHash) => {
  const users = await readUsers();
  
  const newUser = {
    id: users.length + 1,
    username,
    email,
    password: passwordHash,
    password_hash: passwordHash,
    level: 1,
    xp: 0,
    streak_days: 0,
    college: '',
    created_at: new Date().toISOString()
  };
  
  users.push(newUser);
  await writeUsers(users);
  
  return newUser;
};

// Find user by email
const findUserByEmail = async (email) => {
  const users = await readUsers();
  const user = users.find(u => u.email === email);
  if (user) {
    user.password_hash = user.password; // Ensure password_hash field exists
  }
  return user;
};

// Find user by ID
const findUserById = async (id) => {
  const users = await readUsers();
  return users[id - 1]; // Assuming ID is 1-indexed
};

// Update user XP and level
const updateUserXP = async (userId, xpGained) => {
  const users = await readUsers();
  const user = users[userId - 1];
  
  if (user) {
    user.xp = (user.xp || 0) + xpGained;
    user.level = Math.floor(user.xp / 100) + 1;
    await writeUsers(users);
    return { level: user.level, xp: user.xp };
  }
  
  return null;
};

// Update streak
const updateStreak = async (userId) => {
  const users = await readUsers();
  const user = users[userId - 1];
  
  if (user) {
    const today = new Date().toDateString();
    const lastActive = user.last_active ? new Date(user.last_active).toDateString() : null;
    
    if (lastActive !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastActive === yesterday.toDateString()) {
        user.streak_days = (user.streak_days || 0) + 1;
      } else if (lastActive !== today) {
        user.streak_days = 1;
      }
      
      user.last_active = new Date().toISOString();
      await writeUsers(users);
    }
    
    return { streak_days: user.streak_days };
  }
  
  return null;
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserXP,
  updateStreak
};
