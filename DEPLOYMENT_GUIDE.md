# FitLife+ Deployment Guide - FIXED

## CRITICAL: Backend Deployment Fix

The "Cannot find module 'express'" error occurs because Render needs to be configured properly for the backend folder structure.

### Backend Deployment (Render.com) - CORRECT METHOD

#### Step 1: Manual Render Setup (RECOMMENDED)
1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. **CRITICAL CONFIGURATION**:
   - **Name**: fitlife-backend
   - **Root Directory**: `backend` (THIS IS CRUCIAL)
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Auto-Deploy**: Yes

5. **Environment Variables** (Add these exactly):
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://fitlife_user:mFzSW2IMFvBdI7Hi@fitlifecluster.yoznqn9.mongodb.net/?retryWrites=true&w=majority
   JWT_SECRET=fitlife_jwt_secret_key_2024_secure_random_string_please_change_this
   RAZORPAY_KEY_ID=rzp_test_RbG4vPywUm6x4a
   RAZORPAY_KEY_SECRET=cgLF2uaRJph5KYSQb1J2unrV
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```

6. Click "Create Web Service"
7. **IMPORTANT**: Wait for deployment to complete and check logs
8. Your backend URL will be: `https://fitlife-backend-XXXX.onrender.com`

#### Step 2: Verify Backend is Working
- Visit: `https://your-backend-url.onrender.com/health`
- Should return: `{"status":"healthy","time":"..."}`

### Frontend Deployment (Vercel) - CORRECT METHOD

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. **CRITICAL CONFIGURATION**:
   - **Framework Preset**: Create React App
   - **Root Directory**: Leave empty (uses root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

5. **Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-actual-render-url.onrender.com/api
   GENERATE_SOURCEMAP=false
   ```

6. Click "Deploy"

### Step 3: Update API URLs After Deployment

1. Get your actual Render backend URL (e.g., `https://fitlife-backend-abc123.onrender.com`)

2. Update both API files with the real URL:
   - `src/api.js`
   - `frontend/src/api.js`
   
   Change this line:
   ```javascript
   return 'https://fitlife-backend-latest.onrender.com/api';
   ```
   
   To your actual URL:
   ```javascript
   return 'https://fitlife-backend-abc123.onrender.com/api';
   ```

3. Commit and push changes to trigger redeployment

### Step 4: Update Backend CORS

Update the backend environment variable `FRONTEND_URL` in Render dashboard with your actual Vercel URL.

## Alternative: Railway Deployment

If Render continues to fail, try Railway:

1. Go to [railway.app](https://railway.app)
2. Create new project from GitHub repo
3. **IMPORTANT**: Set Root Directory to `backend`
4. Railway will auto-detect the Node.js app
5. Add the same environment variables as above

## Verification Steps

### Backend Health Check:
```bash
curl https://your-backend-url.onrender.com/health
```
Should return: `{"status":"healthy"}`

### Frontend Check:
1. Visit your Vercel URL
2. Open browser console (F12)
3. Look for API calls - should show your backend URL
4. Test login/signup functionality

## Common Issues & Solutions

### "Cannot find module 'express'"
- **Cause**: Render is not running from the `backend` directory
- **Fix**: Ensure Root Directory is set to `backend` in Render settings

### "Network Error" in Frontend
- **Cause**: API URL is incorrect
- **Fix**: Update API URLs with actual backend URL

### CORS Errors
- **Cause**: Backend CORS not configured for frontend URL
- **Fix**: Update `FRONTEND_URL` environment variable in backend

### Build Timeout
- **Cause**: Large dependencies or slow build
- **Fix**: Use Render's paid plan or optimize dependencies

## Success Indicators

✅ Backend logs show: "Server running on port 10000"
✅ Backend health endpoint returns JSON
✅ Frontend loads without console errors
✅ Login/signup works
✅ Shop page loads products