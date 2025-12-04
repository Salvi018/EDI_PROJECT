# 🚂 Deploy to Railway (Easiest Option)

## Why Railway?
- ✅ Free tier ($5 credit/month)
- ✅ Built-in PostgreSQL (no setup needed)
- ✅ One-click deploy
- ✅ Auto-deploy from GitHub

## Steps:

### 1. Create Railway Account
- Go to: https://railway.app
- Sign up with GitHub

### 2. Deploy Backend
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize
railway init

# Deploy
railway up
```

### 3. Add PostgreSQL
- In Railway dashboard, click "New" → "Database" → "PostgreSQL"
- Railway auto-connects it to your app

### 4. Set Environment Variables
Railway auto-sets DATABASE_URL. Add these:
```
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
BCRYPT_ROUNDS=10
DB_TYPE=postgres
```

### 5. Done!
Your backend is live at: `https://your-app.railway.app`

## OR: Keep CSV (Even Simpler)

Just deploy with CSV database:
```bash
railway up
```

Set in Railway dashboard:
```
DB_TYPE=csv
```

**CSV will persist on Railway!** (unlike Vercel)

## 🎯 Recommended: Railway + CSV

Simplest option - no database setup needed!
