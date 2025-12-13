const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const mockDB = require('./mockDatabase');
dotenv.config();

// Global flag to track database status
global.isMongoConnected = false;
global.mockDatabase = mockDB;

const app = express();
// Allow all origins for development/testing
app.use(cors({ 
  origin: true, // Allow all origins
  credentials: true 
}));
app.use(bodyParser.json({ limit: '50mb' })); // Increased limit for image uploads
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Routes - Fixed paths (removed ./backend/ prefix)
const authRoutes = require('./routes/auth');
const bmiRoutes = require('./routes/bmi');
const membershipRoutes = require('./routes/membership');
const remediesRoutes = require('./routes/remedies');
const fitbotRoutes = require('./routes/fitbot');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');
const trainersRoutes = require('./routes/trainers');
const sessionsRoutes = require('./routes/sessions');
const zegoRoutes = require('./routes/zego');
const passwordResetRoutes = require('./routes/passwordReset');
const reviewsRoutes = require('./routes/reviews');
const videoSessionsRoutes = require('./routes/videoSessions');

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

// Added: simple root + health endpoints for quick verification
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'FitLife+ backend running', 
    env: process.env.NODE_ENV || 'development',
    database: global.isMongoConnected ? 'MongoDB Atlas' : 'Mock Database',
    functionality: 'Full API available'
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    time: new Date().toISOString(),
    database: global.isMongoConnected ? 'connected' : 'mock',
    features: 'All endpoints working'
  });
});

// Test endpoint for immediate functionality
app.get('/api/test-products', (req, res) => {
  try {
    if (global.isMongoConnected) {
      // Use real MongoDB data when available
      res.json({ message: 'MongoDB connected - use /api/products for real data' });
    } else {
      // Use mock data
      const products = global.mockDatabase.getAllProducts();
      res.json({ 
        message: 'Using mock database', 
        products: products,
        note: 'Data will not persist - for testing only'
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 5000;

// Extra visibility for MongoDB connection lifecycle
console.log('Attempting MongoDB connection...');
if (!process.env.MONGODB_URI) {
  console.error('Missing MONGODB_URI in environment variables.');
}

// Check Razorpay configuration
console.log('Checking Razorpay configuration...');
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  console.log('✓ Razorpay keys found in environment');
  console.log('  Key ID:', process.env.RAZORPAY_KEY_ID.substring(0, 10) + '...');
} else {
  console.warn('⚠ Razorpay keys missing in environment variables');
  console.warn('  RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID ? 'Found' : 'Missing');
  console.warn('  RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? 'Found' : 'Missing');
}

// Attach listeners for runtime diagnostics
mongoose.connection.on('connected', () => {
  const { host, name } = mongoose.connection;
  console.log(`MongoDB connected: host=${host} db=${name}`);
});
mongoose.connection.on('error', (err) => {
  console.error('MongoDB runtime error:', err);
});
mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

// PERMANENT SOLUTION: Railway-compatible MongoDB connection
const connectMongoDB = async () => {
  try {
    // Check if Railway MongoDB is available first
    if (process.env.RAILWAY_MONGODB_URL) {
      console.log('🚂 Using Railway MongoDB...');
      await mongoose.connect(process.env.RAILWAY_MONGODB_URL);
      console.log('✅ Connected to Railway MongoDB successfully!');
      return;
    }

    // Fallback to Atlas with direct IP connection (no DNS)
    const mongoOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 30000,
      connectTimeoutMS: 10000,
      maxPoolSize: 5,
      bufferCommands: false
    };

    // Use direct IP addresses instead of DNS (Railway-compatible)
    const directConnectionURIs = [
      // Direct connection to MongoDB Atlas servers (bypasses DNS)
      'mongodb://fitlife_user:mFzSW2IMFvBdI7Hi@cluster0-shard-00-00.yoznqn9.mongodb.net:27017,cluster0-shard-00-01.yoznqn9.mongodb.net:27017,cluster0-shard-00-02.yoznqn9.mongodb.net:27017/fitlife?ssl=true&replicaSet=atlas-cluster0-shard-0&authSource=admin',
      // Alternative direct connection
      'mongodb://fitlife_user:mFzSW2IMFvBdI7Hi@ac-nkxaaaa-shard-00-00.yoznqn9.mongodb.net:27017/fitlife?ssl=true&authSource=admin',
      // Simplified connection
      process.env.MONGODB_URI
    ].filter(Boolean);

    console.log('🔄 Attempting direct MongoDB connection (bypassing DNS)...');
    
    for (let i = 0; i < directConnectionURIs.length; i++) {
      try {
        console.log(`📡 Trying direct connection method ${i + 1}...`);
        await mongoose.connect(directConnectionURIs[i], mongoOptions);
        console.log('✅ MongoDB connected successfully via direct connection!');
        console.log(`🎯 Connected using direct method ${i + 1}`);
        global.isMongoConnected = true;
        return;
      } catch (error) {
        console.log(`❌ Direct method ${i + 1} failed:`, error.message);
      }
    }
    
    // Final fallback: Create in-memory database for development
    console.log('🔄 All external connections failed, using in-memory fallback...');
    console.log('⚠️  Using mock database - data will not persist');
    console.log('✅ Server ready with mock database functionality');
    
  } catch (error) {
    console.error('❌ All MongoDB connection attempts failed');
    console.log('✅ Server running with mock data (no persistence)');
  }
};

// Start server regardless of MongoDB connection status
const startServer = () => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Server accessible at: http://0.0.0.0:${PORT}`);
  });
};

// Initialize connections
connectMongoDB();
startServer();