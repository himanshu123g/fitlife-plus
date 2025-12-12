@echo off
echo ========================================
echo Starting ngrok tunnel for FitLife+
echo ========================================
echo.

REM Check if ngrok exists
if exist "ngrok.exe" (
    echo ngrok found! Starting tunnel...
    echo.
    ngrok.exe http 3000
) else (
    echo ngrok.exe not found in current directory!
    echo.
    echo Please download ngrok:
    echo 1. Go to: https://ngrok.com/download
    echo 2. Click "Download for Windows"
    echo 3. Extract the ZIP file
    echo 4. Copy ngrok.exe to: D:\Fit Life Project\
    echo 5. Run this batch file again
    echo.
    pause
)
