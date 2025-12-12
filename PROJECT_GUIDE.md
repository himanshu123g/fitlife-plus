# FitLife+ - Complete Project Guide

## 📋 Project Overview

FitLife+ is a comprehensive fitness and wellness platform featuring user dashboards, trainer management, video calling, e-commerce for supplements, personalized diet/exercise plans, and an AI-powered fitness chatbot.

**Tech Stack:** MERN (MongoDB, Express.js, React, Node.js)  
**Version:** 1.0.0  
**Status:** Production Ready

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account
- Razorpay sandbox account
- Git

### Backend Setup
```cmd
cd backend
copy .env.example .env
```

Edit `.env` and configure:
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Random secret key
- `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
- `FRONTEND_URL=http://localhost:3000`
- `PORT=5000`

```cmd
npm install
npm run dev
```

### Frontend Setup
```cmd
cd frontend
copy .env.example .env
```

Edit `.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

```cmd
npm install
npm start
```

### Quick Start Scripts (Windows)
- `SETUP_PROJECT.bat` - Initial setup
- `START_BACKEND.bat` - Start backend (Port 5000)
- `START_FRONTEND.bat` - Start frontend (Port 3000)
- `START_NGROK.bat` - Start ngrok tunnel

### Verification
- Backend: http://localhost:5000/health
- Frontend: http://localhost:3000

---

## 📁 Project Structure

```
FitLife+/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── scripts/         # Utility scripts
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   ├── data/        # Static data
│   │   └── api.js       # Axios config
│   └── public/          # Static assets
├── photos/              # Product images
├── suppliments/         # Supplement images
└── trainers/            # Trainer photos
```

---

## 🎯 Core Features

### 1. User Management
- JWT authentication
- Signup with auto-login
- Profile management
- Password reset system

### 2. Membership System
**Three Tiers:**
- **Free:** Basic access
- **Pro (₹199):** Exercise/Diet plans, Remedies
- **Elite (₹499):** All Pro features + Video calls

**Payment:** Razorpay integration

### 3. BMI & Calorie Calculator
- Calculate BMI
- Personalized calorie recommendations
- Track BMI history
- Diet preference support (Veg/Non-Veg)

### 4. Exercise & Diet Plans
- Personalized plans based on BMI
- 7-day meal plans
- Exercise routines by fitness level
- Vegetarian/Non-Vegetarian options

### 5. Remedies System
- Natural health remedies
- Categorized by condition
- Pro/Elite members only

### 6. FitBot (AI Chatbot)
- Interactive decision tree
- Workout and diet advice
- Membership-gated features

### 7. E-Commerce (Supplements)
- Product catalog by brand
- Shopping cart
- Razorpay checkout
- Order history and tracking

### 8. Video Calling System
- ZegoCloud integration
- One-on-one trainer calls
- Screen sharing and chat
- Session notes and feedback
- Elite members only

### 9. Trainer Portal
- Session management
- Accept/reject requests
- Video call interface

### 10. Admin Panel
- User management
- Trainer management
- Product management
- Order management
- Analytics dashboard with charts

---

## 🔐 Authentication

### User Auth
- JWT tokens in localStorage
- 7-day expiry
- Auto-redirect on 401

### Trainer Auth
- Separate `trainerToken`
- Login: `/trainer/login`

### Admin Auth
- Admin role flag
- Protected routes
- Middleware validation

---

## 💳 Payment Integration

### Razorpay
- Membership: Pro (₹199), Elite (₹499)
- Supplement purchases
- Payment verification on backend
- Test mode for development

---

## 🔧 Technology Stack

### Frontend
- React 18.2.0
- React Router v6
- Axios 1.4.0
- Tailwind CSS 3.4.7
- Framer Motion 12.23.24
- Recharts 2.12.0
- ZegoCloud UIKit 2.17.0

### Backend
- Node.js
- Express.js 4.18.2
- MongoDB + Mongoose 7.3.1
- JWT (jsonwebtoken 9.0.2)
- bcryptjs 2.4.3
- Razorpay SDK 2.8.2

### Cloud Services
- MongoDB Atlas (Database)
- ZegoCloud (Video)
- Razorpay (Payments)

---

## 🐛 Troubleshooting

### Backend Won't Start
1. Check MongoDB connection
2. Verify `.env` variables
3. Check port 5000 availability
```cmd
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Frontend Won't Start
1. Clear and reinstall:
```cmd
rmdir /s /q node_modules
del package-lock.json
npm install
```
2. Verify `REACT_APP_API_URL` in `.env`

