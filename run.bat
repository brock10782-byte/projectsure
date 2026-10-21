@echo off
title 100% Customizable Love Website - Reunion Edition
cd /d "%~dp0"
echo ===================================================================
echo   💖 100% Customizable Love Website - 1 Year Reunion Edition 💖
echo   Anniversary Date: 22nd October | Secret Passcode: 2210
echo ===================================================================
echo.
echo Launching your website in the browser...
start "" "http://localhost:8089"
echo.
echo Server is running at http://localhost:8089
echo (Keep this window open while viewing the website)
echo.
python -m http.server 8089
pause
