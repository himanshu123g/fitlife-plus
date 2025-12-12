// Root server.js - Redirects to backend
const path = require('path');
const fs = require('fs');

console.log('🔄 FitLife+ Root Server - Redirecting to Backend...');
console.log('Current directory:', process.cwd());

// Check if backend directory exists
const backendDir = path.join(__dirname, 'backend');
const backendServer = path.join(backendDir, 'server.js');

if (fs.existsSync(backendServer)) {
  console.log('✅ Backend found, starting backend server...');
  process.chdir(backendDir);
  console.log('Changed to backend directory:', process.cwd());
  require('./server.js');
} else {
  console.error('❌ Backend server not found at:', backendServer);
  process.exit(1);
}