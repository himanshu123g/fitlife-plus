const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const fs = require('fs');
const path = require('path');

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    // req.user is set by auth middleware
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get dashboard stats
router.get('/stats', auth, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    
    const orders = await Order.find();
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      pendingOrders,
      totalRevenue
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-passwordHash').sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user with cascading delete of all related data
router.delete('/users/:id', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent deleting admin users
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin users' });
    }
    
    // Import models for cascading delete
    const PasswordResetRequest = require('../models/PasswordResetRequest');
    const Review = require('../models/Review');
    const Session = require('../models/Session');
    
    // Delete all related data
    const deletionResults = {
      orders: 0,
      passwordResets: 0,
      reviews: 0,
      sessions: 0
    };
    
    // Delete all orders by this user
    const ordersDeleted = await Order.deleteMany({ user: req.params.id });
    deletionResults.orders = ordersDeleted.deletedCount || 0;
    
    // Delete all password reset requests by this user
    const passwordResetsDeleted = await PasswordResetRequest.deleteMany({ user: req.params.id });
    deletionResults.passwordResets = passwordResetsDeleted.deletedCount || 0;
    
    // Delete all reviews by this user
    const reviewsDeleted = await Review.deleteMany({ userId: req.params.id });
    deletionResults.reviews = reviewsDeleted.deletedCount || 0;
    
    // Delete all video call sessions by this user
    const sessionsDeleted = await Session.deleteMany({ user: req.params.id });
    deletionResults.sessions = sessionsDeleted.deletedCount || 0;
    
    // Finally, delete the user
    await User.findByIdAndDelete(req.params.id);
    
    console.log(`User ${user.name} (${user.email}) deleted with cascading:`, deletionResults);
    
    res.json({ 
      message: 'User and all related data deleted successfully',
      deletedData: deletionResults
    });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all products
router.get('/products', auth, isAdmin, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add product
router.post('/products', auth, isAdmin, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json({ message: 'Product added successfully', product });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product
router.put('/products/:id', auth, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Product updated successfully', product });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product
router.delete('/products/:id', auth, isAdmin, async (req, res) => {
  try {
    // First, get the product to find its image path
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete the product from database
    await Product.findByIdAndDelete(req.params.id);

    // Delete the associated image file if it exists
    if (product.imageUrl && product.imageUrl.startsWith('/uploads/')) {
      try {
        const imagePath = path.join(__dirname, '../../frontend/public', product.imageUrl);
        
        // Check if file exists before attempting to delete
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log(`Deleted image file: ${imagePath}`);
        }
      } catch (imgErr) {
        console.error('Error deleting image file:', imgErr);
        // Don't fail the whole operation if image deletion fails
      }
    }

    res.json({ message: 'Product and associated image deleted successfully' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all orders
router.get('/orders', auth, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status
router.put('/orders/:id', auth, isAdmin, async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, paymentStatus, updatedAt: Date.now() },
      { new: true }
    );
    res.json({ message: 'Order updated successfully', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete order
router.delete('/orders/:id', auth, isAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error('Delete order error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status only
router.put('/orders/:id/status', auth, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );
    res.json({ message: 'Order status updated successfully', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve product
router.put('/products/:id/approve', auth, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    res.json({ message: 'Product approved successfully', product });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Reject product
router.put('/products/:id/reject', auth, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { approved: false },
      { new: true }
    );
    res.json({ message: 'Product rejected successfully', product });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get membership stats
router.get('/membership-stats', auth, isAdmin, async (req, res) => {
  try {
    const freeUsers = await User.countDocuments({ role: 'user', 'membership.plan': 'free' });
    const proUsers = await User.countDocuments({ role: 'user', 'membership.plan': 'pro' });
    const eliteUsers = await User.countDocuments({ role: 'user', 'membership.plan': 'elite' });
    
    const users = await User.find({ role: 'user' })
      .select('name email membership createdAt')
      .sort({ createdAt: -1 });
    
    res.json({
      stats: { freeUsers, proUsers, eliteUsers },
      users
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get analytics data for charts
router.get('/analytics', auth, isAdmin, async (req, res) => {
  try {
    // Get membership distribution
    const freeUsers = await User.countDocuments({ role: 'user', 'membership.plan': 'free' });
    const proUsers = await User.countDocuments({ role: 'user', 'membership.plan': 'pro' });
    const eliteUsers = await User.countDocuments({ role: 'user', 'membership.plan': 'elite' });
    
    // Get user signups over last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const users = await User.find({ 
      role: 'user',
      createdAt: { $gte: thirtyDaysAgo }
    }).select('createdAt').sort({ createdAt: 1 });
    
    // Group users by date
    const signupsByDate = {};
    users.forEach(user => {
      const date = new Date(user.createdAt).toISOString().split('T')[0];
      signupsByDate[date] = (signupsByDate[date] || 0) + 1;
    });
    
    // Get order statistics
    const orders = await Order.find();
    const ordersByStatus = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    };
    
    let totalRevenue = 0;
    orders.forEach(order => {
      // Map deliveryStatus to chart status
      let chartStatus = 'pending';
      switch(order.deliveryStatus) {
        case 'Order Placed':
          chartStatus = 'pending';
          break;
        case 'Shipped':
          chartStatus = 'shipped';
          break;
        case 'Out for Delivery':
          chartStatus = 'processing';
          break;
        case 'Delivered':
          chartStatus = 'delivered';
          break;
        case 'Cancelled':
          chartStatus = 'cancelled';
          break;
        default:
          chartStatus = 'pending';
      }
      
      ordersByStatus[chartStatus] = (ordersByStatus[chartStatus] || 0) + 1;
      totalRevenue += order.totalAmount || 0;
    });
    
    // Get revenue by membership tier
    const revenueByTier = {
      free: 0,
      pro: 0,
      elite: 0
    };
    
    for (const order of orders) {
      if (order.user) {
        const user = await User.findById(order.user);
        if (user && user.membership) {
          const tier = user.membership.plan || 'free';
          revenueByTier[tier] = (revenueByTier[tier] || 0) + (order.totalAmount || 0);
        }
      }
    }
    
    res.json({
      membershipDistribution: {
        free: freeUsers,
        pro: proUsers,
        elite: eliteUsers
      },
      signupsByDate,
      ordersByStatus,
      revenueByTier,
      totalRevenue
    });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload product image
router.post('/upload-image', auth, isAdmin, async (req, res) => {
  try {
    const { imageData, filename } = req.body;
    
    if (!imageData || !filename) {
      return res.status(400).json({ message: 'Image data and filename required' });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, '../../frontend/public/uploads/supplements');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Remove data:image/...;base64, prefix
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Save file
    const filepath = path.join(uploadsDir, filename);
    fs.writeFileSync(filepath, buffer);

    const imageUrl = `/uploads/supplements/${filename}`;
    res.json({ message: 'Image uploaded successfully', imageUrl });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Error uploading image' });
  }
});

module.exports = router;
