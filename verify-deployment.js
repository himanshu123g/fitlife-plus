// Railway Deployment Verification Script
const https = require('https');
const http = require('http');

const RAILWAY_URL = process.argv[2] || 'https://your-app.railway.app';

console.log('🔍 Verifying Railway deployment...');
console.log('URL:', RAILWAY_URL);

const makeRequest = (url) => {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data
          });
        }
      });
    }).on('error', reject);
  });
};

const verify = async () => {
  try {
    // Test root endpoint
    console.log('\n📡 Testing root endpoint...');
    const rootResponse = await makeRequest(RAILWAY_URL);
    console.log('Status:', rootResponse.status);
    console.log('Response:', rootResponse.data);
    
    if (rootResponse.status === 200 && rootResponse.data.status === 'ok') {
      console.log('✅ Root endpoint working');
      console.log('Database status:', rootResponse.data.database);
    } else {
      console.log('❌ Root endpoint failed');
    }
    
    // Test health endpoint
    console.log('\n📡 Testing health endpoint...');
    const healthResponse = await makeRequest(`${RAILWAY_URL}/health`);
    console.log('Status:', healthResponse.status);
    console.log('Response:', healthResponse.data);
    
    if (healthResponse.status === 200 && healthResponse.data.status === 'healthy') {
      console.log('✅ Health endpoint working');
      console.log('Database status:', healthResponse.data.database);
    } else {
      console.log('❌ Health endpoint failed');
    }
    
    // Test API endpoint
    console.log('\n📡 Testing API endpoint...');
    const apiResponse = await makeRequest(`${RAILWAY_URL}/api/auth/test`);
    console.log('Status:', apiResponse.status);
    console.log('Response:', apiResponse.data);
    
    console.log('\n=== VERIFICATION COMPLETE ===');
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
  }
};

verify();