# Railway Deployment Guide - Better Alternative to Render

## Why Railway is Better
- ✅ Better monorepo support
- ✅ More reliable directory handling
- ✅ Simpler configuration
- ✅ Better Node.js support
- ✅ Automatic environment detection

## Step 1: Deploy to Railway

### Option A: Using Railway CLI (Recommended)
1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login to Railway:
   ```bash
   railway login
   ```

3. Deploy from your project directory:
   ```bash
   railway deploy
   ```

### Option B: Using Railway Dashboard
1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account
5. Select your repository: `himanshu123g/fitlife-plus`
6. Railway will auto-detect it's a Node.js project

## Step 2: Environment Variables
Add these in Railway dashboard:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://fitlife_user:mFzSW2IMFvBdI7Hi@fitlifecluster.yoznqn9.mongodb.net/?retryWrites=true&w=majority
JWT_SECRET=fitlife_jwt_secret_key_2024_secure_random_string_please_change_this
RAZORPAY_KEY_ID=rzp_test_RbG4vPywUm6x4a
RAZORPAY_KEY_SECRET=cgLF2uaRJph5KYSQb1J2unrV
FRONTEND_URL=https://your-vercel-app.vercel.app
PORT=3000
```

## Step 3: Railway Configuration

The `railway.json` is already configured:
- **Build Command**: `cd backend && npm ci && npm run build`
- **Start Command**: `cd backend && npm start`
- **Builder**: NIXPACKS (Railway's smart builder)

## Step 4: Deployment Process

Railway will:
1. 🔄 Clone your repository
2. 🔧 Detect Node.js project
3. 📦 Run build command in backend directory
4. 🚀 Start server with start command
5. 🌐 Provide you with a live URL

## Step 5: Get Your Backend URL

After deployment, Railway will give you a URL like:
- `https://your-project-name.railway.app`

## Step 6: Update Frontend API Configuration

Once you have your Railway URL, update the API configuration:

1. Update `src/api.js`:
   ```javascript
   // Replace the production URL
   return 'https://your-railway-app.railway.app/api';
   ```

2. Update `frontend/src/api.js` the same way

3. Commit and push changes

## Advantages of Railway over Render

| Feature | Railway | Render |
|---------|---------|--------|
| Monorepo Support | ✅ Excellent | ❌ Poor |
| Directory Handling | ✅ Reliable | ❌ Inconsistent |
| Build Speed | ✅ Fast | ⚠️ Slow |
| Configuration | ✅ Simple | ❌ Complex |
| Node.js Support | ✅ Native | ⚠️ Limited |
| Free Tier | ✅ Generous | ⚠️ Restrictive |

## Troubleshooting

If Railway deployment fails:
1. Check the build logs in Railway dashboard
2. Verify environment variables are set
3. Ensure `backend/package.json` has all dependencies

## Success Indicators

✅ Build logs show: "Dependencies installed successfully"  
✅ Start logs show: "Server running on port 3000"  
✅ Health endpoint responds: `https://your-app.railway.app/health`  

Railway should handle the backend deployment much more reliably than Render!