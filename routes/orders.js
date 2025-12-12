const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay with existing keys
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  try {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    console.log('Razorpay initialized for orders');
  } catch (err) {
    console.error('Failed to initialize Razorpay for orders:', err);
  }
}

// Helper function to calculate discount (matches frontend per-item calculation)
function calculateDiscount(totalAmount, membershipPlan, items = null) {
  let discountPercentage = 0;
  if (membershipPlan === 'pro') discountPercentage = 4;
  else if (membershipPlan === 'elite') discountPercentage = 10;
  
  // If items are provided, calculate per-item discount (matches frontend)
  if (items && discountPercentage > 0) {
    let discountedTotal = 0;
    items.forEach(item => {
      const itemDiscountedPrice = item.price - (item.price * discountPercentage) / 100;
      discountedTotal += Math.round(itemDiscountedPrice) * item.quantity;
    });
    
    const discountAmount = totalAmount - discountedTotal;
    return { discountPercentage, discountAmount, finalAmount: discountedTotal };
  }
  
  // Fallback to total-based calculation
  const discountAmount = Math.round((totalAmount * discountPercentage) / 100);
  const finalAmount = totalAmount - discountAmount;
  
  return { discountPercentage, discountAmount, finalAmount };
}

// Create order
router.post('/', auth, async (req, res) => {
  try {
    const { items, shippingAddress, totalAmount, membershipPlan } = req.body;
    
    // Calculate discount based on membership (per-item calculation)
    const { discountPercentage, discountAmount, finalAmount } = calculateDiscount(
      totalAmount, 
      membershipPlan || req.user.membership?.plan || 'free',
      items
    );
    
    // Generate order number
    const orderNumber = 'ORD' + Date.now() + Math.floor(Math.random() * 1000);
    
    const order = new Order({
      user: req.user._id,
      orderNumber,
      items,
      totalAmount,
      discountApplied: discountAmount,
      discountPercentage,
      membershipPlan: membershipPlan || req.user.membership?.plan || 'free',
      finalPayableAmount: finalAmount,
      shippingAddress,
      deliveryStatus: 'Order Placed',
      paymentStatus: 'Pending'
    });
    
    await order.save();
    res.json({ message: 'Order created successfully', order });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get user orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    // Check if order belongs to user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update payment status (after Razorpay payment)
router.post('/:id/payment', auth, async (req, res) => {
  try {
    const { paymentId, paymentStatus } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    order.paymentId = paymentId;
    order.paymentStatus = paymentStatus;
    if (paymentStatus === 'completed') {
      order.status = 'processing';
    }
    order.updatedAt = Date.now();
    
    await order.save();
    res.json({ message: 'Payment updated successfully', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create Razorpay order for supplement purchase
router.post('/create', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    
    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }
    
    // Check if Razorpay is initialized
    if (!razorpay) {
      return res.status(500).json({ 
        message: 'Payment gateway not configured',
        details: 'Razorpay keys missing'
      });
    }
    
    // Create Razorpay order
    const options = {
      amount: amount, // Amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1 // Auto-capture
    };
    
    const razorpayOrder = await razorpay.orders.create(options);
    
    res.json({ 
      success: true,
      order: razorpayOrder,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (err) {
    console.error('Razorpay order creation error:', err);
    res.status(500).json({ 
      message: 'Failed to create payment order',
      error: err.message 
    });
  }
});

// Verify Razorpay payment and save order
router.post('/verify', auth, async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      orderDetails 
    } = req.body;
    
    // Verify signature
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');
    
    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }
    
    // Calculate discount based on membership (per-item calculation)
    const membershipPlan = req.user.membership?.plan || 'free';
    const { discountPercentage, discountAmount, finalAmount } = calculateDiscount(
      orderDetails.totalAmount,
      membershipPlan,
      orderDetails.items
    );
    
    // Payment verified, save order to database
    const orderNumber = 'ORD' + Date.now() + Math.floor(Math.random() * 1000);
    
    const order = new Order({
      user: req.user._id,
      orderNumber,
      items: orderDetails.items,
      totalAmount: orderDetails.totalAmount,
      discountApplied: discountAmount,
      discountPercentage,
      membershipPlan,
      finalPayableAmount: finalAmount,
      shippingAddress: orderDetails.shippingAddress,
      paymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      razorpaySignature: razorpay_signature,
      paymentStatus: 'Paid',
      deliveryStatus: 'Order Placed',
      paymentMethod: 'Razorpay Test Payment'
    });
    
    await order.save();
    
    res.json({ 
      success: true,
      message: 'Payment verified and order created',
      order 
    });
  } catch (err) {
    console.error('Payment verification error:', err);
    res.status(500).json({ 
      message: 'Payment verification failed',
      error: err.message 
    });
  }
});

// Admin: Get all orders
router.get('/admin/all', auth, async (req, res) => {
  try {
    // Check if user is admin (using role field, not isAdmin)
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const { userId, paymentStatus, deliveryStatus, search } = req.query;
    let query = {};
    
    if (userId) query.user = userId;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (deliveryStatus) query.deliveryStatus = deliveryStatus;
    if (search) query.orderNumber = { $regex: search, $options: 'i' };
    
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({ orders });
  } catch (err) {
    console.error('Admin get orders error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Update delivery status
router.patch('/admin/:id/delivery-status', auth, async (req, res) => {
  try {
    // Check if user is admin (using role field, not isAdmin)
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const { deliveryStatus } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    order.deliveryStatus = deliveryStatus;
    order.updatedAt = Date.now();
    
    await order.save();
    
    res.json({ message: 'Delivery status updated successfully', order });
  } catch (err) {
    console.error('Update delivery status error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Update estimated delivery date
router.patch('/admin/:id/estimated-delivery', auth, async (req, res) => {
  try {
    // Check if user is admin (using role field, not isAdmin)
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const { estimatedDeliveryDate } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    order.estimatedDeliveryDate = estimatedDeliveryDate;
    order.updatedAt = Date.now();
    
    await order.save();
    
    res.json({ message: 'Estimated delivery date updated successfully', order });
  } catch (err) {
    console.error('Update estimated delivery date error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
