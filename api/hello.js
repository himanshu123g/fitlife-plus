export default function handler(req, res) {
  res.status(200).json({
    message: 'Hello from FitLife+ API!',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
}