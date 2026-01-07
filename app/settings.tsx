import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EmergencyButton } from '../components/ui/EmergencyButton';
import { Button } from '../components/ui/Button';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Accessibility } from '../constants/Accessibility';
import { Ionicons } from '@expo/vector-icons';
import { HapticPattern } from '../hooks/useHaptics';

interface Settings {
    hapticPattern: HapticPattern;
    tremorSensitivity: 'low' | 'medium' | 'high';
    tremorDetectionEnabled: boolean;
    breathingRate: number; // 4-8 BPM
}

const DEFAULT_SETTINGS: Settings = {
    hapticPattern: 'wave',
    tremorSensitivity: 'medium',
    tremorDetectionEnabled: true, // Enabled by default
    breathingRate: 6,
};

export default function SettingsScreen() {
    const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const saved = await AsyncStorage.getItem('@settings');
            if (saved) {
                const parsedSettings = JSON.parse(saved);
                setSettings({ ...DEFAULT_SETTINGS, ...parsedSettings });
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    };

    const saveSettings = async (newSettings: Settings) => {
        try {
            setIsSaving(true);
            await AsyncStorage.setItem('@settings', JSON.stringify(newSettings));
            setSettings(newSettings);
            setTimeout(() => setIsSaving(false), 500);
        } catch (error) {
            console.error('Failed to save settings:', error);
            setIsSaving(false);
        }
    };

    const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
        const newSettings = { ...settings, [key]: value };
        saveSettings(newSettings);
    };

    const clearHistory = async () => {
        try {
            const logs = await AsyncStorage.getItem('@mindfulmoments_anxiety_log');
            if (!logs || JSON.parse(logs).length === 0) {
                Alert.alert('Info', 'History is already empty.');
                return;
            }

            Alert.alert(
                'Clear History',
                'Are you sure you want to delete all your anxiety logs? This cannot be undone.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: async () => {
                            try {
                                await AsyncStorage.removeItem('@mindfulmoments_anxiety_log');
                                // Force a small delay to ensure UI updates if needed
                                setTimeout(() => {
                                    Alert.alert('Success', 'History cleared successfully.');
                                }, 100);
                            } catch (error) {
                                Alert.alert('Error', 'Failed to clear history. Please try again.');
                            }
                        },
                    },
                ]
            );
        } catch (error) {
            console.error('Error checking history:', error);
        }
    };

    return (
        <View style={styles.container}>
            <EmergencyButton />
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.header}>Settings</Text>

                {/* Haptic Pattern */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Haptic Feedback Pattern</Text>
                    <Text style={styles.sectionDescription}>
                        Choose the vibration pattern for breathing exercises
                    </Text>
                    {(['wave', 'pulse', 'alternating'] as HapticPattern[]).map((pattern) => (
                        <Pressable
                            key={pattern}
                            style={[
                                styles.option,
                                settings.hapticPattern === pattern && styles.optionSelected,
                            ]}
                            onPress={() => updateSetting('hapticPattern', pattern)}
                        >
                            <View style={styles.optionContent}>
                                <Text style={[
                                    styles.optionText,
                                    settings.hapticPattern === pattern && styles.optionTextSelected,
                                ]}>
                                    {pattern.charAt(0).toUpperCase() + pattern.slice(1)}
                                </Text>
                            </View>
                            {settings.hapticPattern === pattern && (
                                <Ionicons name="checkmark-circle" size={24} color={Colors.primary.sageGreen} />
                            )}
                        </Pressable>
                    ))}
                </View>

                {/* Breathing Rate */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Breathing Rate</Text>
                    <Text style={styles.sectionDescription}>
                        Breaths per minute (4-8 BPM)
                    </Text>
                    <View style={styles.rateContainer}>
                        <Pressable
                            style={styles.rateButton}
                            onPress={() => updateSetting('breathingRate', Math.max(4, settings.breathingRate - 1))}
                        >
                            <Ionicons name="remove" size={24} color={Colors.text.primary} />
                        </Pressable>
                        <Text style={styles.rateValue}>{settings.breathingRate} BPM</Text>
                        <Pressable
                            style={styles.rateButton}
                            onPress={() => updateSetting('breathingRate', Math.min(8, settings.breathingRate + 1))}
                        >
                            <Ionicons name="add" size={24} color={Colors.text.primary} />
                        </Pressable>
                    </View>
                </View>

                {/* Tremor Detection */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Tremor Detection</Text>
                    <Text style={styles.sectionDescription}>
                        Automatically detect hand tremors using accelerometer
                    </Text>
                    <Pressable
                        style={[
                            styles.toggle,
                            settings.tremorDetectionEnabled && styles.toggleActive,
                        ]}
                        onPress={() => updateSetting('tremorDetectionEnabled', !settings.tremorDetectionEnabled)}
                    >
                        <Text style={styles.toggleText}>
                            {settings.tremorDetectionEnabled ? 'Enabled' : 'Disabled'}
                        </Text>
                    </Pressable>

                    {settings.tremorDetectionEnabled && (
                        <>
                            <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Sensitivity</Text>
                            {(['low', 'medium', 'high'] as const).map((sensitivity) => (
                                <Pressable
                                    key={sensitivity}
                                    style={[
                                        styles.option,
                                        settings.tremorSensitivity === sensitivity && styles.optionSelected,
                                    ]}
                                    onPress={() => updateSetting('tremorSensitivity', sensitivity)}
                                >
                                    <Text style={[
                                        styles.optionText,
                                        settings.tremorSensitivity === sensitivity && styles.optionTextSelected,
                                    ]}>
                                        {sensitivity.charAt(0).toUpperCase() + sensitivity.slice(1)}
                                    </Text>
                                    {settings.tremorSensitivity === sensitivity && (
                                        <Ionicons name="checkmark-circle" size={24} color={Colors.primary.sageGreen} />
                                    )}
                                </Pressable>
                            ))}
                        </>
                    )}
                </View>

                {/* Privacy & Data */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Privacy & Data</Text>
                    <Text style={styles.sectionDescription}>
                        Manage your local data
                    </Text>
                    <Pressable
                        style={styles.dangerButton}
                        onPress={clearHistory}
                    >
                        <Text style={styles.dangerButtonText}>Clear History</Text>
                    </Pressable>
                </View>

                {isSaving && (
                    <Text style={styles.savedText}>✓ Settings saved</Text>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.dark,
    },
    content: {
        padding: Accessibility.spacing.screenPadding,
    },
    header: {
        fontSize: Typography.fontSize.h1,
        fontWeight: 'bold',
        color: Colors.text.primary,
        marginBottom: 24,
        marginTop: 20,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: Typography.fontSize.h2,
        fontWeight: '600',
        color: Colors.text.primary,
        marginBottom: 8,
    },
    sectionDescription: {
        fontSize: Typography.fontSize.caption,
        color: Colors.text.secondary,
        marginBottom: 16,
        lineHeight: 18,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: Accessibility.borderRadius.button,
        backgroundColor: Colors.background.card,
        marginBottom: 8,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    optionSelected: {
        borderColor: Colors.primary.sageGreen,
        backgroundColor: 'rgba(135, 168, 120, 0.1)',
    },
    optionContent: {
        flex: 1,
    },
    optionText: {
        fontSize: Typography.fontSize.body,
        color: Colors.text.primary,
    },
    optionTextSelected: {
        color: Colors.primary.sageGreen,
        fontWeight: '600',
    },
    rateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
    },
    rateButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.primary.sageGreen,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rateValue: {
        fontSize: Typography.fontSize.h1,
        fontWeight: 'bold',
        color: Colors.text.primary,
        minWidth: 100,
        textAlign: 'center',
    },
    toggle: {
        padding: 16,
        borderRadius: Accessibility.borderRadius.button,
        backgroundColor: Colors.background.card,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.primary.softSlate,
    },
    toggleActive: {
        backgroundColor: 'rgba(135, 168, 120, 0.2)',
        borderColor: Colors.primary.sageGreen,
    },
    toggleText: {
        fontSize: Typography.fontSize.body,
        fontWeight: '600',
        color: Colors.text.primary,
    },
    savedText: {
        fontSize: Typography.fontSize.caption,
        color: Colors.primary.sageGreen,
        textAlign: 'center',
        marginTop: 8,
    },
    dangerButton: {
        padding: 16,
        borderRadius: Accessibility.borderRadius.button,
        backgroundColor: 'rgba(235, 87, 87, 0.1)',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EB5757',
        marginTop: 8,
    },
    dangerButtonText: {
        fontSize: Typography.fontSize.button,
        fontWeight: '600',
        color: '#EB5757',
    },
});
