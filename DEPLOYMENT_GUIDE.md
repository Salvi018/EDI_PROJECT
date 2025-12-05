# CODECADE - Deployment Guide

Complete guide to deploy your CODECADE application to the cloud.

## 🚀 Deployment Options

### Recommended: Railway or Render (Easiest)

Both platforms support:
- ✅ Node.js applications
- ✅ MongoDB integration
- ✅ WebSocket support (Socket.IO)
- ✅ Automatic deployments
- ✅ Free tier available

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] MongoDB Atlas account (free tier)
- [ ] GitHub repository
- [ ] Environment variables ready
- [ ] Database initialized

---

## Option 1: Deploy to Railway (Recommended)

Railway is the easiest platform for full-stack apps with MongoDB.

### Step 1: Setup MongoDB Atlas (Free)

1. **Create Account**: https://www.mongodb.com/cloud/atlas (free tier)
2. **Create Cluster**: Choose free M0 tier
3. **Get Connection String**:
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database password
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/codecade`

### Step 2: Deploy to Railway

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**:
   ```bash
   railway login
   ```

3. **Initialize Project**:
   ```bash
   cd backend/node
   railway init
   ```

4. **Set Environment Variables** in Railway dashboard:
   ```
   PORT=8080
   NODE_ENV=production
   DB_TYPE=mongodb
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codecade
   JWT_SECRET=your-super-secret-key-change-this
   JWT_EXPIRE=7d
   BCRYPT_ROUNDS=10
   ALLOWED_ORIGINS=https://your-app.railway.app
   ```

5. **Set Root Directory**:
   - In Railway dashboard: Settings → Root Directory → Set to `backend/node`

6. **Deploy**:
   ```bash
   railway up
   ```

7. **Initialize Database**:
   - After deployment, run database init script
   - Or use Railway's console: `railway run node ../../database/init_mongodb.js`

### Railway Configuration File

Create `railway.json`:
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node server.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

## Option 2: Deploy to Render

Render is another excellent free option.

### Step 1: Setup MongoDB Atlas

Same as Railway - get connection string from MongoDB Atlas.

### Step 2: Deploy to Render

1. **Go to**: https://render.com
2. **Create New Web Service**
3. **Connect GitHub Repository**
4. **Configure**:
   - **Name**: codecade
   - **Root Directory**: `backend/node`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free

5. **Set Environment Variables**:
   ```
   PORT=8080
   NODE_ENV=production
   DB_TYPE=mongodb
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codecade
   JWT_SECRET=your-super-secret-key
   JWT_EXPIRE=7d
   BCRYPT_ROUNDS=10
   ```

6. **Deploy**: Click "Create Web Service"

7. **Get URL**: Your app will be at `https://codecade.onrender.com`

### Render Configuration

Create `render.yaml` in project root:
```yaml
services:
  - type: web
    name: codecade
    env: node
    rootDir: backend/node
    buildCommand: npm install
    startCommand: node server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: DB_TYPE
        value: mongodb
      - key: PORT
        value: 8080
```

---

## Option 3: Deploy to Vercel

For Vercel, you need to adjust for Socket.IO support.

### Configuration

1. Create `vercel.json` in project root:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/node/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/socket.io/(.*)",
      "dest": "backend/node/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "backend/node/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

Note: Vercel has limitations with WebSockets. Consider Railway or Render instead.

---

## 🔐 Environment Variables for Production

Set these in your hosting platform:

```env
# Server
PORT=8080
NODE_ENV=production

# Database (MongoDB Atlas)
DB_TYPE=mongodb
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codecade?retryWrites=true&w=majority

# Security (CHANGE THESE!)
JWT_SECRET=your-super-secret-production-key-min-32-chars
JWT_EXPIRE=7d
BCRYPT_ROUNDS=10

# CORS (Update with your domain)
ALLOWED_ORIGINS=https://your-app.railway.app,https://your-app.onrender.com

# Logging
LOG_LEVEL=info
```

---

## 🗄️ Database Initialization

After deployment, initialize your database:

### Option A: Using MongoDB Atlas Console

1. Go to MongoDB Atlas
2. Click "Browse Collections"
3. Use the web shell to run initialization

### Option B: Using Railway/Render Console

```bash
# In Railway
railway run node ../../database/init_mongodb.js

# Or SSH into your instance and run
cd database
node init_mongodb.js
```

### Option C: Create Admin Script

Create a one-time initialization script that runs on first deploy.

---

## ✅ Post-Deployment Steps

1. **Test Your Deployment**:
   - Visit your deployed URL
   - Test login/signup
   - Check API endpoints

2. **Initialize Database**:
   - Run database initialization script
   - Create test user if needed

3. **Update Frontend API URLs**:
   - Update `frontend/js/api.js` if hardcoded localhost URLs
   - Use environment variable for API URL

4. **Set Up Custom Domain** (Optional):
   - Configure DNS in your hosting platform
   - Update CORS settings

5. **Monitor Logs**:
   - Check application logs in hosting dashboard
   - Monitor MongoDB Atlas metrics

---

## 🔧 Troubleshooting

### Connection Issues

**Problem**: Cannot connect to MongoDB
- ✅ Check MONGODB_URI is correct
- ✅ Verify MongoDB Atlas IP whitelist (add 0.0.0.0/0 for cloud)
- ✅ Check username/password in connection string

### Port Issues

**Problem**: Port already in use
- ✅ Use PORT environment variable (platform sets this automatically)
- ✅ Remove hardcoded port in code

### Static Files Not Loading

**Problem**: Frontend assets not found
- ✅ Verify static file paths in server.js
- ✅ Check root directory setting in hosting platform

### Socket.IO Not Working

**Problem**: WebSocket connections fail
- ✅ Ensure platform supports WebSockets (Railway/Render do)
- ✅ Check CORS settings for Socket.IO
- ✅ Verify Socket.IO client URL matches server URL

---

## 📊 Recommended Stack

### Production Setup:

1. **Hosting**: Railway or Render (free tier)
2. **Database**: MongoDB Atlas (free tier - 512MB)
3. **CDN**: Optional - Cloudflare (free)
4. **Monitoring**: Railway/Render built-in monitoring

---

## 🚀 Quick Deploy Commands

### Railway:
```bash
npm install -g @railway/cli
railway login
cd backend/node
railway init
railway up
```

### Render:
1. Push to GitHub
2. Connect repo in Render dashboard
3. Configure environment variables
4. Deploy

---

## 📝 Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Connection string obtained
- [ ] Environment variables set
- [ ] GitHub repository ready
- [ ] Database initialized
- [ ] Test deployment locally
- [ ] Custom domain configured (optional)
- [ ] Monitoring set up

---

## 🆘 Need Help?

- **Railway Docs**: https://docs.railway.app
- **Render Docs**: https://render.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com

---

**Ready to deploy? Choose your platform and follow the steps above!** 🚀

