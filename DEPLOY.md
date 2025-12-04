# 🚀 Deploy to Vercel

## Steps:

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

4. **Set Environment Variables** (in Vercel dashboard)
```
PORT=8080
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
BCRYPT_ROUNDS=10
DB_TYPE=csv
```

5. **Deploy to Production**
```bash
vercel --prod
```

## ⚠️ Important Notes:

- CSV database will reset on each deployment (Vercel is stateless)
- For production, use a real database (MongoDB, PostgreSQL)
- Update API URLs in frontend to use Vercel domain

## 🔄 Alternative: Use Database

Replace CSV with MongoDB Atlas (free):
1. Create account at mongodb.com
2. Get connection string
3. Update backend to use MongoDB
4. Redeploy

## 📝 After Deployment:

Your site will be at: `https://your-project.vercel.app`
