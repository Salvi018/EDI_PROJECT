const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const { connectDB } = require('./db/mongodb');
const jwt = require('jsonwebtoken');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const problemRoutes = require('./routes/problemRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const battleRoutes = require('./routes/battleRoutes');
const studybotRoutes = require('./routes/studybotRoutes');
const testRoutes = require('./routes/testRoutes');
const communityRoutes = require('./routes/communityRoutes');
const { setupBattleSocket } = require('./controllers/battleController');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});
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
app.use('/api/practice', problemRoutes);
app.use('/lessons', lessonRoutes);
app.use('/battle', battleRoutes);
app.use('/studybot', studybotRoutes);
app.use('/api/test', testRoutes);
app.use('/api/community', communityRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'CODECADE Backend Running' });
});

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/pages/index.html'));
});

app.get('/*.html', (req, res) => {
  const fileName = req.params[0] + '.html';
  res.sendFile(path.join(__dirname, '../../frontend/pages', fileName));
});

// Socket.IO authentication middleware (optional for battle feature)
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'codecade_secret_key');
      socket.user = decoded;
    } catch (err) {
      console.log('Socket auth failed:', err.message);
    }
  }
  next();
});

// Setup battle socket handlers
try {
  setupBattleSocket(io);
} catch (err) {
  console.log('Battle socket setup skipped:', err.message);
}

// Start server
server.listen(PORT, () => {
  console.log(`🚀 CODECADE Backend running on http://localhost:${PORT}`);
  console.log(`⚔️  Battle Arena ready for 1V1 matches`);
});
