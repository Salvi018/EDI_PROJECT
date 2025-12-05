# Deploy CODECADE to Railway - Step by Step Guide

## 🚀 Complete Railway Deployment Guide

### Prerequisites Checklist

Before starting, ensure you have:
- [ ] GitHub account
- [ ] MongoDB Atlas account (free)
- [ ] Railway account (free tier available)
- [ ] Project pushed to GitHub repository

---

## Step 1: Setup MongoDB Atlas (5 minutes)

1. **Create Account**: https://www.mongodb.com/cloud/atlas/register
   - Sign up with email or Google

2. **Create Free Cluster**:
   - Click "Build a Database"
   - Choose **FREE** tier (M0)
   - Select a cloud provider and region (closest to you)
   - Click "Create"

3. **Setup Database User**:
   - Go to "Database Access" → "Add New Database User"
   - Username: `codecade` (or your choice)
   - Password: Generate secure password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**:
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**:
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `codecade`
   - Example: `mongodb+srv://codecade:yourpassword@cluster0.xxxxx.mongodb.net/codecade?retryWrites=true&w=majority`
   - **Save this connection string!**

---

## Step 2: Prepare Your Project

### 2.1: Update API URL (if not already done)

The frontend should auto-detect the URL, but verify `frontend/js/api.js` has:
```javascript
const API_URL = window.location.origin || 'http://localhost:8080';
```

### 2.2: Push to GitHub (if not already)

```bash
# Check git status
git status

# Add all files
git add .

# Commit
git commit -m "Ready for Railway deployment"

# Push to GitHub
git push origin main
```

---

## Step 3: Deploy to Railway

### Option A: Deploy via Railway Dashboard (Recommended - Easiest)

1. **Go to Railway**: https://railway.app

2. **Sign Up/Login**:
   - Click "Start a New Project"
   - Sign in with **GitHub** (recommended)

3. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Authorize Railway to access your repositories
   - Select your CODECADE repository

4. **Configure Service**:
   - Railway will detect Node.js automatically
   - Go to **Settings** tab
   - Set **Root Directory**: `backend/node`
   - Set **Start Command**: `node server.js`

5. **Set Environment Variables**:
   - Go to **Variables** tab
   - Add the following variables:

   ```
   NODE_ENV=production
   PORT=8080
   DB_TYPE=mongodb
   MONGODB_URI=your-mongodb-atlas-connection-string-here
   JWT_SECRET=your-super-secret-key-min-32-chars
   JWT_EXPIRE=7d
   BCRYPT_ROUNDS=10
   ALLOWED_ORIGINS=https://your-app-name.up.railway.app
   ```

   **Important**: 
   - Replace `MONGODB_URI` with your Atlas connection string from Step 1
   - Generate a secure `JWT_SECRET` (see below)
   - Update `ALLOWED_ORIGINS` after you get your Railway URL

6. **Generate JWT Secret**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Copy the output and use as `JWT_SECRET`

7. **Deploy**:
   - Railway will automatically deploy
   - Wait for deployment to complete (2-3 minutes)
   - Check the **Deployments** tab for status

8. **Get Your URL**:
   - Go to **Settings** → **Networking**
   - Railway will generate a URL like: `https://your-app-name.up.railway.app`
   - Copy this URL

9. **Update CORS** (if needed):
   - Go back to **Variables**
   - Update `ALLOWED_ORIGINS` with your Railway URL
   - Redeploy if needed

---

### Option B: Deploy via Railway CLI

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login**:
   ```bash
   railway login
   ```

3. **Initialize Project**:
   ```bash
   cd backend/node
   railway init
   ```

4. **Link to Project** (or create new):
   ```bash
   railway link
   ```

5. **Set Environment Variables**:
   ```bash
   railway variables set NODE_ENV=production
   railway variables set DB_TYPE=mongodb
   railway variables set MONGODB_URI="your-mongodb-connection-string"
   railway variables set JWT_SECRET="your-jwt-secret"
   railway variables set JWT_EXPIRE=7d
   railway variables set BCRYPT_ROUNDS=10
   ```

6. **Set Root Directory** (in Railway dashboard):
   - Go to Settings → Set Root Directory to `backend/node`

7. **Deploy**:
   ```bash
   railway up
   ```

---

## Step 4: Initialize Database

After deployment, initialize your database:

### Option A: Using Railway Console

