const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'codecade-secret-key';
const USERS_FILE = path.join(__dirname, '../../../database/codecade_db/users.csv');

// Helper function to read users
function getUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf8');
      const lines = data.trim().split('\n');
      return lines.slice(1).map(line => {
        const [username, email, password] = line.split(',');
        return { username, email, password };
      });
    }
  } catch (err) {
    console.error('Error reading users file:', err);
  }
  return [];
}

// Helper function to save user
function saveUser(username, email, password) {
  try {
    const users = getUsers();
    users.push({ username, email, password });
    
    const csvContent = 'username,email,password\n' + 
      users.map(u => `${u.username},${u.email},${u.password}`).join('\n');
    
    fs.writeFileSync(USERS_FILE, csvContent);
    return true;
  } catch (err) {
    console.error('Error saving user:', err);
    return false;
  }
}

// Login endpoint
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  
  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    const token = jwt.sign({ username: user.username, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({
      success: true,
      token,
      user: { username: user.username, email: user.email }
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Register endpoint
router.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields required' });
  }
  
  const users = getUsers();
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }
  
  if (saveUser(username, email, password)) {
    const token = jwt.sign({ username, email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({
      success: true,
      message: 'User registered successfully',
      token,
      user: { username, email }
    });
  } else {
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Mock logout endpoint
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;