@echo off
setlocal enabledelayedexpansion
echo ========================================
echo Razorpay Configuration Checker
echo ========================================
echo.

cd /d "D:\Fit Life Project\backend"

echo Checking .env file...
if not exist ".env" (
    echo ERROR: .env file not found!
    echo Please create .env file with Razorpay keys.
    pause
    exit /b 1
)

echo.
echo .env file found. Checking for Razorpay keys...
echo.

set KEY_ID_FOUND=0
set KEY_SECRET_FOUND=0

findstr /C:"RAZORPAY_KEY_ID" .env >nul
if %errorlevel% equ 0 (
    echo [OK] RAZORPAY_KEY_ID found in .env
    for /f "tokens=2 delims==" %%a in ('findstr /C:"RAZORPAY_KEY_ID" .env') do (
        set KEY_ID=%%a
        set KEY_ID=!KEY_ID: =!
        if "!KEY_ID!"=="" (
            echo      WARNING: Value is empty!
        ) else (
            echo      Value: !KEY_ID:~0,15!...
        )
        set KEY_ID_FOUND=1
    )
) else (
    echo [ERROR] RAZORPAY_KEY_ID NOT found in .env
)

findstr /C:"RAZORPAY_KEY_SECRET" .env >nul
if %errorlevel% equ 0 (
    echo [OK] RAZORPAY_KEY_SECRET found in .env
    for /f "tokens=2 delims==" %%a in ('findstr /C:"RAZORPAY_KEY_SECRET" .env') do (
        set KEY_SECRET=%%a
        set KEY_SECRET=!KEY_SECRET: =!
        if "!KEY_SECRET!"=="" (
            echo      WARNING: Value is empty!
        ) else (
            echo      Value: (hidden for security - !KEY_SECRET:~0,5!...)
        )
        set KEY_SECRET_FOUND=1
    )
) else (
    echo [ERROR] RAZORPAY_KEY_SECRET NOT found in .env
)

echo.
echo ========================================
echo Summary:
echo ========================================
if !KEY_ID_FOUND! equ 1 (
    echo [OK] RAZORPAY_KEY_ID: Found
) else (
    echo [ERROR] RAZORPAY_KEY_ID: Missing
)

if !KEY_SECRET_FOUND! equ 1 (
    echo [OK] RAZORPAY_KEY_SECRET: Found
) else (
    echo [ERROR] RAZORPAY_KEY_SECRET: Missing
)

echo.
echo ========================================
echo Expected values in .env file:
echo ========================================
echo RAZORPAY_KEY_ID=rzp_test_RbG4vPywUm6x4a
echo RAZORPAY_KEY_SECRET=cgLF2uaRJph5KYSQb1J2unrV
echo.
echo ========================================
echo.
echo To edit .env file, run: notepad .env
echo.
pause

