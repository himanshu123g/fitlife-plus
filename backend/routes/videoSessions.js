const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// In-memory storage (replace with database in production)
const sessions = [];
const feedbacks = [];

// Save session data
router.post('/save', auth, async (req, res) => {
  try {
    const { roomId, duration, notes, trainerName } = req.body;
    
    const session = {
      userId: req.user.id,
      roomId,
      duration,
      notes,
      trainerName,
      date: new Date(),
      createdAt: new Date()
    };
    
    sessions.push(session);
    
    res.json({ success: true, session });
  } catch (err) {
    console.error('Error saving session:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Save feedback
router.post('/feedback', auth, async (req, res) => {
  try {
    const { roomId, rating, feedback, trainerName } = req.body;
    
    const feedbackData = {
      userId: req.user.id,
      roomId,
      rating,
      feedback,
      trainerName,
      date: new Date(),
      createdAt: new Date()
    };
    
    feedbacks.push(feedbackData);
    
    res.json({ success: true, feedback: feedbackData });
  } catch (err) {
    console.error('Error saving feedback:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's session history
router.get('/history', auth, async (req, res) => {
  try {
    const userSessions = sessions.filter(s => s.userId === req.user.id);
    res.json({ sessions: userSessions });
  } catch (err) {
    console.error('Error fetching history:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all feedbacks (admin only)
router.get('/feedbacks', auth, async (req, res) => {
  try {
    // Add admin check here
    res.json({ feedbacks });
  } catch (err) {
    console.error('Error fetching feedbacks:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
