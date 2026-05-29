#!/bin/bash

echo "🔧 Rebuilding Android app with native modules..."

# Clear cache
echo "📦 Clearing cache..."
rm -rf .expo
rm -rf node_modules/.cache

# Prebuild native code
echo "🏗️  Prebuilding native code..."
npx expo prebuild --clean --platform android

# Run on Android
echo "🚀 Running on Android..."
npx expo run:android

echo "✅ Done! App should be running on your Android device."
