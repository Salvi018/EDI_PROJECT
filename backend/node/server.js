const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { connectDB } = require('./db/mongodb');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const problemRoutes = require('./routes/problemRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const battleRoutes = require('./routes/battleRoutes');

const app = express();
const PORT = process.env.PORT || 8080;

// Connect to MongoDB
if (process.env.DB_TYPE === 'mongodb') {
  connectDB();
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../../frontend')));
app.use('/pages', express.static(path.join(__dirname, '../../frontend/pages')));
app.use('/js', express.static(path.join(__dirname, '../../frontend/js')));
app.use('/assets', express.static(path.join(__dirname, '../../frontend/assets')));
app.use('/styles', express.static(path.join(__dirname, '../../frontend/styles')));

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/problems', problemRoutes);
app.use('/lessons', lessonRoutes);
app.use('/battle', battleRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'CODECADE Backend Running' });
});

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/pages/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 CODECADE Backend running on http://localhost:${PORT}`);
});
