@echo off
echo Starting 5Kicks Football Project...
echo ===================================
echo.
echo 1. Starting Backend Server...
start "5Kicks Backend" cmd /k "cd backend && mvn spring-boot:run"
echo Backend starting in new window.
echo.
echo 2. Starting Frontend Web App...
start "5Kicks Frontend" cmd /k "npm run dev"
echo Frontend starting in new window.
echo.
echo ===================================
echo Please wait for the Backend window to show "Started FootballPlatformApplication".
echo Then open your browser to http://localhost:5173
echo.
pause
