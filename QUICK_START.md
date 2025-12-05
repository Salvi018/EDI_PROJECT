# CODECADE - Quick Start Guide

Get up and running in 5 minutes! 🚀

## ⚡ Fastest Way to Start

### Option 1: Automated Setup (Recommended)

```bash
# 1. Run setup script
./SETUP_LOCAL.sh

# 2. Start MongoDB (if using local)
mongod

# 3. Initialize database
cd database && node init_mongodb.js && cd ..

# 4. Start server
./START_LOCAL.sh

# 5. Open browser
open http://localhost:8080
```

### Option 2: Manual Steps

```bash
# 1. Install dependencies
cd backend/node
npm install

# 2. Create .env file
cat > .env << EOF
PORT=8080
NODE_ENV=development
DB_TYPE=mongodb
MONGODB_URI=mongodb://localhost:27017/codecade
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
BCRYPT_ROUNDS=10
EOF

# 3. Start MongoDB
mongod

# 4. Initialize database (in another terminal)
cd database
node init_mongodb.js

# 5. Start server
cd ../backend/node
npm start
```

## 🎯 What You Get

After setup, you'll have:

- ✅ **Web Application** at http://localhost:8080
- ✅ **API Server** running on port 8080
- ✅ **Database** initialized with test user
- ✅ **Test Account**: test@example.com / password123

## 🔧 Troubleshooting

### Port 8080 in use?
```bash
# Change PORT in backend/node/.env to another port (e.g., 3000)
```

### MongoDB connection error?
```bash
# Check if MongoDB is running
mongosh

# Or use MongoDB Atlas (cloud) - update MONGODB_URI in .env
```

### Need help?
See [LOCAL_SETUP.md](LOCAL_SETUP.md) for detailed troubleshooting.

## 📚 Next Steps

1. Explore the application at http://localhost:8080
2. Create your own account or use test credentials
3. Try solving problems, completing lessons, or battling!

---

**That's it! You're ready to code! 🎉**

