@echo off
echo ========================================
echo Fix .env File - Razorpay Keys
echo ========================================
echo.

cd /d "D:\Fit Life Project\backend"

if not exist ".env" (
    echo Creating new .env file...
    goto :create_new
)

echo Current .env file exists.
echo.
echo Do you want to:
echo   1. View current .env file
echo   2. Edit .env file
echo   3. Create new .env file (will backup old one)
echo.
set /p choice="Enter choice (1/2/3): "

if "%choice%"=="1" (
    echo.
    echo ========================================
    echo Current .env file contents:
    echo ========================================
    type .env
    echo ========================================
    pause
    exit /b
)

if "%choice%"=="2" (
    notepad .env
    echo.
    echo .env file opened in Notepad.
    echo After saving, restart your backend server!
    pause
    exit /b
)

if "%choice%"=="3" (
    goto :create_new
)

echo Invalid choice. Exiting.
pause
exit /b

:create_new
if exist ".env" (
    echo Backing up existing .env to .env.backup...
    copy .env .env.backup >nul
)

echo.
echo Creating new .env file with correct Razorpay keys...
echo.

(
echo # MongoDB Atlas Connection String
echo MONGODB_URI=mongodb+srv://fitlifeoriginals:NcfAS4OvIC6EQVIU@cluster0.rcvdz0s.mongodb.net/fitlife?retryWrites=true^&w=majority
echo.
echo # JWT Secret for token signing
echo JWT_SECRET=fitlife_jwt_secret_key_2024_secure_random_string
echo.
echo # Razorpay Payment Gateway Keys ^(Test/Sandbox^)
echo RAZORPAY_KEY_ID=rzp_test_RbG4vPywUm6x4a
echo RAZORPAY_KEY_SECRET=cgLF2uaRJph5KYSQb1J2unrV
echo.
echo # Frontend URL for CORS
echo FRONTEND_URL=http://localhost:3000
echo.
echo # Server Port
echo PORT=5000
) > .env

echo .env file created successfully!
echo.
echo ========================================
echo Contents:
echo ========================================
type .env
echo ========================================
echo.
echo IMPORTANT: Restart your backend server after this!
echo.
pause

