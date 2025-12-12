const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@fitlife.com' });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email: admin@fitlife.com');
      process.exit(0);
    }

    // Create admin user
    const passwordHash = await bcrypt.hash('admin123', 10);
    const admin = new User({
      name: 'Admin',
      email: 'admin@fitlife.com',
      passwordHash,
      role: 'admin',
      gender: 'male',
      age: 30
    });

    await admin.save();
    console.log('✓ Admin user created successfully!');
    console.log('Email: admin@fitlife.com');
    console.log('Password: admin123');
    console.log('\nYou can now login with these credentials.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