1. Go to Railway dashboard
2. Click on your service
3. Go to **Deployments** tab
4. Click on the latest deployment
5. Click **View Logs** or **Open Console**
6. Run:
   ```bash
   cd /app
   node ../../database/init_mongodb.js
   ```

### Option B: Using Railway CLI

```bash
railway run node ../../database/init_mongodb.js
```

### Option C: Using MongoDB Atlas Web Shell

1. Go to MongoDB Atlas dashboard
2. Click "Browse Collections"
3. Use the web shell to manually create collections
4. Or connect using MongoDB Compass (GUI tool)

---

## Step 5: Test Your Deployment

1. **Visit Your URL**: 
   - Go to `https://your-app-name.up.railway.app`
   - Should see the CODECADE homepage

2. **Test Health Endpoint**:
   - Visit: `https://your-app-name.up.railway.app/health`
   - Should return: `{"status":"OK","message":"CODECADE Backend Running"}`

3. **Test Features**:
   - Sign up a new account
   - Login
   - Try different pages

---

## Step 6: Custom Domain (Optional)

1. Go to Railway dashboard → Your service → **Settings**
2. Scroll to **Domains**
3. Click **Generate Domain** or **Custom Domain**
4. Follow instructions to configure DNS

---

## ✅ Post-Deployment Checklist

- [ ] MongoDB Atlas cluster created and configured
- [ ] Database connection string saved
- [ ] All environment variables set in Railway
- [ ] App deployed successfully
- [ ] Database initialized (collections created)
- [ ] Website accessible at Railway URL
- [ ] Health endpoint working
- [ ] User signup/login working
- [ ] All features tested

---

## 🔧 Troubleshooting

### Deployment Fails

**Problem**: Build/deployment errors
- ✅ Check Railway logs in dashboard
- ✅ Verify `backend/node/package.json` exists
- ✅ Ensure Root Directory is set to `backend/node`
- ✅ Check environment variables are set

### Database Connection Error

**Problem**: Cannot connect to MongoDB
- ✅ Verify `MONGODB_URI` is correct in Railway variables
- ✅ Check MongoDB Atlas network access (0.0.0.0/0)
- ✅ Verify database user credentials
- ✅ Check connection string format

### Static Files Not Loading

**Problem**: Images/CSS not showing
- ✅ Verify static file paths in `server.js`
- ✅ Check file paths are relative to `backend/node`
- ✅ Clear browser cache

### Socket.IO Not Working

**Problem**: Battle system WebSockets fail
- ✅ Railway supports WebSockets automatically
- ✅ Check CORS settings
- ✅ Verify Socket.IO server configuration

---

## 📊 Railway Dashboard Features

- **Metrics**: View CPU, memory, network usage
- **Logs**: Real-time application logs
- **Deployments**: View deployment history
- **Variables**: Manage environment variables
- **Settings**: Configure service settings

---

## 🔑 Important Environment Variables

| Variable | Value | Example |
|----------|-------|---------|
| `NODE_ENV` | `production` | production |
| `PORT` | Auto-set by Railway | (auto) |
| `DB_TYPE` | `mongodb` | mongodb |
| `MONGODB_URI` | Your Atlas connection | mongodb+srv://... |
| `JWT_SECRET` | Random secure string | (generate) |
| `JWT_EXPIRE` | Token expiry | 7d |
| `BCRYPT_ROUNDS` | Password hashing | 10 |

---

## 💰 Railway Pricing

- **Free Tier**: $5 credit/month
- **Hobby Plan**: $5/month (500 hours)
- **Pro Plan**: $20/month (unlimited)

For small projects, the free tier is usually sufficient!

---

## 🎯 Quick Reference

### Railway URLs:
- Dashboard: https://railway.app/dashboard
- Documentation: https://docs.railway.app

### MongoDB Atlas:
- Dashboard: https://cloud.mongodb.com
- Free tier: 512MB storage

---

## 🚀 Deploy Now!

1. **Setup MongoDB Atlas** (Step 1)
2. **Push to GitHub** (Step 2)
3. **Deploy on Railway** (Step 3)
4. **Initialize Database** (Step 4)
5. **Test & Enjoy!** (Step 5)

**Your website will be live at**: `https://your-app-name.up.railway.app` 🎉

---

**Need help? Check Railway logs or MongoDB Atlas connection issues.**

