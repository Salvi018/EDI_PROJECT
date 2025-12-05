// Load environment variables from backend/node
process.chdir('./backend/node');
require('dotenv').config();
const { MongoClient } = require('mongodb');
process.chdir('../..');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/codecade';

async function testConnection() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('✅ MongoDB connected successfully!');
    console.log('📍 URI:', uri.replace(/\/\/.*@/, '//<credentials>@'));
    await client.close();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();
