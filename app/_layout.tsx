import { Stack } from 'expo-router';
import { EmergencyProvider } from '../components/ui/EmergencyButton';
import { OfflineIndicator } from '../components/ui/OfflineIndicator';
import { TremorAlert } from '../components/tremor/TremorAlert';
import { useTremorDetection } from '../hooks/useTremorDetection';
import { Colors } from '../constants/Colors';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
    const [tremorEnabled, setTremorEnabled] = useState(true);
    const [tremorSensitivity, setTremorSensitivity] = useState<'low' | 'medium' | 'high'>('medium');

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const saved = await AsyncStorage.getItem('@settings');
                if (saved) {
                    const settings = JSON.parse(saved);
                    const enabled = settings.tremorDetectionEnabled ?? true;
                    const sensitivity = settings.tremorSensitivity ?? 'medium';
                    setTremorEnabled(enabled);
                    setTremorSensitivity(sensitivity);
                }
            } catch (error) {
                console.error('Failed to load tremor settings:', error);
            }
        };

        loadSettings();
        const interval = setInterval(loadSettings, 500);
        return () => clearInterval(interval);
    }, []);

    const { isTremorDetected, resetTremorDetection } = useTremorDetection(tremorEnabled, tremorSensitivity);

    return (
        <EmergencyProvider>
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: Colors.background.dark,
                    },
                    headerTintColor: Colors.text.primary,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    contentStyle: {
                        backgroundColor: Colors.background.dark,
                    },
                }}
            >
                <Stack.Screen name="(tabs)" options={{ headerShown: false, title: '' }} />
                <Stack.Screen name="breathe" options={{ title: 'Breathe' }} />
                <Stack.Screen name="ground" options={{ title: 'Ground' }} />
                <Stack.Screen name="release" options={{ title: 'Release' }} />
                <Stack.Screen name="check-in" options={{ title: 'Check In' }} />
                <Stack.Screen name="settings" options={{ title: 'Settings' }} />
            </Stack>
            <OfflineIndicator />
            <TremorAlert visible={isTremorDetected} onDismiss={resetTremorDetection} />
        </EmergencyProvider>
    );
}
