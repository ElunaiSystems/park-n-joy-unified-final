#!/bin/bash

# Park N Joy APK Build Script
# This script builds the Android APK for Park N Joy

echo "🚀 Starting Park N Joy APK Build Process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Build web assets first
echo "📦 Building web assets..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Web build failed"
    exit 1
fi

# Check if android directory exists, if not create it
if [ ! -d "android" ]; then
    echo "📱 Android directory not found, adding Android platform..."
    npx cap add android
    if [ $? -ne 0 ]; then
        echo "❌ Failed to add Android platform"
        exit 1
    fi
fi

# Sync Capacitor
echo "🔄 Syncing Capacitor..."
npx cap sync android

if [ $? -ne 0 ]; then
    echo "❌ Capacitor sync failed"
    exit 1
fi

# Navigate to android directory
cd android

# Make gradlew executable
chmod +x gradlew

# Clean previous builds
echo "🧹 Cleaning previous builds..."
./gradlew clean

# Build debug APK
echo "🔨 Building debug APK..."
./gradlew assembleDebug --stacktrace --info

# Check if APK was generated
APK_PATH="app/build/outputs/apk/debug"
if [ -d "$APK_PATH" ]; then
    APK_FILES=$(find "$APK_PATH" -name "*.apk" -type f)
    if [ -n "$APK_FILES" ]; then
        echo "✅ APK Build Successful!"
        echo "📱 Generated APK files:"
        for apk in $APK_FILES; do
            echo "   📁 $(basename "$apk") ($(du -h "$apk" | cut -f1))"
            echo "   🔗 Full path: $(realpath "$apk")"
        done
        
        # Copy APK to project root for easy access
        MAIN_APK=$(find "$APK_PATH" -name "*.apk" -type f | head -1)
        if [ -n "$MAIN_APK" ]; then
            cp "$MAIN_APK" "../park-n-joy-debug.apk"
            echo "📋 APK copied to project root as: park-n-joy-debug.apk"
        fi
    else
        echo "❌ No APK files found in $APK_PATH"
        exit 1
    fi
else
    echo "❌ APK output directory not found: $APK_PATH"
    exit 1
fi

echo "🎉 Build process completed successfully!"
echo ""
echo "📱 To install on your device:"
echo "   adb install park-n-joy-debug.apk"
echo ""
echo "📁 APK location: $(pwd)/$APK_PATH"