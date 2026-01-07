# MindfulMoments - Setup Guide

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo Go app on your mobile device (iOS/Android)

## Installation Steps

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Start Development Server
```bash
npx expo start
```

### 3. Run on Device
- Scan the QR code with Expo Go (Android) or Camera app (iOS)
- The app will load on your device

## Project Structure
```
MindfulMoments/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation screens
│   ├── breathe.tsx        # Breathing exercise
│   ├── ground.tsx         # Grounding exercise
│   ├── release.tsx        # Release exercise
│   ├── check-in.tsx       # Anxiety check-in
│   ├── settings.tsx       # App settings
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── breathing/         # Breathing exercise components
│   ├── tremor/            # Tremor detection components
│   └── ui/                # UI components
├── hooks/                 # Custom React hooks
│   ├── useHaptics.ts      # Haptic feedback patterns
│   ├── useTremorDetection.ts  # Tremor detection logic
│   └── useAnxietyLog.ts   # Anxiety tracking
├── services/              # Business logic
│   └── sensorService.ts   # Accelerometer & tremor detection
├── constants/             # App constants (colors, typography)
├── types/                 # TypeScript type definitions
└── docs/                  # Documentation

## Key Features Implemented

### 1. Variance-Based Tremor Detection
- **Algorithm**: Detects motion changes (variance) instead of absolute magnitude
- **Thresholds**: 
  - Low: 0.35 (less sensitive)
  - Medium: 0.25 (balanced - default)
  - High: 0.18 (most sensitive)
- **Duration**: 2 seconds sustained shaking
- **Location**: `services/sensorService.ts`

### 2. Adjustable Sensitivity Settings
- Users can change tremor detection sensitivity in Settings
- Settings persist via AsyncStorage
- Live updates (reloads every 500ms)

### 3. Instant Haptic Feedback
- Triggers immediately at phase start (no delay)
- Three patterns: Wave, Pulse, Alternating
- Location: `hooks/useHaptics.ts`

### 4. Breathing Exercises
- Guided breathing with visual circle animation
- Adjustable breathing rate (4-8 BPM)
- Haptic feedback synchronized with breathing phases

### 5. Anxiety Tracking
- Log anxiety levels and symptoms
- View history and trends
- Export functionality

## Technical Details

### SDK Version
- Expo SDK 54
- React Native 0.81.5
- expo-router 6.0.14 (downgraded to fix navigation bug)

### Dependencies
All dependencies are specified in `package.json`. The `--legacy-peer-deps` flag is required due to peer dependency conflicts in Expo SDK 54.

### Tremor Detection Algorithm
The app uses a variance-based algorithm to detect tremors:

1. **Calculate magnitude** of raw accelerometer data (including gravity)
2. **Maintain sliding window** of 10 magnitude samples
3. **Calculate variance** (standard deviation) of the window
4. **Compare variance** to sensitivity threshold
5. **Trigger alert** if variance exceeds threshold for 2+ seconds

This approach avoids the unreliable gravity filtering and works regardless of phone orientation.

## Troubleshooting

### "Couldn't find prevent remove context" Error
This was fixed by:
- Downgrading expo-router from 6.0.21 to 6.0.14
- Removing EmergencyProvider wrapper from `_layout.tsx`

### Tremor Detection Not Working
- Ensure tremor detection is enabled in Settings
- Try adjusting sensitivity (High is most sensitive)
- Shake the phone deliberately for 2+ seconds

### Haptic Feedback Not Working
- Ensure device supports haptics (most modern phones do)
- Check device is not in silent mode (iOS)

## Building for Production

### APK Build (Android)
```bash
eas build --platform android --profile production
```

The `eas.json` is configured to build APK files (not AAB) for easy distribution.

## Support
For issues or questions, refer to the documentation in the `docs/` folder.
