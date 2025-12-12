const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const Trainer = require('../models/Trainer');
const Session = require('../models/Session');

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ADMIN ROUTES

// Get all trainers (Admin only)
router.get('/admin/all', auth, isAdmin, async (req, res) => {
  try {
    const trainers = await Trainer.find().select('-passwordHash').sort({ createdAt: -1 });
    // Include plainPassword for admin viewing
    res.json({ trainers });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new trainer (Admin only)
router.post('/admin/add', auth, isAdmin, async (req, res) => {
  try {
    const { name, email, password, specialization, profilePhoto } = req.body;
    
    // Check if trainer already exists
    const existing = await Trainer.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Trainer with this email already exists' });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    const trainer = new Trainer({
      name,
      email,
      passwordHash,
      plainPassword: password, // Store plain password for admin viewing
      specialization,
      profilePhoto: profilePhoto || ''
    });
    
    await trainer.save();
    
    // Return trainer without passwordHash but with plainPassword
    const trainerData = trainer.toObject();
    delete trainerData.passwordHash;
    
    res.json({ message: 'Trainer added successfully', trainer: trainerData });
  } catch (err) {
    console.error('Add trainer error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update trainer (Admin only)
router.put('/admin/:id', auth, isAdmin, async (req, res) => {
  try {
    const { name, email, specialization, profilePhoto, isActive, password } = req.body;
    
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }
    
    // Update fields
    if (name) trainer.name = name;
    if (email) trainer.email = email;
    if (specialization) trainer.specialization = specialization;
    if (profilePhoto !== undefined) trainer.profilePhoto = profilePhoto;
    if (isActive !== undefined) trainer.isActive = isActive;
    
    // Update password if provided
    if (password) {
      trainer.passwordHash = await bcrypt.hash(password, 10);
      trainer.plainPassword = password; // Store plain password for admin viewing
    }
    
    trainer.updatedAt = Date.now();
    await trainer.save();
    
    // Return trainer without passwordHash but with plainPassword
    const trainerData = trainer.toObject();
    delete trainerData.passwordHash;
    
    res.json({ message: 'Trainer updated successfully', trainer: trainerData });
  } catch (err) {
    console.error('Update trainer error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete trainer (Admin only)
router.delete('/admin/:id', auth, isAdmin, async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndDelete(req.params.id);
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }
    
    res.json({ message: 'Trainer deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all sessions (Admin only)
router.get('/admin/sessions', auth, isAdmin, async (req, res) => {
  try {
    const sessions = await Session.find()
      .populate('user', 'name email')
      .populate('trainer', 'name email specialization')
      .sort({ createdAt: -1 });
    res.json({ sessions });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update session status (Admin only)
router.put('/admin/sessions/:id', auth, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    session.status = status;
    session.updatedAt = Date.now();
    
    // Generate room ID if approved
    if (status === 'approved' && !session.roomId) {
      session.roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    await session.save();
    
    res.json({ message: 'Session status updated', session });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete session (Admin only)
router.delete('/admin/sessions/:id', auth, isAdmin, async (req, res) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    res.json({ message: 'Session deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// TRAINER AUTH ROUTES

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

// TRAINER PASSWORD CHANGE REQUEST

// Request password change (Trainer)
router.post('/password-change-request', isTrainer, async (req, res) => {
  try {
    const { newPassword } = req.body;
    
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    
    const trainer = await Trainer.findById(req.trainer._id);
    
    // Hash the new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    
    trainer.passwordChangeRequest = {
      requested: true,
      requestedAt: new Date(),
      newPasswordHash,
      approved: false
    };
    trainer.updatedAt = Date.now();
    
    await trainer.save();
    
    res.json({ message: 'Password change request submitted. Waiting for admin approval.' });
  } catch (err) {
    console.error('Password change request error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get password change requests (Admin)
router.get('/admin/password-requests', auth, isAdmin, async (req, res) => {
  try {
    const trainers = await Trainer.find({
      'passwordChangeRequest.requested': true,
      'passwordChangeRequest.approved': false
    }).select('-passwordHash -passwordChangeRequest.newPasswordHash');
    
    res.json({ requests: trainers });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve password change (Admin)
router.put('/admin/approve-password/:id', auth, isAdmin, async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }
    
    if (!trainer.passwordChangeRequest.requested) {
      return res.status(400).json({ message: 'No password change request found' });
    }
    
    // Apply the new password
    trainer.passwordHash = trainer.passwordChangeRequest.newPasswordHash;
    trainer.passwordChangeRequest = {
      requested: false,
      approved: true
    };
    trainer.updatedAt = Date.now();
    
    await trainer.save();
    
    res.json({ message: 'Password change approved', trainer: { name: trainer.name, email: trainer.email } });
  } catch (err) {
    console.error('Approve password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reject password change (Admin)
router.put('/admin/reject-password/:id', auth, isAdmin, async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }
    
    trainer.passwordChangeRequest = {
      requested: false,
      approved: false
    };
    trainer.updatedAt = Date.now();
    
    await trainer.save();
    
    res.json({ message: 'Password change request rejected' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin directly resets trainer password
router.put('/admin/reset-password/:id', auth, isAdmin, async (req, res) => {
  try {
    const { newPassword } = req.body;
    
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }
    
    trainer.passwordHash = await bcrypt.hash(newPassword, 10);
    trainer.plainPassword = newPassword; // Store plain password for admin viewing
    trainer.passwordChangeRequest = {
      requested: false,
      approved: false
    };
    trainer.updatedAt = Date.now();
    
    await trainer.save();
    
    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// TRAINER AUTH ROUTES

// Trainer login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const trainer = await Trainer.findOne({ email });
    if (!trainer) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    if (!trainer.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }
    
    const isMatch = await bcrypt.compare(password, trainer.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: trainer._id, type: 'trainer' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Return trainer data without password
    const trainerData = trainer.toObject();
    delete trainerData.passwordHash;
    
    res.json({ token, trainer: trainerData });
  } catch (err) {
    console.error('Trainer login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
