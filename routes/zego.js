const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const Trainer = require('../models/Trainer');

// ZegoCloud credentials (KEEP SECRET - SERVER SIDE ONLY)
const ZEGO_APP_ID = 400003058;
const ZEGO_SERVER_SECRET = 'd0c1478a9c793ec2bd492bb105935585';

/**
 * Generate Zego Token04 (Official Method)
 * This follows the official Zego documentation for token generation
 * @param {number} appId - Your Zego App ID
 * @param {string} userId - User ID
 * @param {string} serverSecret - Your Zego Server Secret
 * @param {number} effectiveTimeInSeconds - Token validity duration (default: 86400 = 24 hours)
 * @param {string} payload - Additional payload (optional)
 * @returns {string} Generated token
 */
function generateToken04(appId, userId, serverSecret, effectiveTimeInSeconds = 86400, payload = '') {
  // Create timestamp
  const createTime = Math.floor(Date.now() / 1000);
  const tokenExpireTime = createTime + effectiveTimeInSeconds;

  // Create token body
  const body = {
    app_id: appId,
    user_id: userId,
    nonce: Math.floor(Math.random() * 2147483647),
    ctime: createTime,
    expire: tokenExpireTime,
    payload: payload
  };

  // Create signature
  const signature = crypto
    .createHmac('sha256', serverSecret)
    .update(JSON.stringify(body))
    .digest('hex');

  // Create final token structure
  const tokenData = {
    ...body,
    signature: signature
  };

  // Encode to base64
  const token = Buffer.from(JSON.stringify(tokenData)).toString('base64');
  
  return token;
}

/**
 * API Endpoint: GET /api/zego-token
 * Generate Zego token for authenticated users
 * Query params: userID, expired_ts (optional, default 86400)
 */
router.get('/api/zego-token', auth, async (req, res) => {
  try {
    const { userID, expired_ts } = req.query;
    
    if (!userID) {
      return res.status(400).json({ 
        error: 'Missing required parameter: userID' 
      });
    }

    // Check if user is Elite (for regular users)
    if (req.user.membership?.plan !== 'elite') {
      return res.status(403).json({ 
        error: 'Elite membership required for video calls' 
      });
    }

    // Generate token with specified expiry time (default 24 hours)
    const effectiveTime = expired_ts ? parseInt(expired_ts) : 86400;
    const token = generateToken04(
      ZEGO_APP_ID,
      userID,
      ZEGO_SERVER_SECRET,
      effectiveTime
    );

    res.json({ token });
  } catch (err) {
    console.error('Zego token generation error:', err);
    res.status(500).json({ 
      error: 'Failed to generate token',
      message: err.message 
    });
  }
});

/**
 * API Endpoint: GET /api/zego-token/trainer
 * Generate Zego token for trainers
 * Query params: userID, expired_ts (optional, default 86400)
 */
router.get('/api/zego-token/trainer', async (req, res) => {
  try {
    const { userID, expired_ts } = req.query;
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Auth token missing' });
    }

    if (!userID) {
      return res.status(400).json({ 
        error: 'Missing required parameter: userID' 
      });
    }

    // Verify trainer token
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.type !== 'trainer') {
      return res.status(403).json({ error: 'Access denied. Trainer only.' });
    }

    const trainer = await Trainer.findById(payload.id);
    if (!trainer) {
      return res.status(401).json({ error: 'Trainer not found' });
    }

    // Generate token with specified expiry time (default 24 hours)
    const effectiveTime = expired_ts ? parseInt(expired_ts) : 86400;
    const zegoToken = generateToken04(
      ZEGO_APP_ID,
      userID,
      ZEGO_SERVER_SECRET,
      effectiveTime
    );

    res.json({ token: zegoToken });
  } catch (err) {
    console.error('Zego token generation error:', err);
    res.status(500).json({ 
      error: 'Failed to generate token',
      message: err.message 
    });
  }
});

