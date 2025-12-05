const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/codecade';
const client = new MongoClient(uri);

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db('codecade');
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
  }
}

function getDB() {
  if (!db) {
    console.warn('⚠️  MongoDB not connected. Some features may not work.');
  }
  return db;
}

module.exports = { connectDB, getDB };
