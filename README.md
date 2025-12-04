# CODECADE - DSA Learning Platform

A comprehensive platform for learning Data Structures & Algorithms with real-time analytics, interactive challenges, and AI-powered study planning.

## 🚀 Quick Start

```bash
# Start server
./RESTART_SERVER.sh

# Access at: http://localhost:8080
# Login: test@example.com / password123
```

## 📁 Project Structure

```
CODECADE/
├── backend/
│   ├── node/              # Node.js/Express backend
│   │   ├── controllers/   # Business logic
│   │   ├── models/        # Data models
│   │   ├── routes/        # API endpoints
│   │   ├── middleware/    # Auth & validation
│   │   ├── utils/         # Helper functions
│   │   ├── server.js      # Main server file
│   │   └── package.json   # Dependencies
│   └── cpp/               # C++ backend for StudyBot
│       ├── src/           # Source files
│       ├── include/       # Header files
│       └── build/         # Compiled binaries
│
├── frontend/
│   ├── pages/             # HTML pages
│   ├── components/        # Reusable components
│   ├── assets/            # Images, CSS, audio
│   ├── js/                # JavaScript files
│   └── styles/            # CSS files
│
├── database/
│   ├── schema.sql         # Database schema
│   ├── seed.sql           # Sample data
│   ├── codecade_db/       # File-based storage (CSV/JSON)
│   └── cpp_data/          # C++ backend data
│
├── tests/                 # Test files
├── docs/                  # Documentation
├── logs/                  # Server logs
└── config/                # Environment configs
```

## 🚀 Quick Start

### Prerequisites
- Node.js v14+
- C++ compiler (g++)
- CMake (for C++ backend)

### Installation

1. **Install Node.js dependencies:**
```bash
cd backend/node
npm install
```

2. **Build C++ backend:**
```bash
cd backend/cpp
./setup.sh
```

3. **Start the servers:**
```bash
# Node.js server
cd backend/node
npm start

# C++ backend (separate terminal)
cd backend/cpp
./build/codecade_server
```

4. **Access the application:**
- Main site: http://localhost:8080
- Dashboard: http://localhost:8080/dashboard.html

## 📚 Features

- **Practice Mode**: Solve DSA problems with instant feedback
- **Dashboard**: Track progress with analytics and charts
- **StudyBot**: AI-powered personalized study plans
- **Head-on Mode**: Real-time competitive coding battles
- **Leaderboard**: Global rankings and ratings
- **Learn Mode**: Interactive theory modules

## 🗄️ Database

Currently using file-based storage:
- **User data**: `database/codecade_db/users.csv`
- **Submissions**: `database/cpp_data/submissions/*.json`
- **Study plans**: `database/cpp_data/study_plans/*.json`

For production, migrate to PostgreSQL using `database/schema.sql`.

## 📖 Documentation

See `docs/` folder for detailed documentation:
- `START_HERE.md` - Getting started guide
- `ARCHITECTURE.md` - System architecture
- `STUDYBOT_COMPLETE.md` - StudyBot documentation

## 🧪 Testing

```bash
cd tests
npm test
```

## 📝 License

MIT License - Built for DSA learners everywhere ❤️
