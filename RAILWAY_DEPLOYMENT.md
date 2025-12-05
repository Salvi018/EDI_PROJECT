# Railway Deployment Guide - CODECADE

Complete guide to deploy CODECADE on Railway.app

---

## 🚀 Quick Deploy Steps

1. Push code to GitHub
2. Create Railway account
3. Deploy from GitHub
4. Add environment variables
5. Initialize database
6. Access your app

---

## Step 1: Prepare Your Code

### 1.1 Create `.gitignore` (if not exists)

```bash
node_modules/
.env
*.log
.DS_Store
```

### 1.2 Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/codecade.git
git push -u origin main
```

---

## Step 2: Create Railway Account

1. Go to https://railway.app
2. Click "Login" or "Start a New Project"
3. Sign up with GitHub (recommended)
4. Authorize Railway to access your repositories

---

## Step 3: Deploy Project

### 3.1 Create New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `codecade` repository
4. Railway will detect it's a Node.js project

### 3.2 Configure Root Directory

Since your backend is in `backend/node/`:

1. Click on your service
2. Go to "Settings"
3. Find "Root Directory"
4. Set to: `backend/node`
5. Click "Save"

### 3.3 Configure Start Command

1. In "Settings"
2. Find "Start Command"
3. Set to: `node server.js`
4. Click "Save"

---

## Step 4: Add Environment Variables

### 4.1 Go to Variables Tab

1. Click on your service
2. Click "Variables" tab
3. Click "New Variable"

### 4.2 Add Required Variables

Add these one by one:

**1. MongoDB Connection:**
```
MONGODB_URI=mongodb+srv://CODECADE:lifehaihotahai@codecade.5owhp5i.mongodb.net/codecade?retryWrites=true&w=majority
```

**2. JWT Secret:**
```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**3. Port (Railway auto-assigns):**
```
PORT=8080
```

**4. Node Environment:**
```
NODE_ENV=production
```

### 4.3 Save Variables

Click "Add" for each variable

---

## Step 5: Deploy Frontend

### Option A: Deploy Frontend Separately

1. Click "New Service" in your project
2. Select "Deploy from GitHub repo"
3. Choose same repository
4. Set Root Directory to: `frontend`
5. Railway will serve static files

### Option B: Serve Frontend from Backend

Update `backend/node/server.js`:

```javascript
const express = require('express');
const path = require('path');
const app = express();

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../../frontend')));

// API routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
// ... other routes

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/pages/index.html'));
});
```

---

## Step 6: Initialize Database

### 6.1 Get Railway Shell Access

1. Click on your service
2. Click "..." menu
3. Select "Shell"

### 6.2 Run Database Initialization

```bash
cd database
node init_mongodb.js
```

Or create a Railway deployment script.

---

## Step 7: Get Your App URL

1. Go to "Settings" tab
2. Find "Domains" section
3. Click "Generate Domain"
4. Your app will be at: `https://your-app.up.railway.app`

---

## Step 8: Update Frontend API URLs

Update all API calls in frontend to use Railway URL:

**Before:**
```javascript
fetch('http://localhost:8080/auth/login', ...)
```

**After:**
```javascript
const API_URL = 'https://your-app.up.railway.app';
fetch(`${API_URL}/auth/login`, ...)
```

Or use environment detection:
```javascript
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:8080' 
  : 'https://your-app.up.railway.app';
```

---

## 🔧 Configuration Files

### Create `railway.json` (optional)

```json
{
  "$schema": "https://railway.app/railway.schema.json",
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

### Update `package.json`

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "engines": {
    "node": ">=14.0.0"
  }
}
```

---

## 🐛 Troubleshooting

### Issue 1: Build Failed

**Check:**
- Root directory is set to `backend/node`
- `package.json` exists in root directory
- All dependencies are in `package.json`

**Fix:**
```bash
cd backend/node
npm install
git add package-lock.json
git commit -m "Add package-lock"
git push
```

### Issue 2: Application Error

**Check Logs:**
1. Click on your service
2. Click "Deployments"
3. Click latest deployment
4. View logs

**Common fixes:**
- Check environment variables are set
- Verify MongoDB connection string
- Check PORT is using `process.env.PORT`

### Issue 3: MongoDB Connection Failed

**Check:**
- MongoDB Atlas Network Access allows `0.0.0.0/0`
- Connection string is correct
- Database user exists

### Issue 4: Frontend Not Loading

**Check:**
- Static files path is correct
- Frontend files are in repository
- CORS is configured if frontend is separate

---

## 📊 Monitor Your App

### View Logs
1. Click on service
2. Click "Deployments"
3. View real-time logs

### View Metrics
1. Click "Metrics" tab
2. See CPU, Memory, Network usage

### Set Up Alerts
1. Go to project settings
2. Configure notifications
3. Get alerts for crashes/errors

---

## 🔄 Continuous Deployment

Railway auto-deploys on every push to main branch:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Railway automatically deploys
```

### Disable Auto-Deploy
1. Go to service settings
2. Find "Deployments"
3. Toggle "Auto Deploy"

---

## 💰 Pricing

**Free Tier:**
- $5 credit per month
- Enough for small projects
- Sleeps after inactivity

**Upgrade if needed:**
- $5/month for more resources
- No sleep
- Custom domains

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Railway account created
- [ ] Project deployed from GitHub
- [ ] Root directory set to `backend/node`
- [ ] Environment variables added (MONGODB_URI, JWT_SECRET, PORT)
- [ ] MongoDB Atlas configured (0.0.0.0/0 access)
- [ ] Database initialized
- [ ] Domain generated
- [ ] Frontend API URLs updated
- [ ] App tested and working

---

## 🔗 Useful Links

- Railway Dashboard: https://railway.app/dashboard
- Railway Docs: https://docs.railway.app
- MongoDB Atlas: https://cloud.mongodb.com
- Your App: https://your-app.up.railway.app

---

## 🎯 Next Steps

1. **Custom Domain**: Add your own domain in Railway settings
2. **SSL**: Automatic with Railway
3. **Monitoring**: Set up error tracking (Sentry, LogRocket)
4. **Backups**: Configure MongoDB Atlas backups
5. **CI/CD**: Add GitHub Actions for testing before deploy

---

## 📝 Environment Variables Reference

```env
# Required
MONGODB_URI=mongodb+srv://CODECADE:lifehaihotahai@codecade.5owhp5i.mongodb.net/codecade?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-here
PORT=8080
NODE_ENV=production

# Optional
CORS_ORIGIN=https://your-frontend-domain.com
SESSION_SECRET=another-secret-key
```

---

## 🚨 Security Notes

1. **Never commit `.env` files**
2. **Use strong JWT_SECRET** (generate with: `openssl rand -base64 32`)
3. **Enable CORS** only for your domain
4. **Use HTTPS** (automatic with Railway)
5. **Rotate secrets** regularly

---

## 📞 Support

- Railway Discord: https://discord.gg/railway
- Railway Docs: https://docs.railway.app
- GitHub Issues: Create issue in your repo