/**
 * API Endpoint: GET /api/zego-token/test
 * Generate Zego token for testing (NO AUTHENTICATION REQUIRED)
 * Query params: userID, expired_ts (optional, default 86400)
 */
router.get('/api/zego-token/test', async (req, res) => {
  try {
    const { userID, expired_ts } = req.query;
    
    if (!userID) {
      return res.status(400).json({ 
        error: 'Missing required parameter: userID' 
      });
    }

    // Generate token with specified expiry time (default 24 hours)
    const effectiveTime = expired_ts ? parseInt(expired_ts) : 86400;
    const token = generateToken04(
      ZEGO_APP_ID,
      userID,
      ZEGO_SERVER_SECRET,
      effectiveTime
    );

    res.json({ token });
  } catch (err) {
    console.error('Zego test token generation error:', err);
    res.status(500).json({ 
      error: 'Failed to generate token',
      message: err.message 
    });
  }
});

/**
 * Legacy POST endpoints for backward compatibility
 * These will be deprecated in favor of GET endpoints
 */

// POST /zego/token - For authenticated users
router.post('/token', auth, async (req, res) => {
  try {
    const { roomId } = req.body;
    
    if (!roomId) {
      return res.status(400).json({ message: 'Room ID is required' });
    }
    
    // Check if user is Elite
    if (req.user.membership?.plan !== 'elite') {
      return res.status(403).json({ message: 'Elite membership required for video calls' });
    }
    
    const userId = req.user._id.toString();
    const userName = req.user.name || 'User';
    
    // Return server secret for frontend to generate kit token
    // Note: This is acceptable for ZegoUIKitPrebuilt as it's used client-side
    res.json({ 
      token: ZEGO_SERVER_SECRET,  // Frontend needs this for generateKitTokenForTest
      appId: ZEGO_APP_ID,
      userId,
      userName,
      roomId
    });
  } catch (err) {
    console.error('Zego token generation error:', err);
    res.status(500).json({ message: 'Failed to generate token', error: err.message });
  }
});

// POST /zego/token/trainer - For trainers
router.post('/token/trainer', async (req, res) => {
  try {
    const { roomId } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Auth token missing' });
    }
    
    if (!roomId) {
      return res.status(400).json({ message: 'Room ID is required' });
    }
    
    // Verify trainer token
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.type !== 'trainer') {
      return res.status(403).json({ message: 'Access denied. Trainer only.' });
    }
    
    const trainer = await Trainer.findById(payload.id);
    if (!trainer) {
      return res.status(401).json({ message: 'Trainer not found' });
    }
    
    const userId = trainer._id.toString();
    const userName = trainer.name || 'Trainer';
    
    // Return server secret for frontend to generate kit token
    res.json({ 
      token: ZEGO_SERVER_SECRET,  // Frontend needs this for generateKitTokenForTest
      appId: ZEGO_APP_ID,
      userId,
      userName,
      roomId
    });
  } catch (err) {
    console.error('Zego token generation error:', err);
    res.status(500).json({ message: 'Failed to generate token', error: err.message });
  }
});

// POST /zego/token/test - For testing
router.post('/token/test', async (req, res) => {
  try {
    const { roomId, userName, role } = req.body;
    
    if (!roomId) {
      return res.status(400).json({ message: 'Room ID is required' });
    }
    
    if (!userName) {
      return res.status(400).json({ message: 'User name is required' });
    }
    
    // Generate a unique test user ID
    const userId = `test_${role}_${userName.replace(/\s+/g, '_')}_${Date.now()}`;
    const displayName = `${userName} (${role === 'trainer' ? 'Trainer' : 'User'})`;
    
    // Return server secret for frontend to generate kit token
    res.json({ 
      token: ZEGO_SERVER_SECRET,  // Frontend needs this for generateKitTokenForTest
      appId: ZEGO_APP_ID,
      userId,
      userName: displayName,
      roomId
    });
  } catch (err) {
    console.error('Zego test token generation error:', err);
    res.status(500).json({ message: 'Failed to generate token', error: err.message });
  }
});

module.exports = router;
