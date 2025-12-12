@echo off
echo ========================================
echo Starting FitLife+ Backend Server
echo ========================================
cd /d "D:\Fit Life Project\backend"
echo.
echo Current directory: %CD%
echo.
echo Checking for node_modules...
if not exist "node_modules" (
    echo node_modules not found. Installing dependencies...
    call npm install
    echo.
) else (
    echo Dependencies already installed.
    echo.
)
echo.
echo Starting backend server on port 5000...
echo Press Ctrl+C to stop the server
echo.
call npm run dev

