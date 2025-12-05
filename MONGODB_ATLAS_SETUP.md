# MongoDB Atlas Setup Guide

This project is configured to use **MongoDB Atlas** (cloud-hosted MongoDB) instead of a local MongoDB installation.

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new organization and project

## Step 2: Create a Cluster

1. Click "Build a Database"
2. Choose the **Free** tier (M0)
3. Select your preferred cloud provider and region
4. Click "Create Deployment"
5. Wait for the cluster to be created (usually 2-3 minutes)

## Step 3: Set Up Authentication

1. Click "Security" > "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Create a username and password (save these securely)
4. Grant "Atlas Admin" permissions
5. Click "Add User"

## Step 4: Set Up Network Access

1. Click "Security" > "Network Access"
2. Click "Add IP Address"
3. Select "Allow access from anywhere" (for development) or add your specific IP
4. Click "Confirm"

## Step 5: Get Your Connection String

1. Go to "Databases" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Drivers"
4. Select "Node.js" or "Python" (depending on your language)
5. Copy the connection string

The connection string will look like:

```
mongodb+srv://username:password@cluster-name.mongodb.net/codecade?retryWrites=true&w=majority
```

## Step 6: Configure Environment Variables

### Option A: Create `.env` file in the project root

1. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and replace the connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster-name.mongodb.net/codecade?retryWrites=true&w=majority
   JWT_SECRET=your_secret_key_here
   ```

### Option B: Set Environment Variables Directly

#### For Local Development (macOS/Linux):

```bash
export MONGODB_URI="mongodb+srv://username:password@cluster-name.mongodb.net/codecade?retryWrites=true&w=majority"
export JWT_SECRET="your_secret_key_here"
```

#### For Docker/Railway/Cloud Deployment:

Add these as environment variables in your deployment platform's configuration.

## Step 7: Initialize the Database

Run the initialization script to create collections and indexes:

```bash
cd backend/python
node ../../database/init_mongodb.js
```

Or if using Python:

```bash
cd backend/python
python app.py
```

## Step 8: Start Your Application

```bash
cd backend/python
python app.py
```

## Important Notes

- **Never commit your `.env` file** - it's already in `.gitignore`
- Replace `username`, `password`, and `cluster-name` with your actual Atlas credentials
- The connection string includes security parameters:
  - `retryWrites=true` - automatically retries failed writes
  - `w=majority` - ensures write acknowledgment from majority of replicas
- MongoDB Atlas has a free tier that's perfect for development and small projects

## Troubleshooting

### Connection Timeout

- Check your IP is whitelisted in Network Access
- Verify your username and password are correct
- Ensure special characters in password are URL-encoded

### Authentication Failed

- Double-check your credentials
- URL-encode special characters: `@` becomes `%40`, `:` becomes `%3A`

### Database Not Created

- Collections are created automatically on first write
- Run `init_mongodb.js` to manually create collections and indexes

## Project Structure

- `backend/python/db/mongodb.py` - MongoDB connection handler
- `backend/python/app.py` - Flask app initialization
- `database/init_mongodb.js` - Database initialization script
- `.env.example` - Example environment configuration
