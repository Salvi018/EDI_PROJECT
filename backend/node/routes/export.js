const express = require('express');
const router = express.Router();

// GET /api/report/me/export
router.get('/me/export', (req, res) => {
  const { format } = req.query;
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  if (format === 'csv') {
    const csvData = `Date,Problem,Topic,Difficulty,Status,Time,Attempts
2025-01-15,Two Sum,Arrays,Easy,Solved,12m,2
2025-01-14,Binary Tree,Trees,Medium,Failed,45m,3
2025-01-13,Valid Parentheses,Strings,Easy,Solved,8m,1`;
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="codecade-report.csv"');
    res.send(csvData);
  } else {
    res.status(400).json({ error: 'Unsupported format. Use format=csv' });
  }
});

module.exports = router;