### Video Calls Not Working
1. HTTPS required (use ngrok or production)
2. Verify ZegoCloud credentials
3. Check browser permissions

### Payments Failing
1. Verify Razorpay keys:
```cmd
cd backend
CHECK_RAZORPAY.bat
```
2. Use test keys (`rzp_test_`)
3. Check webhook setup

### MongoDB Connection Error
1. Whitelist IP in MongoDB Atlas
2. Verify connection string
3. Check password URL encoding

---

## 📝 Important Notes

### Security
- Never commit `.env` files
- Keep JWT_SECRET secure
- Use HTTPS in production
- Validate all inputs
- Enable CORS properly

### Testing Flow
1. Signup → Auto-login
2. Dashboard → BMI Calculator
3. FitBot → Interactive chat
4. Shop → Add to cart → Checkout
5. Membership → Upgrade → Payment
6. Video Call (Elite only)

### Development vs Production

**Development:**
- Use `npm run dev` (backend)
- Use `npm start` (frontend)
- MongoDB: Atlas or local
- Razorpay: Test keys
- CORS: Allow localhost

**Production:**
- Set `NODE_ENV=production`
- Use production MongoDB
- Enable HTTPS
- Use production Razorpay keys
- Configure CORS for domain
- Optimize images
- Enable compression
- Set up error logging

---

## 🚀 Production Deployment Checklist

### Pre-Deployment
- [ ] Set `NODE_ENV=production`
- [ ] Update MongoDB URI
- [ ] Switch to production Razorpay keys
- [ ] Update `FRONTEND_URL`
- [ ] Update `REACT_APP_API_URL`
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS

### Optimization
- [ ] Run `npm run build`
- [ ] Optimize images
- [ ] Enable gzip compression
- [ ] Minify CSS/JS
- [ ] Remove console.logs
- [ ] Set up CDN

### Security
- [ ] Enable rate limiting
- [ ] Configure firewall
- [ ] Set security headers
- [ ] Enable CSRF protection
- [ ] Set up SSL/TLS
- [ ] Secure cookies

### Monitoring
- [ ] Error logging (Sentry)
- [ ] Uptime monitoring
- [ ] Performance monitoring
- [ ] Analytics
- [ ] Database backups
- [ ] Alert system

---

## 📞 Admin Tasks

### Create Admin User
```cmd
cd backend
node makeAdmin.js
```

### Seed Products
```cmd
cd backend
node scripts/seedProducts.js
```

### Check Environment
```cmd
cd backend
VIEW_ENV.bat
```

---

## 🎨 Design Features

### Color Palette
- Primary: Blue-600 to Cyan-600
- Accent: Purple-600 (Elite)
- Background: Slate-900, Blue-900
- Success: Green-600
- Warning: Yellow-600
- Error: Red-600

### Animations
- Scroll-based animations
- Hover effects (scale 1.05)
- Chart animations (1.5s duration)
- Smooth transitions (200-700ms)

---

## 📊 Recent Updates

### Improved Signup Flow
- Auto-login after signup
- Direct redirect to dashboard
- No manual login required

### Admin Analytics Dashboard
- 8 key metric cards
- 4 interactive charts:
  - Membership Distribution (Pie)
  - New User Signups (Line)
  - Order Status (Bar)
  - Revenue by Tier (Bar)

### Password Reset System
- Email-based reset requests
- Admin approval workflow
- Status check page
- Secure token-based reset

---

**Last Updated:** December 2024  
**Developed By:** Himanshu Sodhi, Akashdeep, Harpreet Singh  
**License:** Proprietary
