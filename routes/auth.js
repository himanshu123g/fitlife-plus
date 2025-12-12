const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Signup
router.post('/signup', async (req, res) => {
  const { name, email, password, age, gender, dietPreference } = req.body;
  console.log('Signup request received:', { name, email, age, gender, dietPreference });
  
  if (!name || !email || !password) {
    console.log('Missing required fields');
    return res.status(400).json({ message: 'Missing fields' });
  }
  
  try {
    let user = await User.findOne({ email });
    if (user) {
      console.log('Email already registered:', email);
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    user = new User({ name, email, passwordHash, plainPassword: password, age, gender, dietPreference });
    await user.save();
    console.log('User created successfully:', user._id);
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role || 'user',
        membership: user.membership,
        dietPreference: user.dietPreference
      } 
    });
  } catch (err) {
    console.error('Signup error:', err);
    console.error('Error details:', err.message);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role || 'user',
        membership: user.membership 
      } 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;