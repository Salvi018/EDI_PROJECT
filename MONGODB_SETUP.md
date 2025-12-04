# 🍃 MongoDB Setup for Vercel

## 1. Create MongoDB Atlas Account (FREE)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up (free tier available)
3. Create a cluster (choose FREE tier)
4. Wait 3-5 minutes for cluster creation

## 2. Get Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database password

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/codecade?retryWrites=true&w=majority
```

## 3. Configure Locally

Update `.env`:
```
DB_TYPE=mongodb
MONGODB_URI=your_connection_string_here
```

## 4. Switch to MongoDB Model

Edit `backend/node/models/userModel.js`:
```javascript
// Replace content with userModelMongo.js content
// OR rename files:
mv models/userModel.js models/userModel_csv.js
mv models/userModelMongo.js models/userModel.js
```

## 5. Test Locally

```bash
cd backend/node
node server.js
```

## 6. Deploy to Vercel

1. Add environment variable in Vercel dashboard:
   - Key: `MONGODB_URI`
   - Value: Your connection string

2. Add environment variable:
   - Key: `DB_TYPE`
   - Value: `mongodb`

3. Deploy:
```bash
vercel --prod
```

## ✅ Done!

Your app now uses MongoDB and will work on Vercel!

## 🔒 Security Tips:

- Never commit `.env` file
- Use strong database password
- Whitelist Vercel IPs in MongoDB Atlas (or allow all: 0.0.0.0/0)
