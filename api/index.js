const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({ 
  origin: true,
  credentials: true 
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Simple health check first
app.get('/api', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'FitLife+ API running on Vercel',
    timestamp: new Date().toISOString()
  });
});

// Connect to MongoDB only if URI is provided
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).catch(err => console.error('MongoDB connection error:', err));
}

// Routes (load only after basic setup works)
try {
  const authRoutes = require('../backend/routes/auth');
  const bmiRoutes = require('../backend/routes/bmi');
  const membershipRoutes = require('../backend/routes/membership');
  const remediesRoutes = require('../backend/routes/remedies');
  const fitbotRoutes = require('../backend/routes/fitbot');
  const userRoutes = require('../backend/routes/user');
  const adminRoutes = require('../backend/routes/admin');
  const productsRoutes = require('../backend/routes/products');
  const ordersRoutes = require('../backend/routes/orders');
  const trainersRoutes = require('../backend/routes/trainers');
  const sessionsRoutes = require('../backend/routes/sessions');
  const zegoRoutes = require('../backend/routes/zego');
  const passwordResetRoutes = require('../backend/routes/passwordReset');
  const reviewsRoutes = require('../backend/routes/reviews');
  const videoSessionsRoutes = require('../backend/routes/videoSessions');

  app.use('/api/auth', authRoutes);
  app.use('/api/bmi', bmiRoutes);
  app.use('/api/membership', membershipRoutes);
  app.use('/api/remedies', remediesRoutes);
  app.use('/api/fitbot', fitbotRoutes);
  app.use('/api/user', userRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/products', productsRoutes);
  app.use('/api/orders', ordersRoutes);
  app.use('/api/trainers', trainersRoutes);
  app.use('/api/sessions', sessionsRoutes);
  app.use('/api/zego', zegoRoutes);
  app.use('/api/password-reset', passwordResetRoutes);
  app.use('/api/reviews', reviewsRoutes);
  app.use('/api/video-sessions', videoSessionsRoutes);
} catch (error) {
  console.error('Error loading routes:', error);
}

module.exports = app;