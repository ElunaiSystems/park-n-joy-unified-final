#!/bin/bash

# Ultimate APK Build Script - Comprehensive Error Recovery
echo "🚀 ULTIMATE APK BUILD - COMPREHENSIVE SYSTEM"

# Function to verify environment
verify_environment() {
    echo "🔍 Verifying build environment..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js not found"
        exit 1
    fi
    echo "✅ Node.js: $(node --version)"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        echo "❌ npm not found"
        exit 1
    fi
    echo "✅ npm: $(npm --version)"
    
    # Check project structure
    if [ ! -f "package.json" ]; then
        echo "❌ package.json not found"
        exit 1
    fi
    echo "✅ package.json found"
    
    if [ ! -f "capacitor.config.ts" ]; then
        echo "❌ capacitor.config.ts not found"
        exit 1
    fi
    echo "✅ capacitor.config.ts found"
}

# Function to build web assets
build_web_assets() {
    echo "📦 Building web assets..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ npm install failed"
        exit 1
    fi
    
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ Web build failed"
        exit 1
    fi
    
    if [ ! -d "dist" ]; then
        echo "❌ dist directory not created"
        exit 1
    fi
    echo "✅ Web assets built successfully"
}

# Function to setup Android platform
setup_android_platform() {
    echo "📱 Setting up Android platform..."
    
    # Remove any existing corrupted platform
    if [ -d "android" ]; then
        echo "🗑️ Removing existing Android platform..."
        rm -rf android
    fi
    
    # Add fresh Android platform
    npx cap add android
    if [ $? -ne 0 ]; then
        echo "❌ Failed to add Android platform"
        exit 1
    fi
    
    # Sync Capacitor
    npx cap sync android
    if [ $? -ne 0 ]; then
        echo "❌ Failed to sync Capacitor"
        exit 1
    fi
    
    echo "✅ Android platform setup complete"
}

# Function to build APK with multiple attempts
build_apk_with_recovery() {
    echo "🔨 Building APK with recovery mechanisms..."
    
    cd android
    
    # Make gradlew executable
    chmod +x gradlew
    
    # Create output directories
    mkdir -p app/build/outputs/apk/debug
    mkdir -p app/build/outputs/apk/release
    
    # Attempt 1: Standard build
    echo "🔨 Attempt 1: Standard Gradle build"
    ./gradlew assembleDebug --no-daemon --stacktrace
    
    # Check for APK
    if find . -name "*.apk" -type f | grep -q .; then
        echo "✅ APK generated on first attempt"
        copy_apk_to_root
        return 0
    fi
    
    # Attempt 2: Clean and rebuild
    echo "🔨 Attempt 2: Clean and rebuild"
    ./gradlew clean --no-daemon
    ./gradlew assembleDebug --no-daemon --stacktrace --info
    
    # Check for APK
    if find . -name "*.apk" -type f | grep -q .; then
        echo "✅ APK generated on second attempt"
        copy_apk_to_root
        return 0
    fi
    
    # Attempt 3: Force rebuild with maximum verbosity
    echo "🔨 Attempt 3: Force rebuild with maximum verbosity"
    ./gradlew clean --no-daemon
    ./gradlew assembleDebug --no-daemon --stacktrace --info --debug
    
    # Check for APK
    if find . -name "*.apk" -type f | grep -q .; then
        echo "✅ APK generated on third attempt"
        copy_apk_to_root
        return 0
    fi
    
    echo "❌ All APK build attempts failed"
    cd ..
    return 1
}

# Function to copy APK to project root
copy_apk_to_root() {
    echo "📋 Copying APK to project root..."
    
    # Find any APK file
    APK_FILE=$(find . -name "*.apk" -type f | head -1)
    
    if [ -n "$APK_FILE" ]; then
        cp "$APK_FILE" "../park-n-joy-debug.apk"
        echo "✅ APK copied to: park-n-joy-debug.apk"
        echo "📏 APK size: $(du -h "../park-n-joy-debug.apk" | cut -f1)"
        cd ..
        return 0
    else
        echo "❌ No APK file found to copy"
        cd ..
        return 1
    fi
}

# Function to verify final APK
verify_final_apk() {
    echo "🔍 Final APK verification..."
    
    if [ -f "park-n-joy-debug.apk" ]; then
        APK_SIZE=$(stat -f%z "park-n-joy-debug.apk" 2>/dev/null || stat -c%s "park-n-joy-debug.apk" 2>/dev/null)
        if [ "$APK_SIZE" -gt 1000000 ]; then  # At least 1MB
            echo "✅ APK verification successful!"
            echo "📱 APK ready for installation: park-n-joy-debug.apk"
            echo "📏 Size: $(du -h "park-n-joy-debug.apk" | cut -f1)"
            echo "🔧 Install command: adb install park-n-joy-debug.apk"
            return 0
        else
            echo "❌ APK file too small (${APK_SIZE} bytes)"
            return 1
        fi
    else
        echo "❌ Final APK not found"
        return 1
    fi
}

# Main execution
main() {
    echo "🚀 Starting Ultimate APK Build Process..."
    
    verify_environment
    build_web_assets
    setup_android_platform
    
    if build_apk_with_recovery; then
        if verify_final_apk; then
            echo "🎉 SUCCESS! APK build completed successfully!"
            exit 0
        else
            echo "💥 APK verification failed"
            exit 1
        fi
    else
        echo "💥 APK build failed after all attempts"
        exit 1
    fi
}

# Run main function
main