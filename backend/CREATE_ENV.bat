@echo off
echo ========================================
echo Creating .env file with new MongoDB URI
echo ========================================
echo.

cd /d "D:\Fit Life Project\backend"

if exist ".env" (
    echo WARNING: .env file already exists!
    echo.
    echo Do you want to backup and replace it? (Y/N)
    set /p backup="Enter choice: "
    if /i "%backup%"=="Y" (
        copy .env .env.backup
        echo Old .env backed up to .env.backup
        echo.
    ) else (
        echo Operation cancelled. Exiting...
        pause
        exit /b
    )
)

echo Creating new .env file with updated MongoDB URI...
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
echo Contents:
echo ========================================
type .env
echo ========================================
echo.
echo IMPORTANT: The MongoDB URI has been updated to:
echo mongodb+srv://fitlifeoriginals:NcfAS4OvIC6EQVIU@cluster0.rcvdz0s.mongodb.net/fitlife
echo.
echo Make sure your IP is whitelisted in MongoDB Atlas!
echo.
pause

