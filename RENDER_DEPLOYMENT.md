# Render Backend Deployment Configuration

## Fixed Issues
- ✅ Added missing `build` script to backend/package.json
- ✅ Updated Node.js engine to >=18.0.0 for Render compatibility
- ✅ Updated render.yaml with proper build command (`npm ci && npm run build`)
- ✅ Added root-level helper scripts for deployment

## Render Configuration

### Build & Start Commands
- **Build Command**: `npm ci && npm run build`
- **Start Command**: `npm start`
- **Root Directory**: `backend`

### Required Environment Variables
Set these in your Render dashboard (replace with your actual values):

```
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
FRONTEND_URL=https://your-vercel-app.vercel.app
```

## Local Testing
To test the backend locally:

```bash
cd backend
npm ci
npm run build
npm start
```

Server should start on port 5000 (or PORT environment variable).

## Project Structure
```
root/
├── backend/
│   ├── server.js ← Entry point
│   ├── package.json ← Backend dependencies & scripts
│   ├── routes/ ← API routes
│   ├── models/ ← Database models
│   └── node_modules/ ← Dependencies (created by npm ci)
├── frontend/ ← React frontend
├── src/ ← Frontend source
└── package.json ← Root/frontend dependencies
```

## Deployment Process
1. Push changes to GitHub
2. Render automatically detects changes
3. Render runs: `cd backend && npm ci && npm run build`
4. Render starts: `cd backend && npm start`
5. Backend available at your Render URL