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

// REAL MONGODB CONNECTION - No Mock Data
const connectMongoDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    
    const mongoOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 15000, // Reduced timeout
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority',
      family: 4 // Force IPv4 to avoid IPv6 DNS issues
    };

    // Primary SRV connection string - ensure database name is included
    let srvConnectionString = process.env.MONGODB_URI || 'mongodb+srv://fitlife_user:mFzSW2IMFvBdI7Hi@fitlifecluster.yoznqn9.mongodb.net/?retryWrites=true&w=majority';
    
    // Ensure database name is specified
    if (!srvConnectionString.includes('/fitlife') && !srvConnectionString.includes('/test')) {
      srvConnectionString = srvConnectionString.replace('mongodb.net/', 'mongodb.net/fitlife');
    }
    
    // Fallback direct connection strings (bypasses SRV DNS lookup)
    const directConnectionStrings = [
      'mongodb://fitlife_user:mFzSW2IMFvBdI7Hi@ac-ixqvhqj-shard-00-00.yoznqn9.mongodb.net:27017,ac-ixqvhqj-shard-00-01.yoznqn9.mongodb.net:27017,ac-ixqvhqj-shard-00-02.yoznqn9.mongodb.net:27017/fitlife?ssl=true&replicaSet=atlas-14ab3h-shard-0&authSource=admin&retryWrites=true&w=majority',
      'mongodb://fitlife_user:mFzSW2IMFvBdI7Hi@cluster0-shard-00-00.yoznqn9.mongodb.net:27017,cluster0-shard-00-01.yoznqn9.mongodb.net:27017,cluster0-shard-00-02.yoznqn9.mongodb.net:27017/fitlife?ssl=true&replicaSet=atlas-14ab3h-shard-0&authSource=admin&retryWrites=true&w=majority'
    ];
    
    // Try SRV connection first
    console.log('📡 Attempting MongoDB Atlas SRV connection...');
    try {
      await mongoose.connect(srvConnectionString, mongoOptions);
      console.log('✅ MongoDB Atlas SRV connection successful!');
      global.isMongoConnected = true;
      return;
    } catch (srvError) {
      console.warn('⚠️ SRV connection failed:', srvError.message);
      console.log('🔄 Trying direct connection fallbacks...');
    }
    
    // Try direct connections as fallback
    for (let i = 0; i < directConnectionStrings.length; i++) {
      try {
        console.log(`📡 Attempting direct connection ${i + 1}/${directConnectionStrings.length}...`);
        await mongoose.connect(directConnectionStrings[i], mongoOptions);
        console.log('✅ MongoDB Atlas direct connection successful!');
        global.isMongoConnected = true;
        return;
      } catch (directError) {
        console.warn(`❌ Direct connection ${i + 1} failed:`, directError.message);
      }
    }
    
    // All connections failed
    throw new Error('All MongoDB connection attempts failed');
    
  } catch (error) {
    console.error('❌ MongoDB Atlas connection completely failed:', error.message);
    console.error('🚨 CRITICAL: Database unavailable - server cannot function');
    
    // In production, exit immediately if MongoDB fails
    if (process.env.NODE_ENV === 'production') {
      console.log('🔄 Production mode: Exiting for Railway restart...');
      process.exit(1);
    } else {
      console.log('⚠️ Development mode: Server continuing without database');
    }
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