# CODECADE - DSA Learning Platform

A comprehensive platform for learning Data Structures & Algorithms with real-time analytics, interactive challenges, and AI-powered study planning.

## 🚀 Quick Start Guide

### Prerequisites

- **Python 3.8+** ([Download](https://www.python.org/downloads/))
- **pip** (comes with Python)
- **MongoDB Atlas** (free cloud database) - [Setup Guide](MONGODB_ATLAS_SETUP.md)

### Step 1: Clone and Setup

```bash
# Navigate to the project directory
cd EDI_PROJECT

# Create and activate a Python virtual environment
python3 -m venv venv
source venv/bin/activate  # On macOS/Linux
# or
venv\Scripts\activate  # On Windows
```

### Step 2: Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your MongoDB Atlas connection string
# MONGODB_URI=mongodb+srv://username:password@cluster-name.mongodb.net/codecade?retryWrites=true&w=majority
```

👉 **Don't have MongoDB Atlas yet?** Follow the [MONGODB_ATLAS_SETUP.md](MONGODB_ATLAS_SETUP.md) guide first.

### Step 3: Install Backend Dependencies

```bash
cd backend/python
pip install -r requirements.txt
```

### Step 4: Initialize the Database (First Time Only)

```bash
cd database
node init_mongodb.js
```

_Requires Node.js. If you don't have it, [download here](https://nodejs.org/). This creates collections and test user._

### Step 5: Start the Backend Server

```bash
cd backend/python
python app.py
```

You should see:

```
✅ MongoDB Atlas connected successfully
 * Running on http://localhost:5000
```

### Step 6: Open in Browser

- **Application**: http://localhost:5000
- **Test Login**:
  - Email: `test@example.com`
  - Password: `password123`

---

## 📋 Complete Setup Instructions

### For macOS/Linux Users

```bash
# 1. Navigate to project
cd EDI_PROJECT

# 2. Create virtual environment
python3 -m venv venv
source venv/bin/activate

# 3. Copy and configure environment
cp .env.example .env
# Edit .env with your MongoDB Atlas URI

# 4. Install dependencies
cd backend/python
pip install -r requirements.txt

# 5. Initialize database (if first time)
cd ../../database
node init_mongodb.js

# 6. Start server
cd ../backend/python
python app.py
```

### For Windows Users

```bash
# 1. Navigate to project
cd EDI_PROJECT

# 2. Create virtual environment
python -m venv venv
venv\Scripts\activate

# 3. Copy and configure environment
copy .env.example .env
# Edit .env with your MongoDB Atlas URI

# 4. Install dependencies
cd backend\python
pip install -r requirements.txt

# 5. Initialize database (if first time)
cd ..\..\database
node init_mongodb.js

# 6. Start server
cd ..\backend\python
python app.py
```

---

## 🔗 API Endpoints

The server runs on `http://localhost:5000` with the following main routes:

- **Authentication**: `/auth/*` - Login, registration, JWT tokens
- **User Profile**: `/user/*` - User data, progress tracking
- **Problems**: `/problems/*` - DSA problems and submissions
- **Lessons**: `/lessons/*` - Learning modules
- **Battles**: `/battle/*` - Head-on competitive mode
- **StudyBot**: `/studybot/*` - AI-powered study plans
- **Health Check**: `/health` - Server status

---

## 🗂️ Project Structure

```
EDI_PROJECT/
├── backend/
│   └── python/              # Python/Flask backend
│       ├── app.py           # Main Flask application
│       ├── requirements.txt  # Python dependencies
│       ├── db/              # Database connection
│       ├── models/          # Data models
│       ├── routes/          # API routes
│       └── middleware/      # Auth & validation
│
├── frontend/                # HTML/CSS/JS frontend
│   ├── pages/               # HTML pages
│   ├── js/                  # JavaScript files
│   └── assets/              # Images & audio
│
├── database/
│   └── init_mongodb.js      # Database initialization
│
├── .env.example             # Environment template
├── MONGODB_ATLAS_SETUP.md   # MongoDB Atlas guide
└── README.md                # This file
```

---

## 🛠️ Troubleshooting

### Problem: "ModuleNotFoundError: No module named 'flask'"

**Solution**: Make sure your virtual environment is activated and dependencies are installed:

```bash
source venv/bin/activate  # macOS/Linux
pip install -r backend/python/requirements.txt
```

### Problem: "MONGODB_URI environment variable not set"

**Solution**: Create a `.env` file in the project root with your MongoDB Atlas connection string:

```bash
cp .env.example .env
# Edit .env and add your connection string
```

### Problem: "Failed to connect to MongoDB Atlas"

**Possible causes**:

- Invalid connection string in `.env`
- IP address not whitelisted in MongoDB Atlas
- Wrong username or password
- No internet connection

**Solution**: Check the [MONGODB_ATLAS_SETUP.md](MONGODB_ATLAS_SETUP.md) guide for detailed troubleshooting.

### Problem: Port 5000 already in use

**Solution**: Change the port in the code or stop the process using port 5000:

```bash
# macOS/Linux
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

## 📚 Additional Documentation

- **[MONGODB_ATLAS_SETUP.md](MONGODB_ATLAS_SETUP.md)** - Complete MongoDB Atlas setup guide
- **[.env.example](.env.example)** - Environment variables reference

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

- **[MONGODB_ATLAS_SETUP.md](MONGODB_ATLAS_SETUP.md)** - MongoDB Atlas cloud database setup (recommended)
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

**MongoDB Atlas (Cloud - Recommended)**:

- Free tier: 512MB storage
- No infrastructure to manage
- Automatic backups and scaling
- [See setup guide](MONGODB_ATLAS_SETUP.md)

**Local MongoDB**:

- Requires local installation
- Good for development without internet
- Data stored locally on your machine

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
