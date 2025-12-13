const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
dotenv.config();

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
  res.json({ status: 'ok', message: 'FitLife+ backend running', env: process.env.NODE_ENV || 'development' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', time: new Date().toISOString() });
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

// Enhanced MongoDB connection with Railway-specific fixes
const connectMongoDB = async () => {
  try {
    // Alternative connection strings for Railway compatibility
    const mongoURIs = [
      process.env.MONGODB_URI,
      // Fallback with direct connection (no SRV)
      'mongodb://fitlife_user:mFzSW2IMFvBdI7Hi@ac-nkxaaaa-shard-00-00.yoznqn9.mongodb.net:27017,ac-nkxaaaa-shard-00-01.yoznqn9.mongodb.net:27017,ac-nkxaaaa-shard-00-02.yoznqn9.mongodb.net:27017/fitlife?ssl=true&replicaSet=atlas-abc123-shard-0&authSource=admin&retryWrites=true&w=majority',
      // Another fallback format
      process.env.MONGODB_URI?.replace('mongodb+srv://', 'mongodb://').replace('/?', '/fitlife?ssl=true&authSource=admin&')
    ].filter(Boolean);

    const mongoOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 15000, // 15 seconds
      socketTimeoutMS: 45000, // 45 seconds
      connectTimeoutMS: 15000, // 15 seconds
      family: 4, // Use IPv4, skip trying IPv6
      retryWrites: true,
      w: 'majority',
      maxPoolSize: 10,
      bufferCommands: false,
      bufferMaxEntries: 0
    };

    console.log('🔄 Attempting MongoDB connection with multiple strategies...');
    
    for (let i = 0; i < mongoURIs.length; i++) {
      try {
        console.log(`📡 Trying connection method ${i + 1}...`);
        await mongoose.connect(mongoURIs[i], mongoOptions);
        console.log('✅ MongoDB connected successfully!');
        console.log(`🎯 Connected using method ${i + 1}`);
        return; // Success, exit the function
      } catch (error) {
        console.log(`❌ Method ${i + 1} failed:`, error.message);
        if (i < mongoURIs.length - 1) {
          console.log('🔄 Trying next connection method...');
        }
      }
    }
    
    // If all methods fail
    throw new Error('All MongoDB connection methods failed');
    
  } catch (error) {
    console.error('❌ MongoDB connection completely failed:', error.message);
    console.log('⚠️  Server will continue without MongoDB');
    console.log('🚨 Database features (login, signup, data storage) will not work!');
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