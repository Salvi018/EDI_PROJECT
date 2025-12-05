# Railway Deployment Checklist

Quick checklist for deploying CODECADE to Railway.

## ✅ Pre-Deployment

- [ ] MongoDB Atlas account created
- [ ] MongoDB cluster created (free tier)
- [ ] Database user created
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string copied
- [ ] Project pushed to GitHub
- [ ] Railway account created

## ✅ Railway Setup

- [ ] Logged into Railway
- [ ] Created new project
- [ ] Connected GitHub repository
- [ ] Set Root Directory: `backend/node`
- [ ] Set Start Command: `node server.js`

## ✅ Environment Variables

Set in Railway Variables tab:

- [ ] `NODE_ENV=production`
- [ ] `PORT=8080` (Railway sets this automatically)
- [ ] `DB_TYPE=mongodb`
- [ ] `MONGODB_URI=your-atlas-connection-string`
- [ ] `JWT_SECRET=generated-secret-key`
- [ ] `JWT_EXPIRE=7d`
- [ ] `BCRYPT_ROUNDS=10`
- [ ] `ALLOWED_ORIGINS=your-railway-url`

## ✅ Deployment

- [ ] Deployment started
- [ ] Deployment successful
- [ ] Got Railway URL
- [ ] Updated ALLOWED_ORIGINS with Railway URL

## ✅ Database

- [ ] Database initialized
- [ ] Collections created
- [ ] Test user created (optional)

## ✅ Testing

- [ ] Website loads at Railway URL
- [ ] Health endpoint works: `/health`
- [ ] User signup works
- [ ] User login works
- [ ] Features work correctly

---

**Ready to deploy? Follow DEPLOY_RAILWAY.md for detailed steps!**

