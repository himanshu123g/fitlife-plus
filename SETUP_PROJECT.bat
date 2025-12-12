@echo off
echo ========================================
echo FitLife+ Project Setup
echo ========================================
echo.
echo This script will:
echo 1. Install backend dependencies
echo 2. Install frontend dependencies
echo 3. Check for .env files
echo.
pause

echo.
echo ========================================
echo Step 1: Installing Backend Dependencies
echo ========================================
cd /d "D:\Fit Life Project\backend"
if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
    echo Backend dependencies installed!
) else (
    echo Backend dependencies already installed.
)
echo.

echo ========================================
echo Step 2: Installing Frontend Dependencies
echo ========================================
cd /d "D:\Fit Life Project\frontend"
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
    echo Frontend dependencies installed!
) else (
    echo Frontend dependencies already installed.
)
echo.

echo ========================================
echo Step 3: Checking .env Files
echo ========================================
cd /d "D:\Fit Life Project\backend"
if not exist ".env" (
    echo WARNING: backend\.env file not found!
    echo Please create .env file with:
    echo   MONGODB_URI=your_mongodb_connection_string
    echo   JWT_SECRET=your_jwt_secret
    echo   RAZORPAY_KEY_ID=rzp_test_RbG4vPywUm6x4a
    echo   RAZORPAY_KEY_SECRET=cgLF2uaRJph5KYSQb1J2unrV
    echo   FRONTEND_URL=http://localhost:3000
    echo   PORT=5000
) else (
    echo Backend .env file found.
)
echo.

cd /d "D:\Fit Life Project\frontend"
if not exist ".env" (
    echo WARNING: frontend\.env file not found!
    echo Please create .env file with:
    echo   REACT_APP_API_URL=http://localhost:5000/api
) else (
    echo Frontend .env file found.
)
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the project:
echo   1. Open a CMD window and run: START_BACKEND.bat
echo   2. Open another CMD window and run: START_FRONTEND.bat
echo.
pause

