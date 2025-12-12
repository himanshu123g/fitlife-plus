// Simple test script to verify deployment setup
const path = require('path');
const fs = require('fs');

console.log('=== FitLife+ Deployment Test ===');
console.log('Current directory:', process.cwd());
console.log('Node version:', process.version);

// Check if we're in the right directory
const backendPath = path.join(process.cwd(), 'backend');
const serverPath = path.join(backendPath, 'server.js');
const packagePath = path.join(backendPath, 'package.json');

console.log('\n=== Directory Structure ===');
console.log('Backend directory exists:', fs.existsSync(backendPath));
console.log('Server.js exists:', fs.existsSync(serverPath));
console.log('Backend package.json exists:', fs.existsSync(packagePath));

if (fs.existsSync(packagePath)) {
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  console.log('\n=== Backend Dependencies ===');
  console.log('Express version:', pkg.dependencies?.express || 'NOT FOUND');
  console.log('All dependencies:', Object.keys(pkg.dependencies || {}));
}

// Test express require
try {
  console.log('\n=== Testing Express ===');
  process.chdir(backendPath);
  console.log('Changed to backend directory:', process.cwd());
  
  const express = require('express');
  console.log('✅ Express loaded successfully');
  
  const app = express();
  app.get('/test', (req, res) => res.json({ status: 'ok' }));
  
  const server = app.listen(0, () => {
    const port = server.address().port;
    console.log('✅ Test server started on port:', port);
    server.close();
    console.log('✅ Test server stopped');
  });
  
} catch (error) {
  console.error('❌ Error testing express:', error.message);
}

console.log('\n=== Deployment Ready ===');