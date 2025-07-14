# Park N Joy - Mobile App Build Instructions

## Prerequisites
1. **Export to GitHub**: Click the "Export to GitHub" button in Lovable and clone the repository
2. **Install Dependencies**: Run `npm install` in the project directory
3. **Android Studio**: Install Android Studio for Android APK generation
4. **Xcode**: Install Xcode on macOS for iOS builds (optional)

## Build Process

### 1. Initialize Capacitor
```bash
# If not already done
npx cap init
```

### 2. Add Mobile Platforms
```bash
# Add Android platform
npx cap add android

# Add iOS platform (macOS only)
npx cap add ios
```

### 3. Build Web Assets
```bash
npm run build
```

### 4. Sync to Native Platforms
```bash
npx cap sync
```

### 5. Configure Android Build
```bash
npx cap open android
```

In Android Studio:
- Set minimum SDK version to 24 (Android 7.0)
- Configure signing certificates for release builds
- Enable USB debugging on test device

### 6. Generate APK/AAB

#### Debug APK (for testing):
```bash
npx cap run android
```

#### Release APK:
1. In Android Studio: Build > Generate Signed Bundle/APK
2. Choose APK format
3. Create or use existing keystore
4. Build release APK

### 7. iOS Build (macOS only)
```bash
npx cap run ios
```

## Features Included in Build

### ✅ Core Features
- [x] Official Joy character with uploaded asset
- [x] Real-time Joy assistant with voice capabilities
- [x] Mapbox integration (requires API key setup)
- [x] GPS-based location services
- [x] Complete onboarding flow with skip functionality
- [x] Joy Points tracking system
- [x] Kids in Car mode
- [x] Rayne's Way (shade-based routing)
- [x] Contributor system with image upload
- [x] Emergency mode functionality
- [x] Referral system architecture
- [x] Admin panel (accessible at /admin)

### 🔧 Configuration Required
- **Mapbox Token**: Add `MAPBOX_ACCESS_TOKEN` to Supabase Edge Function Secrets
- **Camera Permissions**: Android manifest includes camera permissions
- **Location Permissions**: GPS permissions configured for real-time location

### 📱 Mobile Optimizations
- Touch-friendly interface with minimum 44px touch targets
- Responsive design for all screen sizes
- Native splash screen configuration
- Hardware back button support
- Status bar styling
- Safe area handling for notched devices

## Testing Instructions

### Development Testing
1. Enable USB debugging on Android device
2. Run `npx cap run android --livereload` for hot reload
3. Test all features including GPS, camera, and voice

### Production Testing
1. Install release APK on test devices
2. Test offline functionality
3. Verify GPS accuracy and map loading
4. Test Joy assistant voice responses
5. Verify camera functionality for pin submissions

## Distribution

### Android
- **Play Store**: Upload AAB bundle to Google Play Console
- **Direct Install**: Share APK file for sideloading
- **QR Code**: Generate QR code linking to APK download

### iOS
- **App Store**: Submit through Xcode to App Store Connect
- **TestFlight**: Distribute beta builds via TestFlight
- **Enterprise**: Configure enterprise distribution if applicable

## Troubleshooting

### Common Issues
1. **Build Errors**: Ensure all dependencies are installed and Android SDK is configured
2. **GPS Issues**: Check location permissions in device settings
3. **Camera Issues**: Verify camera permissions in app settings
4. **Voice Issues**: Check microphone permissions and device audio settings

### Support
- Review Capacitor documentation: https://capacitorjs.com/docs
- Check Android build guide: https://capacitorjs.com/docs/android
- iOS build guide: https://capacitorjs.com/docs/ios

## App Credentials
- **App ID**: app.lovable.8ff9b988c2254c3989d9186d7ff4480b
- **App Name**: park-n-joy
- **Admin Login**: Username: admin, Password: parknjoy2024

---
**Ready for Production**: Park N Joy is configured for immediate deployment to real devices with full feature functionality.