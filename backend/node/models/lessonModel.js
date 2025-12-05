const { getDB } = require('../db/mongodb');
const { ObjectId } = require('mongodb');

const getCompletedLessons = async (userId) => {
  const db = getDB();
  if (!db) return [];
  
  const lessons = await db.collection('completed_lessons')
    .find({ user_id: new ObjectId(userId) })
    .toArray();
  return lessons;
};

const completeLesson = async (userId, lessonId) => {
  const db = getDB();
  if (!db) return false;
  
  const existing = await db.collection('completed_lessons').findOne({
    user_id: new ObjectId(userId),
    lesson_id: lessonId
  });
  
  if (existing) return false;
  
  await db.collection('completed_lessons').insertOne({
    user_id: new ObjectId(userId),
    lesson_id: lessonId,
    completed_at: new Date()
  });
  
  return true;
};

module.exports = { getCompletedLessons, completeLesson };
