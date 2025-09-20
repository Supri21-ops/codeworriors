@echo off
echo Starting CodeWarrior Frontend Development Server...
echo.
echo This will start the Vite dev server with proper host configuration
echo The application should be accessible on both:
echo - http://localhost:5173
echo - http://[your-ip]:5173
echo.

cd /d "d:\hackathon\codewarrior\Frontend"

echo Checking if package.json exists...
if not exist package.json (
    echo ERROR: package.json not found!
    echo Current directory: %CD%
    pause
    exit /b 1
)

echo Installing dependencies if needed...
call npm install

echo.
echo Starting development server...
call npm run dev

pause