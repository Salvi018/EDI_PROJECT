const { getDB } = require('../db/mongodb');
const { ObjectId } = require('mongodb');

const getSolvedProblems = async (userId) => {
  const db = getDB();
  if (!db) return [];
  
  const problems = await db.collection('solved_problems')
    .find({ user_id: new ObjectId(userId) })
    .toArray();
  return problems;
};

const solveProblem = async (userId, problemId, attempts, timeTaken) => {
  const db = getDB();
  if (!db) return { problemId, attempts, timeTaken };
  
  const existing = await db.collection('solved_problems').findOne({
    user_id: new ObjectId(userId),
    problem_id: problemId
  });
  
  if (!existing) {
    await db.collection('solved_problems').insertOne({
      user_id: new ObjectId(userId),
      problem_id: problemId,
      attempts,
      time_taken: timeTaken,
      solved_at: new Date()
    });
  }
  
  return { problemId, attempts, timeTaken };
};

module.exports = { getSolvedProblems, solveProblem };
