# CODECADE - DSA Learning Platform

A comprehensive platform for learning Data Structures & Algorithms with real-time analytics, interactive challenges, and AI-powered study planning.

## 🚀 Local Development Setup

### Quick Start (Recommended)

**1. Run the automated setup:**
```bash
./SETUP_LOCAL.sh
```

**2. Start MongoDB** (choose one):
- **Local MongoDB**: `mongod` (in a separate terminal)
- **MongoDB Atlas**: Update `MONGODB_URI` in `backend/node/.env`

**3. Initialize the database:**
```bash
cd database
node init_mongodb.js
```

**4. Start the server:**
```bash
./START_LOCAL.sh
```

**5. Open in browser:**
- Application: http://localhost:8080
- Test Login: test@example.com / password123

### Prerequisites

- **Node.js** v14 or higher ([Download](https://nodejs.org/))
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - free cloud option)

### Manual Setup

See **[LOCAL_SETUP.md](LOCAL_SETUP.md)** for detailed step-by-step instructions.

### Useful Commands

```bash
# Start server
./START_LOCAL.sh

# Stop server  
./STOP_LOCAL.sh

# Run tests
./TEST_SYSTEM.sh

# View logs
tail -f logs/server.log
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

## 📖 Documentation

- **[LOCAL_SETUP.md](LOCAL_SETUP.md)** - Complete local development guide
- **[QUICK_START.md](QUICK_START.md)** - Quick start guide
- **[DATABASE_RECOMMENDATION.md](DATABASE_RECOMMENDATION.md)** - Database setup guide

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
