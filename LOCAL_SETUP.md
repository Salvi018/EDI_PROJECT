# CODECADE - Local Development Setup Guide

Complete guide to set up and run CODECADE on your local machine.

## 📋 Prerequisites

Before starting, ensure you have:

- **Node.js** v14 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **MongoDB** (optional - can use cloud MongoDB Atlas instead)
  - Local: [Download MongoDB Community](https://www.mongodb.com/try/download/community)
  - Cloud: [MongoDB Atlas (Free)](https://www.mongodb.com/cloud/atlas)

## 🚀 Quick Start (Automated Setup)

The easiest way to set up the project:

```bash
# 1. Run the setup script
./SETUP_LOCAL.sh

# 2. Start MongoDB (if using local MongoDB)
mongod --dbpath /path/to/data

# 3. Initialize database (if MongoDB is running)
cd database
node init_mongodb.js

# 4. Start the server
./START_LOCAL.sh
```

That's it! Open http://localhost:8080 in your browser.

## 📝 Manual Setup (Step by Step)

### Step 1: Install Dependencies

```bash
cd backend/node
npm install
cd ../..
```

### Step 2: Configure Environment Variables

Create a `.env` file in `backend/node/`:

```bash
cd backend/node
cp .env.example .env  # If you have a template
# Or create .env manually
```

Edit `.env` with your settings:

```env
# Server Configuration
PORT=8080
NODE_ENV=development

# Database Configuration
DB_TYPE=mongodb
MONGODB_URI=mongodb://localhost:27017/codecade
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/codecade

# JWT Configuration
JWT_SECRET=your-secret-key-change-this
JWT_EXPIRE=7d

# Bcrypt Configuration
BCRYPT_ROUNDS=10
```

### Step 3: Set Up MongoDB

#### Option A: Local MongoDB

1. **Install MongoDB** (if not already installed)
   - macOS: `brew install mongodb-community`
   - Linux: Follow [MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/)
   - Windows: Download from [MongoDB Downloads](https://www.mongodb.com/try/download/community)

2. **Start MongoDB**
   ```bash
   # macOS/Linux
   mongod --dbpath /path/to/data/directory
   
   # Or use default path
   mongod
   ```

#### Option B: MongoDB Atlas (Cloud - Recommended)

1. **Create free account** at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Create a cluster** (free tier available)
3. **Get connection string**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
4. **Update `.env`**:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codecade?retryWrites=true&w=majority
   ```

### Step 4: Initialize Database

```bash
cd database
node init_mongodb.js
```

This will:
- Create required collections
- Set up indexes
- Create a test user (test@example.com / password123)

### Step 5: Start the Server

#### Option A: Using the Start Script

```bash
./START_LOCAL.sh
```

#### Option B: Manual Start

```bash
cd backend/node
npm start
```

#### Option C: Development Mode (with auto-reload)

```bash
cd backend/node
npm run dev  # If nodemon is installed
```

### Step 6: Access the Application

Open your browser and navigate to:
- **Main Application**: http://localhost:8080
- **Health Check**: http://localhost:8080/health

## 🧪 Test Login

After database initialization, you can login with:
- **Email**: test@example.com
- **Password**: password123

Or create a new account through the signup page.

## 🛠️ Useful Commands

### Start/Stop Server

```bash
# Start server
./START_LOCAL.sh

# Stop server
./STOP_LOCAL.sh

# Or manually
cd backend/node
npm start
# Press Ctrl+C to stop
```

### View Logs

```bash
# Server logs
tail -f logs/server.log

# Or if running manually, logs appear in terminal
```

### Run Tests

```bash
# Quick system test
./TEST_SYSTEM.sh

# Comprehensive tests
./run_comprehensive_tests.sh
```

### Database Operations

```bash
# Initialize database
cd database
node init_mongodb.js

# Test database connection
node test_connection.js
```

## 🐛 Troubleshooting

### Port 8080 Already in Use

```bash
# Find what's using the port
lsof -i :8080

# Kill the process or change PORT in .env
```

### MongoDB Connection Failed

1. **Check if MongoDB is running**:
   ```bash
   # Local MongoDB
   mongosh  # Should connect if running
   
   # Or check process
   pgrep mongod
   ```

2. **Verify connection string** in `.env`:
   - Local: `mongodb://localhost:27017/codecade`
   - Atlas: Check username, password, and cluster URL

3. **Check firewall/network** for MongoDB Atlas

### Dependencies Not Installed

```bash
cd backend/node
rm -rf node_modules package-lock.json
npm install
```

### Server Won't Start

1. **Check logs**: `tail -f logs/server.log`
2. **Verify Node.js version**: `node -v` (should be v14+)
3. **Check environment variables**: Ensure `.env` file exists
4. **Verify database connection**: Run `node test_connection.js`

### Database Not Initialized

```bash
cd database
node init_mongodb.js
```

Make sure MongoDB is running before initializing.

## 📁 Project Structure

```
CODECADE/
├── backend/
│   └── node/           # Backend server
│       ├── .env        # Environment variables (create this)
│       ├── server.js   # Main server file
│       └── ...
├── frontend/           # Frontend files
├── database/           # Database scripts
├── logs/               # Server logs
├── SETUP_LOCAL.sh      # Setup script
├── START_LOCAL.sh      # Start server script
└── STOP_LOCAL.sh       # Stop server script
```

## 🔧 Development Tips

1. **Auto-reload**: Install nodemon for auto-reload during development
   ```bash
   cd backend/node
   npm install --save-dev nodemon
   npm run dev
   ```

2. **Environment Variables**: Never commit `.env` file to git (already in .gitignore)

3. **Database**: Use MongoDB Compass (GUI) to view/manage database locally

4. **Logs**: Check `logs/server.log` for server errors and debugging

## 📚 Next Steps

- Explore the API endpoints at http://localhost:8080
- Check the README.md for feature documentation
- Review API endpoints in `backend/node/routes/`
- Customize frontend in `frontend/` directory

## 🆘 Need Help?

1. Check the logs: `logs/server.log`
2. Review error messages in terminal
3. Verify all prerequisites are installed
4. Ensure MongoDB is running and accessible
5. Check that port 8080 is available

---

**Happy Coding! 🚀**

