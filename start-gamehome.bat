@echo off
echo Lancement de GameHome...

REM ---------- FRONTEND ----------
start cmd /k "cd /d %~dp0frontend && npm run dev"

REM ---------- BACKEND ----------
start cmd /k "cd /d %~dp0backend && npm run dev"

REM ---------- OUVERTURE DU NAVIGATEUR ----------
REM Ouvre l'URL dans Chrome (si tu veux forcer Chrome) :
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" "http://localhost:5173/"

REM Si tu préfères utiliser le navigateur par défaut, remplace la ligne au-dessus par :
REM start "" http://localhost:5173/

echo GameHome est en train de se lancer dans le navigateur...
pause
