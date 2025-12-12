@echo off
echo ========================================
echo Viewing .env file contents
echo ========================================
echo.

cd /d "D:\Fit Life Project\backend"

if not exist ".env" (
    echo ERROR: .env file not found!
    pause
    exit /b 1
)

echo .env file contents:
echo ========================================
type .env
echo ========================================
echo.
echo.
echo Make sure these lines exist exactly:
echo   RAZORPAY_KEY_ID=rzp_test_RbG4vPywUm6x4a
echo   RAZORPAY_KEY_SECRET=cgLF2uaRJph5KYSQb1J2unrV
echo.
pause

