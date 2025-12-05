const express = require('express');
const router = express.Router();

router.post('/chat', (req, res) => {
  const { username, message } = req.body;
  
  const reply = "I can help you create a study plan! Use the Quick Plan Creator on the right to get started.";
  
  res.json({ reply });
});

router.post('/plan', (req, res) => {
  const { username, examName, startDate, examDate, dailyHours, topics } = req.body;
  
  const start = new Date(startDate);
  const exam = new Date(examDate);
  const totalDays = Math.ceil((exam - start) / (1000 * 60 * 60 * 24));
  
  const phases = [
    { name: "Foundation", startDay: 1, endDay: Math.floor(totalDays * 0.4), focus: "Learn basics and fundamentals" },
    { name: "Practice", startDay: Math.floor(totalDays * 0.4) + 1, endDay: Math.floor(totalDays * 0.8), focus: "Solve problems and practice" },
    { name: "Revision", startDay: Math.floor(totalDays * 0.8) + 1, endDay: totalDays, focus: "Review and mock tests" }
  ];
  
  const dailyPlan = [];
  for (let i = 1; i <= Math.min(totalDays, 10); i++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i - 1);
    
    dailyPlan.push({
      dayIndex: i,
      date: currentDate.toISOString().split('T')[0],
      tasks: topics.slice(0, 2).map(t => `Study ${t.name} (${dailyHours/2} hours)`)
    });
  }
  
  const plan = {
    examName,
    startDate,
    examDate,
    totalDays,
    dailyHours,
    topics,
    phases,
    dailyPlan
  };
  
  res.json({
    message: `Study plan created for ${examName}! ${totalDays} days, ${dailyHours} hours/day.`,
    plan
  });
});

module.exports = router;
