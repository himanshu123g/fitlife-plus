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

// PRODUCTION MONGODB CONNECTION - Railway-optimized with multiple connection strategies
const connectMongoDB = async () => {
  // Validate environment variable
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is required');
    process.exit(1);
  }

  const connectionStrategies = [
    // Strategy 1: Environment variable (user-provided)
    {
      name: 'Environment URI',
      uri: process.env.MONGODB_URI,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 15000,
        maxPoolSize: 10,
        retryWrites: true,
        w: 'majority',
        family: 4 // Force IPv4
      }
    },
    // Strategy 2: Direct connection with explicit hosts (Railway-optimized)
    {
      name: 'Direct Railway Connection',
      uri: 'mongodb://fitlife_user:mFzSW2IMFvBdI7Hi@ac-ixqvhqj-shard-00-00.yoznqn9.mongodb.net:27017,ac-ixqvhqj-shard-00-01.yoznqn9.mongodb.net:27017,ac-ixqvhqj-shard-00-02.yoznqn9.mongodb.net:27017/fitlife?ssl=true&replicaSet=atlas-14ab3h-shard-0&authSource=admin&retryWrites=true&w=majority',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 20000,
        socketTimeoutMS: 60000,
        connectTimeoutMS: 20000,
        maxPoolSize: 5,
        retryWrites: true,
        w: 'majority',
        family: 4,
        bufferCommands: false,
        bufferMaxEntries: 0
      }
    },
    // Strategy 3: Alternative direct connection
    {
      name: 'Alternative Direct Connection',
      uri: 'mongodb://fitlife_user:mFzSW2IMFvBdI7Hi@cluster0-shard-00-00.yoznqn9.mongodb.net:27017,cluster0-shard-00-01.yoznqn9.mongodb.net:27017,cluster0-shard-00-02.yoznqn9.mongodb.net:27017/fitlife?ssl=true&replicaSet=atlas-14ab3h-shard-0&authSource=admin&retryWrites=true&w=majority',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 25000,
        socketTimeoutMS: 60000,
        connectTimeoutMS: 25000,
        maxPoolSize: 5,
        retryWrites: true,
        w: 'majority',
        family: 4,
        bufferCommands: false
      }
    }
  ];

  console.log('🔄 Connecting to MongoDB Atlas (Railway Production)...');
  
  for (let i = 0; i < connectionStrategies.length; i++) {
    const strategy = connectionStrategies[i];
    
    try {
      console.log(`📡 Attempting ${strategy.name} (${i + 1}/${connectionStrategies.length})...`);
      console.log('🎯 Using explicit hosts (no SRV DNS lookup)');
      
      await mongoose.connect(strategy.uri, strategy.options);
      
      console.log(`✅ MongoDB Atlas connected successfully via ${strategy.name}!`);
      console.log('🎯 Real database connection established');
      global.isMongoConnected = true;
      return; // Success - exit function
      
    } catch (error) {
      console.warn(`❌ ${strategy.name} failed:`, error.message);
      
      // If this was the last strategy, throw the error
      if (i === connectionStrategies.length - 1) {
        throw error;
      }
      
      console.log(`🔄 Trying next connection strategy...`);
    }
  }
};

// Wrapper with retry logic for Railway network issues
const connectWithRetry = async () => {
  const maxRetries = 3;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🚀 MongoDB connection attempt ${attempt}/${maxRetries}`);
      await connectMongoDB();
      return; // Success
      
    } catch (error) {
      console.error(`❌ Connection attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) {
        console.error('🚨 CRITICAL: All MongoDB connection attempts failed');
        console.error('🚨 Database connection required for production');
        console.log('💥 Exiting process - Railway will restart with fresh network');
        process.exit(1);
      }
      
      // Wait before retry
      const waitTime = attempt * 2000; // 2s, 4s, 6s
      console.log(`⏳ Waiting ${waitTime}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
};

// Start server ONLY after successful database connection
const startServer = async () => {
  try {
    // Connect to MongoDB first with retry logic - REQUIRED for production
    await connectWithRetry();
    
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