// MongoDB Initialization Script for CODECADE
// Run with: node init_mongodb.js

const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/codecade';

async function initDatabase() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('codecade');
    
    // Create collections
    const collections = ['users', 'solved_problems', 'completed_lessons', 'battles'];
    
    for (const collectionName of collections) {
      const exists = await db.listCollections({ name: collectionName }).hasNext();
      if (!exists) {
        await db.createCollection(collectionName);
        console.log(`✅ Created collection: ${collectionName}`);
      }
    }
    
    // Create indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ username: 1 }, { unique: true });
    await db.collection('solved_problems').createIndex({ user_id: 1 });
    await db.collection('completed_lessons').createIndex({ user_id: 1 });
    await db.collection('battles').createIndex({ player1_id: 1 });
    await db.collection('battles').createIndex({ player2_id: 1 });
    console.log('✅ Created indexes');
    
    // Create test user
    const testUserExists = await db.collection('users').findOne({ email: 'test@example.com' });
    
    if (!testUserExists) {
      const passwordHash = await bcrypt.hash('password123', 10);
      await db.collection('users').insertOne({
        username: 'TestPlayer',
        email: 'test@example.com',
        password_hash: passwordHash,
        level: 1,
        xp: 0,
        streak_days: 0,
        college: '',
        battle_rating: 1200,
        battle_wins: 0,
        battle_losses: 0,
        created_at: new Date()
      });
      console.log('✅ Created test user: test@example.com / password123');
    } else {
      console.log('ℹ️  Test user already exists');
    }
    
    console.log('\n🎉 Database initialization complete!');
    
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  } finally {
    await client.close();
  }
}

initDatabase();
