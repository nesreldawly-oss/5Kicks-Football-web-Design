@echo off
REM Start both backend (Spring Boot) and frontend (Vite React) without touching frontend code

SETLOCAL
SET ROOT=%~dp0

echo Starting 5Kicks Football Platform...
echo Backend: Spring Boot (default port 8080)
echo Frontend: Vite dev server (default port 5173)
echo Make sure MySQL is running and database is created using database\\football_platform_mysql.sql
echo.

REM --- Start backend in a new window ---
cd /d "%ROOT%backend"
echo Starting backend...
start "5Kicks Backend" mvn spring-boot:run

REM --- Start frontend in a new window ---
cd /d "%ROOT%"
echo Starting frontend...
start "5Kicks Frontend" npm run dev

echo Both frontend and backend have been started (in separate windows).
echo Close this window if you want to stop watching this launcher script.

ENDLOCAL


