const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(sanitizeUser(user));
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile fields (name, age, gender, dietPreference)
router.put('/me', auth, async (req, res) => {
  const { name, age, gender, dietPreference } = req.body;
  try {
    const updates = {};
    if (typeof name === 'string' && name.trim()) updates.name = name.trim();
    if (typeof age !== 'undefined') updates.age = age;
    if (typeof gender === 'string' && gender.trim()) updates.gender = gender;
    if (typeof dietPreference === 'string' && dietPreference.trim()) updates.dietPreference = dietPreference.trim();

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    res.json({ user: sanitizeUser(user) });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    age: user.age,
    gender: user.gender,
    dietPreference: user.dietPreference,
    membership: user.membership
  };
}

module.exports = router;


