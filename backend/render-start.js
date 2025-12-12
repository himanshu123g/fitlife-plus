// Render startup script to ensure proper directory and dependencies
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 FitLife+ Backend Starting...');
console.log('Current directory:', process.cwd());
console.log('Node version:', process.version);

// Check if we're in the right directory
const backendDir = path.join(__dirname);
const serverPath = path.join(backendDir, 'server.js');
const packagePath = path.join(backendDir, 'package.json');

console.log('Backend directory:', backendDir);
console.log('Server path:', serverPath);
console.log('Package.json exists:', fs.existsSync(packagePath));

// Change to backend directory
process.chdir(backendDir);
console.log('Changed to directory:', process.cwd());

// Start the server
console.log('Starting server...');
require('./server.js');