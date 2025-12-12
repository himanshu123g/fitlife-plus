// Script to update API URLs after backend deployment
const fs = require('fs');
const path = require('path');

// Get the backend URL from command line argument
const backendUrl = process.argv[2];

if (!backendUrl) {
  console.log('❌ Please provide your backend URL');
  console.log('Usage: node update-api-url.js https://your-backend-url.onrender.com');
  console.log('');
  console.log('Example:');
  console.log('node update-api-url.js https://fitlife-backend-abc123.onrender.com');
  process.exit(1);
}

// Validate URL format
if (!backendUrl.startsWith('https://') || !backendUrl.includes('.onrender.com')) {
  console.log('❌ Invalid URL format. Expected: https://your-app.onrender.com');
  process.exit(1);
}

const apiUrl = `${backendUrl}/api`;

console.log('🔄 Updating API URLs...');
console.log('Backend URL:', backendUrl);
console.log('API URL:', apiUrl);

// Files to update
const files = [
  'src/api.js',
  'frontend/src/api.js'
];

files.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    console.log(`📝 Updating ${filePath}...`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace the placeholder URL
    const oldUrl = 'https://fitlife-backend-latest.onrender.com/api';
    const newContent = content.replace(oldUrl, apiUrl);
    
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Updated ${filePath}`);
    } else {
      console.log(`⚠️  No changes needed in ${filePath}`);
    }
  } else {
    console.log(`❌ File not found: ${filePath}`);
  }
});

console.log('');
console.log('✅ API URLs updated successfully!');
console.log('');
console.log('Next steps:');
console.log('1. Commit and push changes: git add . && git commit -m "Update API URLs" && git push');
console.log('2. Vercel will automatically redeploy your frontend');
console.log('3. Wait for deployment to complete');
console.log('4. Test your live application');