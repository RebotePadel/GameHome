@echo off
echo Lancement de GameHome...

REM ---------- FRONTEND ----------
start cmd /k "cd /d %~dp0frontend && npm run dev"

REM ---------- BACKEND ----------
start cmd /k "cd /d %~dp0backend && npm run dev"

REM ---------- OUVERTURE DU NAVIGATEUR ----------
timeout /t 3 /nobreak >nul
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" "http://localhost:5173/"

echo GameHome est en train de se lancer dans le navigateur...
