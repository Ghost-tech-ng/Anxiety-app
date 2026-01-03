# MindfulMoments

A mobile mental wellness application built with React Native and Expo, designed to help users manage anxiety through evidence-based techniques.

## 🌟 Features

### Advanced Hardware Integration
- **Tremor Detection**: Uses device accelerometer to detect anxiety-related tremors (8.0 m/s² threshold)
- **Haptic Feedback**: Three distinct vibration patterns (Wave, Pulse, Alternating) for breathing guidance
- **Sensor-Based Monitoring**: Real-time motion tracking for automatic intervention

### Core Functionality
- **Guided Breathing Exercises**: 4-second inhale, 6-second exhale with haptic feedback
- **Grounding Techniques**: 5-4-3-2-1 sensory awareness exercise
- **Muscle Relaxation**: Progressive muscle relaxation guide
- **Anxiety Tracking**: Log and monitor anxiety levels over time
- **Emergency Privacy Mode**: Instant screen blackout for discreet use

## 🛠️ Tech Stack

- **Framework**: React Native with Expo SDK 51
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **State Management**: React Hooks
- **Storage**: AsyncStorage
- **Sensors**: expo-sensors (Accelerometer)
- **Haptics**: expo-haptics

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/[your-username]/MindfulMoments.git

# Navigate to project
cd MindfulMoments

# Install dependencies
npm install

# Start development server
npx expo start
```

## 🚀 Running the App

### Development
```bash
npx expo start
```

### Build APK
```bash
eas build -p android --profile preview
```

## 📱 System Requirements

- **Android**: 5.0 (Lollipop) or higher
- **iOS**: 13.0 or higher
- **Node.js**: 18.x or higher
- **npm**: 9.x or higher

## 🎯 Key Features Implementation

### Tremor Detection Algorithm
- 100ms sample rate (10 samples/second)
- Moving average noise filtering
- 3-second sustained threshold
- 15-second cooldown period

### Haptic Patterns
- **Wave**: Gradual intensity increase/decrease
- **Pulse**: Rhythmic light/medium pulses
- **Alternating**: Heavy/medium alternating pattern

### Accessibility
- WCAG AAA compliant
- Screen reader support
- High contrast mode
- Reduced motion support

## 📊 Project Structure

```
MindfulMoments/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation
│   ├── breathe.tsx        # Breathing exercise
│   ├── ground.tsx         # Grounding technique
│   ├── release.tsx        # Muscle relaxation
│   └── settings.tsx       # App settings
├── components/            # Reusable components
│   ├── breathing/         # Breathing components
│   ├── tremor/           # Tremor detection
│   └── ui/               # UI components
├── hooks/                # Custom React hooks
├── services/             # Business logic
├── constants/            # App constants
└── types/                # TypeScript types
```

## 🔒 Permissions

- **VIBRATE**: For haptic feedback
- **ACCELEROMETER**: For tremor detection

## 📄 License

This project is developed as part of an academic assessment for CMP3759 Mobile App Development.

## 👤 Author

George Osemwegie Eghosa
University of Lincoln
2025-2026

## 🙏 Acknowledgments

- Expo team for the excellent framework
- React Native community
- Mental health professionals who informed the design
