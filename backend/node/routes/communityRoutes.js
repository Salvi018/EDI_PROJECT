const express = require('express');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get all users
router.get('/users', authMiddleware, async (req, res) => {
  try {
    const { getDB } = require('../db/mongodb');
    const db = getDB();
    
    if (!db) {
      return res.json({ users: [] });
    }
    
    const users = await db.collection('users')
      .find({}, { projection: { password: 0 } })
      .limit(50)
      .toArray();
    
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user connections
router.get('/connections', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { getDB } = require('../db/mongodb');
    const { ObjectId } = require('mongodb');
    const db = getDB();
    
    if (!db) {
      return res.json({ connections: [] });
    }
    
    const connections = await db.collection('connections')
      .find({ user_id: new ObjectId(userId), status: 'accepted' })
      .toArray();
    
    res.json({ connections });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get connection requests
router.get('/requests', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { getDB } = require('../db/mongodb');
    const { ObjectId } = require('mongodb');
    const db = getDB();
    
    if (!db) {
      return res.json({ requests: [] });
    }
    
    const requests = await db.collection('connections')
      .find({ to_user_id: new ObjectId(userId), status: 'pending' })
      .toArray();
    
    res.json({ requests });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send connection request
router.post('/request', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.body;
    const fromUserId = req.user.id;
    const { getDB } = require('../db/mongodb');
    const { ObjectId } = require('mongodb');
    const db = getDB();
    
    if (!db) {
      return res.json({ success: true });
    }
    
    await db.collection('connections').insertOne({
      from_user_id: new ObjectId(fromUserId),
      to_user_id: new ObjectId(userId),
      status: 'pending',
      created_at: new Date()
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Accept connection request
router.post('/accept/:requestId', authMiddleware, async (req, res) => {
  try {
    const { requestId } = req.params;
    const { getDB } = require('../db/mongodb');
    const { ObjectId } = require('mongodb');
    const db = getDB();
    
    if (!db) {
      return res.json({ success: true });
    }
    
    await db.collection('connections').updateOne(
      { _id: new ObjectId(requestId) },
      { $set: { status: 'accepted', accepted_at: new Date() } }
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Decline connection request
router.post('/decline/:requestId', authMiddleware, async (req, res) => {
  try {
    const { requestId } = req.params;
    const { getDB } = require('../db/mongodb');
    const { ObjectId } = require('mongodb');
    const db = getDB();
    
    if (!db) {
      return res.json({ success: true });
    }
    
    await db.collection('connections').deleteOne({ _id: new ObjectId(requestId) });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get groups
router.get('/groups', authMiddleware, async (req, res) => {
  try {
    const { getDB } = require('../db/mongodb');
    const db = getDB();
    
    if (!db) {
      return res.json({ groups: [] });
    }
    
    const groups = await db.collection('groups').find().toArray();
    
    res.json({ groups });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create group
router.post('/groups', authMiddleware, async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;
    const { getDB } = require('../db/mongodb');
    const { ObjectId } = require('mongodb');
    const db = getDB();
    
    if (!db) {
      return res.json({ success: true });
    }
    
    await db.collection('groups').insertOne({
      name,
      description,
      creator_id: new ObjectId(userId),
      members: [new ObjectId(userId)],
      created_at: new Date()
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Join group
router.post('/groups/:groupId/join', authMiddleware, async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;
    const { getDB } = require('../db/mongodb');
    const { ObjectId } = require('mongodb');
    const db = getDB();
    
    if (!db) {
      return res.json({ success: true });
    }
    
    await db.collection('groups').updateOne(
      { _id: new ObjectId(groupId) },
      { $addToSet: { members: new ObjectId(userId) } }
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
