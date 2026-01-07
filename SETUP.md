# MindfulMoments - Setup Instructions

**Author:** Norbert Chidubem George  
**Module:** CMP3759 - Mobile Application Development

---

## 📋 Prerequisites

- **Node.js**: v18.17.0 or higher
- **npm**: v9.0.0 or higher
- **Expo Go app** (iOS/Android)

---

## 🚀 Installation

### 1. Install Dependencies

```bash
npm install --legacy-peer-deps
```

**Note:** The `--legacy-peer-deps` flag is required for React Native peer dependencies.

### 2. Start Development Server

```bash
npx expo start --clear
```

### 3. Run on Device

- Install **Expo Go** from App Store (iOS) or Play Store (Android)
- Scan the QR code in terminal
- App will load on your device

---

## 📦 Project Structure

```
MindfulMoments/
├── app/                    # Expo Router screens
├── components/             # Reusable UI components
├── hooks/                  # Custom React hooks
├── services/               # Business logic
├── constants/              # App-wide constants
├── types/                  # TypeScript types
├── assets/                 # Images, fonts
├── package.json            # Dependencies
├── app.json               # Expo config
└── index.ts               # Entry point
```

---

## 🔧 Key Dependencies

- `expo`: ~54.0.30
- `react`: 19.1.0
- `react-native`: 0.81.5
- `expo-haptics`: ~15.0.8 (Haptic feedback)
- `expo-sensors`: ~15.0.8 (Tremor detection)
- `@react-native-async-storage/async-storage`: 1.23.1

Full list in `package.json`

---

## ✅ Testing

See `docs/TESTING_REPORT.md` for:
- 44 test cases (100% pass rate)
- Platform testing (iOS & Android)
- Accessibility compliance

---

## 🐛 Troubleshooting

**"Module not found" errors:**
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

**Metro bundler cache:**
```bash
npx expo start --clear
```

**Haptics not working:**
- iOS: Physical device required (not simulator)
- Android: Some devices have limited haptic support

---

## 📚 Documentation

- **API Documentation**: `docs/API_DOCUMENTATION.md`
- **Testing Report**: `docs/TESTING_REPORT.md`
- **Assessment Report**: `docs/Assessment2_Report.md`

---

## 🎯 Key Features

1. Guided Breathing with haptic feedback
2. Tremor Detection via accelerometer
3. Anxiety Tracking & PDF export
4. Offline support
5. WCAG AAA accessibility

---

**Version**: 1.0.0  
**Expo SDK**: 54  
**Last Updated**: January 6, 2026
