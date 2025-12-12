const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Session = require('../models/Session');
const Trainer = require('../models/Trainer');
const jwt = require('jsonwebtoken');

// Middleware to check if user is trainer
const isTrainer = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Auth token missing' });
    
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.type !== 'trainer') {
      return res.status(403).json({ message: 'Access denied. Trainer only.' });
    }
    
    const trainer = await Trainer.findById(payload.id);
    if (!trainer) return res.status(401).json({ message: 'Trainer not found' });
    
    req.trainer = trainer;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// USER ROUTES (Elite only)

// Get all active trainers
router.get('/trainers', auth, async (req, res) => {
  try {
    // Check if user is Elite
    if (req.user.membership?.plan !== 'elite') {
      return res.status(403).json({ message: 'Elite membership required' });
    }
    
    const trainers = await Trainer.find({ isActive: true })
      .select('-passwordHash')
      .sort({ name: 1 });
    res.json({ trainers });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Request a session
router.post('/request', auth, async (req, res) => {
  try {
    // Check if user is Elite
    if (req.user.membership?.plan !== 'elite') {
      return res.status(403).json({ message: 'Elite membership required' });
    }
    
    const { trainerId, scheduledDate, scheduledTime, userMessage } = req.body;
    
    // Validate trainer exists
    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }
    
    // Check if slot is already booked
    const existingSession = await Session.findOne({
      trainer: trainerId,
      scheduledDate: new Date(scheduledDate),
      scheduledTime,
      status: { $in: ['pending', 'approved'] }
    });
    
    if (existingSession) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }
    
    const session = new Session({
      user: req.user._id,
      trainer: trainerId,
      scheduledDate: new Date(scheduledDate),
      scheduledTime,
      userMessage: userMessage || '',
      status: 'pending'
    });
    
    await session.save();
    
    const populatedSession = await Session.findById(session._id)
      .populate('trainer', 'name email specialization profilePhoto');
    
    res.json({ message: 'Session request sent successfully', session: populatedSession });
  } catch (err) {
    console.error('Request session error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's sessions
router.get('/my-sessions', auth, async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user._id })
      .populate('trainer', 'name email specialization profilePhoto')
      .sort({ scheduledDate: -1, scheduledTime: -1 });
    res.json({ sessions });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel session (User)
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    if (session.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel completed session' });
    }
    
    session.status = 'cancelled';
    session.updatedAt = Date.now();
    await session.save();
    
    res.json({ message: 'Session cancelled', session });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// TRAINER ROUTES

// Get trainer's availability
router.get('/trainer/availability', isTrainer, async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.trainer._id);
    res.json({ availability: trainer.availability || [] });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update trainer's availability
router.put('/trainer/availability', isTrainer, async (req, res) => {
  try {
    const { availability } = req.body;
    
    const trainer = await Trainer.findById(req.trainer._id);
    trainer.availability = availability;
    trainer.updatedAt = Date.now();
    await trainer.save();
    
    res.json({ message: 'Availability updated', availability: trainer.availability });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get trainer's session requests
router.get('/trainer/requests', isTrainer, async (req, res) => {
  try {
    const sessions = await Session.find({ 
      trainer: req.trainer._id,
      status: 'pending'
    })
      .populate('user', 'name email membership')
      .sort({ createdAt: -1 });
    res.json({ sessions });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get trainer's upcoming sessions
router.get('/trainer/upcoming', isTrainer, async (req, res) => {
  try {
    // Get sessions that are approved and not completed/cancelled
    const sessions = await Session.find({ 
      trainer: req.trainer._id,
      status: 'approved'
    })
      .populate('user', 'name email membership')
      .sort({ scheduledDate: 1, scheduledTime: 1 });
    res.json({ sessions });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get trainer's session history
router.get('/trainer/history', isTrainer, async (req, res) => {
  try {
    const sessions = await Session.find({ 
      trainer: req.trainer._id,
      status: { $in: ['completed', 'rejected', 'cancelled'] }
    })
      .populate('user', 'name email membership')
      .sort({ scheduledDate: -1 });
    res.json({ sessions });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept session request
router.put('/trainer/:id/accept', isTrainer, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    if (session.trainer.toString() !== req.trainer._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Generate room ID
    session.roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    session.status = 'approved';
    session.updatedAt = Date.now();
    await session.save();
    
    const populatedSession = await Session.findById(session._id)
      .populate('user', 'name email membership');
    
    res.json({ message: 'Session approved', session: populatedSession });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Reject session request
router.put('/trainer/:id/reject', isTrainer, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    if (session.trainer.toString() !== req.trainer._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    session.status = 'rejected';
    session.updatedAt = Date.now();
    await session.save();
    
    res.json({ message: 'Session rejected', session });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark session as completed
router.put('/trainer/:id/complete', isTrainer, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    if (session.trainer.toString() !== req.trainer._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    session.status = 'completed';
    session.updatedAt = Date.now();
    await session.save();
    
    res.json({ message: 'Session marked as completed', session });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
