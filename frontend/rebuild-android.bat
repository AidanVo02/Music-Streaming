@echo off
echo 🔧 Rebuilding Android app with native modules...

REM Clear cache
echo 📦 Clearing cache...
if exist .expo rmdir /s /q .expo
if exist node_modules\.cache rmdir /s /q node_modules\.cache

REM Prebuild native code
echo 🏗️  Prebuilding native code...
call npx expo prebuild --clean --platform android

REM Run on Android
echo 🚀 Running on Android...
call npx expo run:android

echo ✅ Done! App should be running on your Android device.
pause
