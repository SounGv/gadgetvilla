@echo off
cd /d "%~dp0"

where git >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Git not installed. Get it: https://git-scm.com/download/win
  pause
  exit /b 1
)

if exist ".git" rmdir /s /q ".git"

git config --global user.email "soun.gv@gadgetvilla.co.th"
git config --global user.name "SounGv"

git init
git add .
git commit -m "GADGET VILLA e-commerce"
git branch -M main
git remote remove origin >nul 2>nul
git remote add origin https://github.com/SounGv/gadgetvilla.git

echo.
echo Pushing to GitHub (a browser sign-in window may appear)...
git push -u origin main --force

echo.
echo ==== DONE. Open https://github.com/SounGv/gadgetvilla to check ====
pause
