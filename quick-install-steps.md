# Quick Installation Steps

## Right Now (Android Studio is opening):

### 1. **Prepare Your Phone** (Do this while Android Studio loads):
- Settings → About Phone → Tap "Build Number" 7 times
- Settings → Developer Options → Enable "USB Debugging"
- Connect phone to computer with USB cable
- Allow USB debugging when prompted

### 2. **In Android Studio** (When it finishes loading):
- Wait for "Gradle sync finished" message
- Look for your phone in device dropdown (top toolbar)
- Click green "Run" button (▶️)

### 3. **Done!**
- App will install and launch automatically on your phone
- Look for "Park N Joy" app icon

## If Phone Not Detected:
```bash
adb devices
```
Should show your device. If not, check USB debugging is enabled.

## Manual Backup Method:
If Android Studio doesn't work, the APK is ready at:
`android/app/build/outputs/apk/debug/app-debug.apk`

Transfer this file to your phone and install manually.