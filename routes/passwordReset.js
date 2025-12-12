const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const User = require('../models/User');
const PasswordResetRequest = require('../models/PasswordResetRequest');

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

// USER ROUTES

// Submit password reset request
router.post('/request', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' });
    }
    
    // Check if there's already a pending request
    const existingRequest = await PasswordResetRequest.findOne({
      user: user._id,
      status: 'pending'
    });
    
    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending password reset request' });
    }
    
    // Create new reset request
    const resetRequest = new PasswordResetRequest({
      user: user._id,
      status: 'pending'
    });
    
    await resetRequest.save();
    
    res.json({ message: 'Password reset request submitted successfully. Please wait for admin approval.' });
  } catch (err) {
    console.error('Password reset request error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Check reset request status
router.get('/check-status/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const request = await PasswordResetRequest.findOne({
      user: user._id
    }).sort({ requestedAt: -1 });
    
    if (!request) {
      return res.json({ status: 'none' });
    }
    
    res.json({ 
      status: request.status,
      requestId: request._id
    });
  } catch (err) {
    console.error('Check status error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset password (after admin approval)
router.post('/reset', async (req, res) => {
  try {
    const { email, newPassword, requestId } = req.body;
    
    if (!email || !newPassword || !requestId) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Find and verify reset request
    const request = await PasswordResetRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Reset request not found' });
    }
    
    if (request.status !== 'approved') {
      return res.status(403).json({ message: 'Reset request not approved yet' });
    }
    
    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);
    
    // Update user password
    user.passwordHash = passwordHash;
    user.plainPassword = newPassword; // Store plain password for admin viewing
    await user.save();
    
    // Mark request as completed
    request.status = 'completed';
    request.completedAt = Date.now();
    await request.save();
    
    res.json({ message: 'Password reset successfully. You can now login with your new password.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN ROUTES

// Get all password reset requests
router.get('/admin/requests', auth, isAdmin, async (req, res) => {
  try {
    const requests = await PasswordResetRequest.find()
      .populate('user', 'name email')
      .sort({ requestedAt: -1 });
    
    res.json({ requests });
  } catch (err) {
    console.error('Get requests error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve password reset request
router.put('/admin/approve/:id', auth, isAdmin, async (req, res) => {
  try {
    const request = await PasswordResetRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    request.status = 'approved';
    request.approvedAt = Date.now();
    await request.save();
    
    const populatedRequest = await PasswordResetRequest.findById(request._id)
      .populate('user', 'name email');
    
    res.json({ message: 'Request approved', request: populatedRequest });
  } catch (err) {
    console.error('Approve request error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reject password reset request
router.put('/admin/reject/:id', auth, isAdmin, async (req, res) => {
  try {
    const request = await PasswordResetRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    request.status = 'rejected';
    await request.save();
    
    const populatedRequest = await PasswordResetRequest.findById(request._id)
      .populate('user', 'name email');
    
    res.json({ message: 'Request rejected', request: populatedRequest });
  } catch (err) {
    console.error('Reject request error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete password reset request
router.delete('/admin/delete/:id', auth, isAdmin, async (req, res) => {
  try {
    console.log('Delete request received for ID:', req.params.id);
    
    const request = await PasswordResetRequest.findById(req.params.id);
    if (!request) {
      console.log('Request not found:', req.params.id);
      return res.status(404).json({ message: 'Password reset request not found' });
    }
    
    await PasswordResetRequest.findByIdAndDelete(req.params.id);
    console.log('Password reset request deleted successfully:', req.params.id);
    
    res.json({ message: 'Password reset request deleted successfully' });
  } catch (err) {
    console.error('Delete request error:', err);
    console.error('Error details:', err.message);
    res.status(500).json({ message: `Server error: ${err.message}` });
  }
});

module.exports = router;
