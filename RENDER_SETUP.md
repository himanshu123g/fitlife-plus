# Render Backend Deployment - EXACT STEPS

## The Problem
Render is not finding the express module because it's not running from the correct directory.

## SOLUTION: Manual Render Setup

### Step 1: Create New Web Service
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `himanshu123g/fitlife-plus`

### Step 2: CRITICAL Configuration
**IMPORTANT: Use these EXACT settings:**

- **Name**: `fitlife-backend`
- **Root Directory**: `backend` (THIS IS CRUCIAL!)
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Auto-Deploy**: `Yes`

### Step 3: Environment Variables
Add these EXACT environment variables:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://fitlife_user:mFzSW2IMFvBdI7Hi@fitlifecluster.yoznqn9.mongodb.net/?retryWrites=true&w=majority
JWT_SECRET=fitlife_jwt_secret_key_2024_secure_random_string_please_change_this
RAZORPAY_KEY_ID=rzp_test_RbG4vPywUm6x4a
RAZORPAY_KEY_SECRET=cgLF2uaRJph5KYSQb1J2unrV
FRONTEND_URL=https://your-vercel-app.vercel.app
```

### Step 4: Deploy
1. Click "Create Web Service"
2. Wait for deployment
3. Check logs for success

## Alternative: If Root Directory Doesn't Work

If Render doesn't support Root Directory properly, use these settings instead:

- **Root Directory**: Leave empty
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`

## Verification
Your backend URL will be: `https://fitlife-backend-XXXX.onrender.com`

Test it: `https://your-backend-url.onrender.com/health`
Should return: `{"status":"healthy"}`

## If Still Failing
The issue is that Render needs to run commands from the `backend` directory where `package.json` and `node_modules` are located. The express module is installed in `backend/node_modules`, not in the root directory.