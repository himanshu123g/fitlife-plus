const mongoose = require('mongoose');
const User = require('../models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function upgradeToElite() {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI not found in .env file');
      process.exit(1);
    }
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Find admin user (or specify email)
    const email = process.argv[2] || 'admin@fitlife.com';
    
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`User with email ${email} not found`);
      process.exit(1);
    }

    // Upgrade to Elite
    user.membership = {
      plan: 'elite',
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
    };

    await user.save();
    
    console.log(`✅ Successfully upgraded ${user.name} (${user.email}) to Elite membership!`);
    console.log('Membership details:', user.membership);
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

upgradeToElite();
