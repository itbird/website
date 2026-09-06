@echo off
cd /d "%~dp0"
if not exist node_modules (
  echo Installing the writing studio dependencies...
  call npm ci --no-audit --no-fund
  if errorlevel 1 exit /b 1
)
echo Open http://127.0.0.1:4174/studio in your browser.
call npm start
pause
