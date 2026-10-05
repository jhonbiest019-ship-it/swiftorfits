@echo off
title SwiftOrbits USA Full-Stack Marketplace & Merchant ERP
echo ======================================================================
echo   Starting SwiftOrbits USA Realtime Backend Engine & PostgreSQL API
echo ======================================================================
start "SwiftOrbits Backend API (Port 4000)" cmd /k "cd /d %~dp0backend && npm start"

echo.
echo Waiting 2 seconds for backend initialization...
timeout /t 2 /nobreak >nul

echo ======================================================================
echo   Starting SwiftOrbits Real-Time Auto-Sync Engine (GitHub -> Vercel)
echo ======================================================================
start "SwiftOrbits Auto-Sync (GitHub -> Vercel)" cmd /k "cd /d %~dp0 && node live-sync.js"

echo ======================================================================
echo   Starting SwiftOrbits Frontend Storefront (Vite Dev Server)
echo ======================================================================
echo.
echo Opening browser at http://localhost:5173/ ...
start http://localhost:5173/
cmd /c "npm run dev -- --host"
pause
