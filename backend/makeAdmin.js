const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    // Get email from command line argument or use default
    const email = process.argv[2];
    
    if (!email) {
      console.log('❌ Please provide an email address');
      console.log('Usage: node makeAdmin.js your-email@example.com');
      process.exit(1);
    }
    
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('❌ User not found with email:', email);
      console.log('\nAvailable users:');
      const allUsers = await User.find({}).select('email name isAdmin');
      allUsers.forEach(u => {
        console.log(`  - ${u.email} (${u.name}) ${u.isAdmin ? '[ADMIN]' : ''}`);
      });
      process.exit(1);
    }
    
    if (user.isAdmin) {
      console.log('ℹ️  User is already an admin');
      console.log('Email:', user.email);
      console.log('Name:', user.name);
      process.exit(0);
    }
    
    user.isAdmin = true;
    await user.save();
    
    console.log('\n✅ SUCCESS! User is now admin:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email:', user.email);
    console.log('Name:', user.name);
    console.log('isAdmin:', user.isAdmin);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📝 Next steps:');
    console.log('1. Logout from the admin panel');
    console.log('2. Login again with this account');
    console.log('3. Access admin panel at /admin');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

makeAdmin();
