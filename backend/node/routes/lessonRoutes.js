const express = require('express');
const { markLessonCompleted, getAllCompletedLessons } = require('../controllers/lessonController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/complete', authMiddleware, markLessonCompleted);
router.get('/completed', authMiddleware, getAllCompletedLessons);

module.exports = router;
