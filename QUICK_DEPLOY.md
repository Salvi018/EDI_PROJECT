# Quick Deployment Guide - CODECADE

## 🚀 Fastest Way to Deploy

### Step 1: Setup MongoDB Atlas (5 minutes)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free account)
3. Create a free cluster (M0 tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password
7. Save the connection string

### Step 2: Deploy to Railway (Recommended)

**Why Railway?**
- ✅ Free tier available
- ✅ Easy MongoDB integration
- ✅ WebSocket support (for battles)
- ✅ Auto-deploy from GitHub

**Steps:**

1. **Push to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **Go to Railway**: https://railway.app
   - Sign up with GitHub
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure**:
   - Root Directory: `backend/node`
   - Build Command: `npm install`
   - Start Command: `node server.js`

4. **Set Environment Variables** in Railway:
   ```
   NODE_ENV=production
   PORT=8080
   DB_TYPE=mongodb
   MONGODB_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=generate-a-random-secret-key-here
   JWT_EXPIRE=7d
   BCRYPT_ROUNDS=10
   ```

5. **Deploy**: Railway will auto-deploy!

6. **Get Your URL**: Railway gives you a URL like `https://codecade-production.up.railway.app`

7. **Initialize Database**:
   - Go to Railway dashboard
   - Open console/terminal
   - Run: `node ../../database/init_mongodb.js`

### Step 3: Update Frontend API URL

After deployment, update `frontend/js/api.js`:

```javascript
// Change from:
const API_URL = 'http://localhost:8080';

// To:
const API_URL = window.location.origin; // Auto-detects production URL
```

Or set environment-based:
```javascript
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-app.railway.app'
  : 'http://localhost:8080';
```

---

## 🎯 Alternative: Deploy to Render

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: codecade
   - **Root Directory**: `backend/node`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`

6. Set same environment variables as Railway

7. Deploy!

---

## ✅ Post-Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Connection string saved
- [ ] Environment variables set
- [ ] App deployed and running
- [ ] Database initialized
- [ ] Frontend API URL updated
- [ ] Test login/signup works
- [ ] All features working

---

## 🔑 Generate Secure JWT Secret

For production, use a strong random secret:

```bash
# Generate random secret (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use as `JWT_SECRET`.

---

## 🌐 Your Live Website

After deployment, your website will be live at:
- Railway: `https://your-app.up.railway.app`
- Render: `https://your-app.onrender.com`

---

## 📚 Need More Details?

See **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** for comprehensive deployment instructions.

---

**Ready? Follow Step 1 and Step 2 above!** 🚀

