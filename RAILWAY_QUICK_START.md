# 🚂 Railway Quick Start - Deploy in 10 Minutes

## Step-by-Step Visual Guide

### 📋 Step 1: Setup MongoDB Atlas (5 minutes)

1. **Go to**: https://www.mongodb.com/cloud/atlas/register
   - Sign up (free account)
   
2. **Create Database**:
   - Click "Build a Database"
   - Choose **FREE** (M0) tier
   - Click "Create"
   
3. **Create Database User**:
   - Go to "Database Access" → "Add New Database User"
   - Username: `codecade`
   - Password: Create a strong password (save it!)
   - Click "Add User"
   
4. **Allow Network Access**:
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere"
   - Click "Confirm"
   
5. **Get Connection String**:
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your password
   - Replace `<dbname>` with `codecade`
   - **Example**: `mongodb+srv://codecade:yourpassword@cluster0.xxxxx.mongodb.net/codecade?retryWrites=true&w=majority`
   - **Save this!**

---

### 🚀 Step 2: Deploy to Railway (5 minutes)

#### Option A: Via Railway Dashboard (Easiest)

1. **Go to Railway**: https://railway.app
   - Click "Login" or "Start a New Project"
   - Sign in with **GitHub** (recommended)

2. **Create Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Authorize Railway (if first time)
   - Select your **CODECADE repository**

3. **Configure Service**:
   - Railway auto-detects Node.js
   - Go to **Settings** tab:
     - **Root Directory**: Set to `backend/node`
     - **Start Command**: `node server.js` (should be auto-set)

4. **Add Environment Variables**:
   - Go to **Variables** tab
   - Click "New Variable" and add each:
   
   ```
   NODE_ENV = production
   PORT = 8080
   DB_TYPE = mongodb
   MONGODB_URI = (paste your Atlas connection string here)
   JWT_SECRET = (generate one - see below)
   JWT_EXPIRE = 7d
   BCRYPT_ROUNDS = 10
   ```

5. **Generate JWT Secret**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Copy the output and use as `JWT_SECRET`

6. **Deploy**:
   - Railway auto-deploys when you save variables
   - Wait 2-3 minutes
   - Check **Deployments** tab for status

7. **Get Your URL**:
   - Go to **Settings** → **Networking**
   - Railway gives you a URL like: `https://codecade-production.up.railway.app`
   - Copy this URL!

8. **Update CORS**:
   - Go back to **Variables**
   - Add: `ALLOWED_ORIGINS = https://your-app-name.up.railway.app`
   - (Replace with your actual Railway URL)

---

### 🗄️ Step 3: Initialize Database

After deployment works:

1. **Option A - Using Railway Console**:
   - Go to Railway dashboard
   - Click your service → **Deployments** tab
   - Click latest deployment → **View Logs**
   - Or use the **Console** button
   - Run: `node ../../database/init_mongodb.js`

2. **Option B - Using MongoDB Atlas**:
   - Go to MongoDB Atlas dashboard
   - Click "Browse Collections"
   - Collections will be created automatically when app runs

---

### ✅ Step 4: Test Your Website

1. **Visit Your URL**: 
   - Go to: `https://your-app-name.up.railway.app`
   - You should see CODECADE homepage!

2. **Test Health**:
   - Visit: `https://your-app-name.up.railway.app/health`
   - Should show: `{"status":"OK"}`

3. **Create Account**:
   - Click "Sign Up"
   - Create your account
   - Start using the app!

---

## 🔑 Environment Variables Quick Reference

Copy-paste these into Railway Variables tab:

```
NODE_ENV=production
PORT=8080
DB_TYPE=mongodb
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codecade?retryWrites=true&w=majority
JWT_SECRET=your-generated-secret-here
JWT_EXPIRE=7d
BCRYPT_ROUNDS=10
ALLOWED_ORIGINS=https://your-app-name.up.railway.app
```

---

## 🎯 Troubleshooting

### Build Fails?
- ✅ Check Root Directory is set to `backend/node`
- ✅ Verify package.json exists in backend/node/

### Can't Connect to Database?
- ✅ Check MONGODB_URI is correct
- ✅ Verify MongoDB Atlas network access is open (0.0.0.0/0)
- ✅ Check username/password in connection string

### Website Not Loading?
- ✅ Check deployment logs in Railway
- ✅ Verify environment variables are set
- ✅ Wait a few minutes for deployment to complete

---

## 📊 Railway Dashboard Locations

- **Deployments**: View build logs and status
- **Variables**: Manage environment variables
- **Settings**: Configure service (Root Directory, etc.)
- **Networking**: Get your public URL

---

## 🎉 You're Done!

Your website is now live at:
**https://your-app-name.up.railway.app**

---

**Need help? Check DEPLOY_RAILWAY.md for detailed troubleshooting.**

