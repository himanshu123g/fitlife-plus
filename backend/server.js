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

// REAL MONGODB CONNECTION - No Mock Data
const connectMongoDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    
    const mongoOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 75000,
      connectTimeoutMS: 30000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    };

    // Real MongoDB Atlas connection - get actual server IPs
    const atlasConnectionString = process.env.MONGODB_URI || 'mongodb+srv://fitlife_user:mFzSW2IMFvBdI7Hi@fitlifecluster.yoznqn9.mongodb.net/fitlife?retryWrites=true&w=majority';
    
    console.log('📡 Attempting MongoDB Atlas connection...');
    await mongoose.connect(atlasConnectionString, mongoOptions);
    
    console.log('✅ MongoDB Atlas connected successfully!');
    console.log('🎯 Real database connection established');
    global.isMongoConnected = true;
    
  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:', error.message);
    
    // If Atlas fails, the server should still start but without database
    console.log('⚠️  Server starting without database connection');
    console.log('🚨 Database features will not work until MongoDB is connected');
    
    // Exit the process so Railway restarts with fresh network
    console.log('🔄 Restarting to retry MongoDB connection...');
    setTimeout(() => {
      process.exit(1);
    }, 5000);
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