@echo off
title Kushal Tiwari - Game Portfolio
echo ========================================================
echo   Launching Kushal Tiwari's Playable Game Portfolio
echo ========================================================
cd /d "%~dp0"
echo Opening browser at http://localhost:3000 ...
timeout /t 2 /nobreak >nul
start http://localhost:3000
node server.js
pause
