const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../../data/studybot');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

function calculateDays(start, end) {
  const d1 = new Date(start);
  const d2 = new Date(end);
  return Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24)) + 1;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function generatePlan(username, examName, startDate, examDate, dailyHours, topics) {
  const totalDays = calculateDays(startDate, examDate);
  const phase1End = Math.floor(totalDays * 0.4);
  const phase2End = Math.floor(totalDays * 0.8);
  
  const phases = [
    { name: 'Foundation', startDay: 1, endDay: phase1End, focus: 'Basics, easy topics, fundamentals' },
    { name: 'Core DSA', startDay: phase1End + 1, endDay: phase2End, focus: 'Medium/hard topics, problem solving' },
    { name: 'Revision & Tests', startDay: phase2End + 1, endDay: totalDays, focus: 'Full revision + mock tests' }
  ];
  
  const sortedTopics = [...topics].sort((a, b) => {
    const diffMap = { hard: 3, medium: 2, easy: 1 };
    if (diffMap[a.difficulty] !== diffMap[b.difficulty]) return diffMap[b.difficulty] - diffMap[a.difficulty];
    return b.weightage - a.weightage;
  });
  
  const dailyPlan = [];
  const revisionDay = Math.floor(totalDays * 0.8);
  
  for (let day = 1; day <= totalDays; day++) {
    const tasks = [];
    if (day >= revisionDay) {
      tasks.push(`Full revision of all topics (${dailyHours * 30} min)`);
      tasks.push(`Mock test practice (${dailyHours * 30} min)`);
    } else {
      const topic = sortedTopics[(day - 1) % sortedTopics.length];
      const theoryTime = Math.floor(dailyHours * 20);
      const practiceTime = Math.floor(dailyHours * 30);
      const revisionTime = dailyHours * 60 - theoryTime - practiceTime;
      
      tasks.push(`${topic.name} theory (${theoryTime} min)`);
      tasks.push(`${topic.name} problems - ${topic.difficulty} (${practiceTime} min)`);
      tasks.push(day % 5 === 0 ? `Revision: previous topics (${revisionTime} min)` : `${topic.name} practice (${revisionTime} min)`);
    }
    
    dailyPlan.push({ dayIndex: day, date: addDays(startDate, day - 1), tasks });
  }
  
  return {
    username, examName, startDate, examDate, totalDays, dailyHours,
    topics, phases, dailyPlan, createdAt: new Date().toISOString()
  };
}

router.post('/chat', (req, res) => {
  const { username, message } = req.body;
  const planFile = path.join(dataDir, `${username}_plan.json`);
  const hasPlan = fs.existsSync(planFile);
  
  let reply = "Hi! I'm StudyBot. I can help you create personalized study plans for your exams. Just tell me about your exam, topics, and available time!";
  let planPreview = null;
  
  if (message.toLowerCase().includes('plan') || message.toLowerCase().includes('study')) {
    if (hasPlan) {
      const plan = JSON.parse(fs.readFileSync(planFile, 'utf8'));
      reply = `You already have a plan for ${plan.examName}. Want to modify it or create a new one?`;
      planPreview = { totalDays: plan.totalDays, phases: plan.phases };
    } else {
      reply = "I'd love to help you create a study plan! Please provide:\n1. Exam name and date\n2. Topics you need to cover (with difficulty)\n3. How many hours per day you can study\n\nOr use the Quick Plan Creator form!";
    }
  }
  
  res.json({ reply, planPreview });
});

router.post('/plan', (req, res) => {
  const { username, examName, startDate, examDate, dailyHours, topics } = req.body;
  
  if (!username || !examName || !examDate || !topics || topics.length === 0) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const plan = generatePlan(username, examName, startDate || new Date().toISOString().split('T')[0], examDate, dailyHours || 3, topics);
  
  fs.writeFileSync(path.join(dataDir, `${username}_plan.json`), JSON.stringify(plan, null, 2));
  
  res.json({
    message: `I've created a ${plan.totalDays}-day study plan for your ${examName}.`,
    plan
  });
});

router.get('/plan/:username', (req, res) => {
  const planFile = path.join(dataDir, `${req.params.username}_plan.json`);
  if (!fs.existsSync(planFile)) return res.status(404).json({ error: 'No plan found' });
  res.json(JSON.parse(fs.readFileSync(planFile, 'utf8')));
});

module.exports = router;
