const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');

// Initialize Razorpay only if keys are available
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  try {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    console.log('Razorpay initialized successfully');
  } catch (err) {
    console.error('Failed to initialize Razorpay:', err);
  }
} else {
  console.warn('Razorpay keys not found in environment variables');
}

const PLANS = {
  pro: { price: 19900, label: 'Pro' }, // in paise
  elite: { price: 49900, label: 'Elite' }
};

// Create order
router.post('/create-order', auth, async (req, res) => {
  try {
    const { plan } = req.body;
    
    // Validate plan
    if (!plan || !PLANS[plan]) {
      console.error('Invalid plan requested:', plan);
      return res.status(400).json({ message: 'Invalid plan. Please select Pro or Elite.' });
    }
    
    // Check if Razorpay is initialized
    if (!razorpay) {
      console.error('Razorpay not initialized. Keys missing:', {
        hasKeyId: !!process.env.RAZORPAY_KEY_ID,
        hasKeySecret: !!process.env.RAZORPAY_KEY_SECRET
      });
      return res.status(500).json({ 
        message: 'Payment gateway configuration error. Please contact support.',
        details: 'Razorpay keys are missing or invalid'
      });
    }
    
    // Validate user
    if (!req.user || !req.user._id) {
      console.error('User not found in request');
      return res.status(401).json({ message: 'User authentication failed' });
    }
    
    // Generate receipt ID (max 40 chars for Razorpay)
    // Format: rec_<shortUserId>_<timestamp>
    const shortUserId = req.user._id.toString().substring(18); // Last 6 chars of ObjectId
    const timestamp = Date.now().toString().slice(-8); // Last 8 digits of timestamp
    const receipt = `rec_${shortUserId}_${timestamp}`; // Total: 3 + 6 + 1 + 8 = 18 chars (well under 40)
    
    const options = {
      amount: PLANS[plan].price,
      currency: 'INR',
      receipt: receipt,
      notes: { plan, userId: req.user._id.toString() }
    };
    
    console.log('Creating Razorpay order for plan:', plan, 'Amount:', PLANS[plan].price);
    
    const order = await razorpay.orders.create(options);
    
    console.log('Razorpay order created successfully:', order.id);
    
    res.json({ 
      order, 
      key: process.env.RAZORPAY_KEY_ID 
    });
  } catch (err) {
    console.error('Razorpay order creation error:', {
      message: err.message,
      error: err.error,
      statusCode: err.statusCode,
      description: err.error?.description,
      field: err.error?.field,
      source: err.error?.source,
      step: err.error?.step,
      reason: err.error?.reason,
      metadata: err.error?.metadata
    });
    
    // Provide more detailed error message
    let errorMessage = 'Failed to create payment order';
    if (err.error?.description) {
      errorMessage = err.error.description;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    res.status(500).json({ 
      message: 'Payment gateway error: ' + errorMessage,
      details: err.error?.field ? `Field: ${err.error.field}` : undefined
    });
  }
});

// Verify payment and update membership
router.post('/verify', auth, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, notes } = req.body;
  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex');
  if (generated_signature !== razorpay_signature) return res.status(400).json({ message: 'Invalid signature' });
  try {
    const plan = notes?.plan || 'pro';
    const now = new Date();
    const validTill = new Date(now);
    validTill.setDate(validTill.getDate() + 30); // 30 days validity for all plans
    req.user.membership = { plan, since: now, validTill };
    await req.user.save();
    res.json({ message: 'Payment verified and membership updated', membership: req.user.membership });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Direct upgrade without payment (for testing or admin purposes)
router.post('/admin/upgrade', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { userId, plan } = req.body;
    
    // Validate plan
    if (!plan || !['pro', 'elite'].includes(plan)) {
      return res.status(400).json({ message: 'Invalid plan. Please select Pro or Elite.' });
    }
    
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const now = new Date();
    const validTill = new Date(now);
    validTill.setDate(validTill.getDate() + 30); // 30 days validity
    
    targetUser.membership = {
      plan,
      since: now,
      validTill
    };
    
    await targetUser.save();
    
    console.log(`Admin ${req.user.email} upgraded user ${targetUser.email} to ${plan} plan`);
    
    res.json({ 
      success: true,
      message: `Successfully upgraded user to ${plan.toUpperCase()} plan`,
      membership: targetUser.membership 
    });
  } catch (err) {
    console.error('Admin upgrade membership error:', err);
    res.status(500).json({ message: 'Failed to upgrade membership' });
  }
});

// Downgrade membership to free
router.post('/downgrade', auth, async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User authentication failed' });
    }
    
    req.user.membership = {
      plan: 'free',
      since: new Date(),
      validTill: null
    };
    
    await req.user.save();
    
    console.log(`User ${req.user.email} downgraded to free plan`);
    
    res.json({ 
      success: true,
      message: 'Successfully downgraded to Free plan',
      membership: req.user.membership 
    });
  } catch (err) {
    console.error('Downgrade membership error:', err);
    res.status(500).json({ message: 'Failed to downgrade membership' });
  }
});

// Admin: Renew user membership (extend by 30 days)
router.post('/admin/renew/:userId', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Extend membership by 30 days from current validTill or now
    const baseDate = user.membership?.validTill && new Date(user.membership.validTill) > new Date() 
      ? new Date(user.membership.validTill) 
      : new Date();
    
    const newValidTill = new Date(baseDate);
    newValidTill.setDate(newValidTill.getDate() + 30);
    
    user.membership = {
      ...user.membership,
      plan: user.membership?.plan || 'pro',
      since: user.membership?.since || new Date(),
      validTill: newValidTill
    };
    
    await user.save();
    
    res.json({ 
      message: 'Membership renewed successfully', 
      membership: user.membership 
    });
  } catch (err) {
    console.error('Renew membership error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
