// Railway deployment helper script
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚂 Railway Deployment Helper');
console.log('============================');

// Check if Railway CLI is installed
try {
  execSync('railway --version', { stdio: 'pipe' });
  console.log('✅ Railway CLI is installed');
} catch (error) {
  console.log('❌ Railway CLI not found. Installing...');
  try {
    execSync('npm install -g @railway/cli', { stdio: 'inherit' });
    console.log('✅ Railway CLI installed successfully');
  } catch (installError) {
    console.error('❌ Failed to install Railway CLI. Please install manually:');
    console.error('npm install -g @railway/cli');
    process.exit(1);
  }
}

// Check if backend dependencies are ready
const backendPackagePath = './backend/package.json';
if (fs.existsSync(backendPackagePath)) {
  console.log('✅ Backend package.json found');
  
  // Check if backend node_modules exists
  if (fs.existsSync('./backend/node_modules')) {
    console.log('✅ Backend dependencies installed');
  } else {
    console.log('⚠️  Installing backend dependencies...');
    try {
      execSync('cd backend && npm ci', { stdio: 'inherit' });
      console.log('✅ Backend dependencies installed');
    } catch (error) {
      console.error('❌ Failed to install backend dependencies');
      process.exit(1);
    }
  }
} else {
  console.error('❌ Backend package.json not found');
  process.exit(1);
}

console.log('\n🚀 Ready for Railway deployment!');
console.log('\nNext steps:');
console.log('1. Run: railway login');
console.log('2. Run: railway deploy');
console.log('3. Add environment variables in Railway dashboard');
console.log('4. Get your Railway URL and update frontend API configuration');

console.log('\nEnvironment variables to add in Railway:');
console.log('NODE_ENV=production');
console.log('MONGODB_URI=your_mongodb_uri');
console.log('JWT_SECRET=your_jwt_secret');
console.log('RAZORPAY_KEY_ID=your_razorpay_key_id');
console.log('RAZORPAY_KEY_SECRET=your_razorpay_key_secret');
console.log('FRONTEND_URL=https://your-vercel-app.vercel.app');
console.log('PORT=3000');