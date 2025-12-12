// Simple health check API for Vercel
module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Simple health check
  if (req.url === '/api' || req.url === '/') {
    res.status(200).json({ 
      status: 'ok', 
      message: 'FitLife+ API running on Vercel',
      timestamp: new Date().toISOString(),
      note: 'This is a simplified API for testing. Full backend deployment coming soon.'
    });
    return;
  }

  // For now, return a placeholder for all other API calls
  res.status(200).json({
    message: 'API endpoint placeholder',
    url: req.url,
    method: req.method,
    note: 'Full API functionality will be available once backend is properly deployed'
  });
};