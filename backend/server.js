const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
dotenv.config();

// Global flag to track database status
global.isMongoConnected = false;

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
    database: global.isMongoConnected ? 'MongoDB Atlas Connected' : 'MongoDB Connecting...',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    time: new Date().toISOString(),
    database: global.isMongoConnected ? 'connected' : 'connecting',
    mongodb: global.isMongoConnected ? 'Atlas' : 'Attempting connection'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 3000;

// Extra visibility for MongoDB connection lifecycle
console.log('=== FITLIFE+ BACKEND STARTING ===');
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Port:', PORT);
console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Found' : 'Missing');
if (!process.env.MONGODB_URI) {
  console.error('❌ Missing MONGODB_URI in environment variables.');
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

// PRODUCTION MONGODB CONNECTION - Railway uses NON-SRV MongoDB connection
const connectMongoDB = async () => {
  // Validate environment variable
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is required');
    process.exit(1);
  }

  try {
    console.log('🔄 Connecting to MongoDB Atlas (Railway Production)...');
    
    const mongoOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    };

    // Use STANDARD MongoDB URI from environment (NO SRV for Railway)
    // Railway production uses explicit host:port format to avoid DNS issues
    const mongoUri = process.env.MONGODB_URI;
    
    console.log('📡 Connecting with standard MongoDB URI...');
    console.log('🎯 Using explicit hosts (no SRV DNS lookup)');
    
    // Single connection attempt - fail fast in production
    await mongoose.connect(mongoUri, mongoOptions);
    
    console.log('✅ MongoDB Atlas connected successfully!');
    console.log('🎯 Real database connection established');
    global.isMongoConnected = true;
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('🚨 CRITICAL: Database connection required for production');
    
    // FAIL FAST - Exit immediately if database connection fails
    console.log('💥 Exiting process - Railway will restart with fresh network');
    process.exit(1);
  }
};

// Start server ONLY after successful database connection
const startServer = async () => {
  try {
    // Connect to MongoDB first - REQUIRED for production
    await connectMongoDB();
    
    // Start server only after successful DB connection
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Server accessible at: http://0.0.0.0:${PORT}`);
      console.log('✅ Production backend ready with MongoDB Atlas');
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Initialize server with database-first approach
startServer();