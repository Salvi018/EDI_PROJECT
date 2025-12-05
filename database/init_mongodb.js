// MongoDB Atlas Initialization Script for CODECADE
// Run with: node init_mongodb.js
//
// This script connects to MongoDB Atlas and initializes collections and indexes.
// Required environment variable:
//   MONGODB_URI - MongoDB Atlas connection string
//   Example: mongodb+srv://username:password@cluster-name.mongodb.net/codecade?retryWrites=true&w=majority

const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("❌ Error: MONGODB_URI environment variable is not set");
  console.error("Please set your MongoDB Atlas connection string:");
  console.error(
    'export MONGODB_URI="mongodb+srv://username:password@cluster-name.mongodb.net/codecade?retryWrites=true&w=majority"'
  );
  process.exit(1);
}

async function initDatabase() {
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    retryWrites: true,
  });

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas");

    const db = client.db("codecade");

    // Verify connection
    await db.admin().command({ ping: 1 });
    console.log("✅ Connection verified");

    // Create collections
    const collections = [
      "users",
      "solved_problems",
      "completed_lessons",
      "battles",
    ];

    for (const collectionName of collections) {
      const exists = await db
        .listCollections({ name: collectionName })
        .hasNext();
      if (!exists) {
        await db.createCollection(collectionName);
        console.log(`✅ Created collection: ${collectionName}`);
      }
    }

    // Create indexes
    await db.collection("users").createIndex({ email: 1 }, { unique: true });
    await db.collection("users").createIndex({ username: 1 }, { unique: true });
    await db.collection("solved_problems").createIndex({ user_id: 1 });
    await db.collection("completed_lessons").createIndex({ user_id: 1 });
    await db.collection("battles").createIndex({ player1_id: 1 });
    await db.collection("battles").createIndex({ player2_id: 1 });
    console.log("✅ Created indexes");

    // Create test user
    const testUserExists = await db
      .collection("users")
      .findOne({ email: "test@example.com" });

    if (!testUserExists) {
      const passwordHash = await bcrypt.hash("password123", 10);
      await db.collection("users").insertOne({
        username: "TestPlayer",
        email: "test@example.com",
        password_hash: passwordHash,
        level: 1,
        xp: 0,
        streak_days: 0,
        college: "",
        battle_rating: 1200,
        battle_wins: 0,
        battle_losses: 0,
        created_at: new Date(),
      });
      console.log("✅ Created test user: test@example.com / password123");
    } else {
      console.log("ℹ️  Test user already exists");
    }

    console.log("\n🎉 Database initialization complete!");
  } catch (error) {
    console.error("❌ Error initializing database:", error.message);
    if (
      error.message.includes("ENOTFOUND") ||
      error.message.includes("getaddrinfo")
    ) {
      console.error(
        "   Connection error: Check your internet connection and MongoDB Atlas URI"
      );
    } else if (error.message.includes("authentication failed")) {
      console.error(
        "   Authentication error: Check your username and password"
      );
    } else if (error.message.includes("IP address")) {
      console.error(
        "   IP Whitelist error: Add your IP address in MongoDB Atlas Network Access"
      );
    }
    process.exit(1);
  } finally {
    await client.close();
    console.log("✅ Connection closed");
  }
}

initDatabase();
