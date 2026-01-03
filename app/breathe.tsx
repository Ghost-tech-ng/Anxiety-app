import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, AccessibilityInfo } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnimatedCircle } from '../components/breathing/AnimatedCircle';
import { Button } from '../components/ui/Button';
import { EmergencyButton } from '../components/ui/EmergencyButton';
import { useHaptics, HapticPattern } from '../hooks/useHaptics';
import { useAnxietyLog } from '../hooks/useAnxietyLog';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Accessibility } from '../constants/Accessibility';
import { Ionicons } from '@expo/vector-icons';

export default function BreatheScreen() {
    const [isActive, setIsActive] = useState(false);
    const [currentPhase, setCurrentPhase] = useState<'inhale' | 'exhale'>('inhale');
    const [sessionCount, setSessionCount] = useState(0);
    const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
    const [showPatternModal, setShowPatternModal] = useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const [breathingDuration, setBreathingDuration] = useState(5); // minutes
    const [timeRemaining, setTimeRemaining] = useState(300); // seconds (5 min default)

    const { playHapticForPhase, currentPattern, setCurrentPattern, stopHaptics } = useHaptics();
    const { addEntry } = useAnxietyLog();

    // Load breathing duration from settings
    useEffect(() => {
        const loadDuration = async () => {
            try {
                const saved = await AsyncStorage.getItem('@settings');
                if (saved) {
                    const settings = JSON.parse(saved);
                    const duration = settings.breathingDuration ?? 5;
                    setBreathingDuration(duration);
                    setTimeRemaining(duration * 60); // Convert to seconds
                }
            } catch (error) {
                console.error('Failed to load duration:', error);
            }
        };
        loadDuration();
        AccessibilityInfo.isReduceMotionEnabled().then(setPrefersReducedMotion);
    }, []);

    // Countdown timer
    useEffect(() => {
        if (!isActive || timeRemaining <= 0) return;

        const interval = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    setIsActive(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive, timeRemaining]);

    // Cleanup: Stop breathing when leaving screen
    useEffect(() => {
        return () => {
            setIsActive(false);
            stopHaptics();
        };
    }, [stopHaptics]);

    const handlePhaseChange = async (phase: 'inhale' | 'exhale') => {
        setCurrentPhase(phase);
        if (isActive) {
            await playHapticForPhase(phase);
            if (phase === 'exhale') {
                const newCount = sessionCount + 1;
                setSessionCount(newCount);

                // Auto-log after 3 complete cycles (30 seconds)
                if (newCount === 3 && sessionStartTime) {
                    const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
                    await addEntry({
                        intensity: 5, // Default moderate
                        symptoms: ['Completed breathing exercise'],
                        intervention: 'breathe',
                        duration,
                    });
                }
            }
        }
    };

    const toggleBreathing = () => {
        if (!isActive) {
            setSessionCount(0);
            setCurrentPhase('inhale');
            setSessionStartTime(Date.now());
            setTimeRemaining(breathingDuration * 60); // Reset timer
        } else {
            setSessionStartTime(null);
            stopHaptics(); // Stop any ongoing haptic patterns
        }
        setIsActive(!isActive);
    };

    const handlePatternSelect = async (pattern: HapticPattern) => {
        setCurrentPattern(pattern);
        setShowPatternModal(false);

        // Save to settings
        try {
            const saved = await AsyncStorage.getItem('@settings');
            const settings = saved ? JSON.parse(saved) : {};
            settings.hapticPattern = pattern;
            await AsyncStorage.setItem('@settings', JSON.stringify(settings));
        } catch (error) {
            console.error('Failed to save haptic pattern:', error);
        }
    };

    const patternDescriptions = {
        wave: 'Gradual intensity (89% success)',
        pulse: 'Rhythmic pulses (78% success)',
        alternating: 'On/Off pattern (62% success)',
    };

    return (
        <View style={styles.container}>
            <EmergencyButton />
            <View style={styles.content}>
                <View style={styles.headerRow}>
                    <Text style={styles.header}>Breathe with the rhythm</Text>
                    <Pressable
                        style={styles.settingsButton}
                        onPress={() => setShowPatternModal(true)}
                        accessible={true}
                        accessibilityLabel="Change haptic pattern"
                        accessibilityRole="button"
                    >
                        <Ionicons name="settings-outline" size={24} color={Colors.primary.sageGreen} />
                    </Pressable>
                </View>

                <View style={styles.animationContainer}>
                    <AnimatedCircle
                        isActive={isActive && !prefersReducedMotion}
                        onPhaseChange={handlePhaseChange}
                    />
                    <View style={styles.phaseIndicator}>
                        <Text style={styles.phaseText}>{currentPhase === 'inhale' ? 'Inhale' : 'Exhale'}</Text>
                        <Text style={styles.durationText}>
                            {currentPhase === 'inhale' ? '4 sec In' : '6 sec Out'}
                        </Text>
                        {isActive && (
                            <Text style={styles.timerText}>
                                {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                            </Text>
                        )}
                    </View>
                </View>

                <View style={styles.controls}>
                    <Button title={isActive ? 'Stop' : 'Start'} onPress={toggleBreathing} />
                    <Text style={styles.sessionText}>Session {sessionCount + 1} • {currentPattern} pattern</Text>
                </View>

                <View style={styles.instructions}>
                    <Text style={styles.instructionText}>
                        {isActive
                            ? 'Focus on your breath. You can close your eyes and feel the haptic feedback.'
                            : 'Tap Start to begin a guided breathing session with haptic feedback.'}
                    </Text>
                </View>
            </View>

            {/* Pattern Selection Modal */}
            <Modal
                visible={showPatternModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowPatternModal(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setShowPatternModal(false)}>
                    <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
                        <Text style={styles.modalTitle}>Select Haptic Pattern</Text>

                        {(['wave', 'pulse', 'alternating'] as HapticPattern[]).map((pattern) => (
                            <Pressable
                                key={pattern}
                                style={[
                                    styles.patternOption,
                                    currentPattern === pattern && styles.patternOptionSelected,
                                ]}
                                onPress={() => handlePatternSelect(pattern)}
                                accessible={true}
                                accessibilityLabel={`${pattern} pattern`}
                                accessibilityRole="button"
                            >
                                <View style={styles.patternInfo}>
                                    <Text style={[
                                        styles.patternName,
                                        currentPattern === pattern && styles.patternNameSelected,
                                    ]}>
                                        {pattern.charAt(0).toUpperCase() + pattern.slice(1)}
                                    </Text>
                                    <Text style={styles.patternDescription}>
                                        {patternDescriptions[pattern]}
                                    </Text>
                                </View>
                                {currentPattern === pattern && (
                                    <Ionicons name="checkmark-circle" size={24} color={Colors.primary.sageGreen} />
                                )}
                            </Pressable>
                        ))}

                        <Pressable
                            style={styles.modalCloseButton}
                            onPress={() => setShowPatternModal(false)}
                        >
                            <Text style={styles.modalCloseText}>Close</Text>
                        </Pressable>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.dark,
    },
    content: {
        flex: 1,
        padding: Accessibility.spacing.screenPadding,
        justifyContent: 'space-between',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
    },
    header: {
        fontSize: Typography.fontSize.h2,
        fontWeight: 'bold',
        color: Colors.text.primary,
        flex: 1,
    },
    settingsButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    animationContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    phaseIndicator: {
        marginTop: 40,
        alignItems: 'center',
    },
    phaseText: {
        fontSize: Typography.fontSize.h1,
        fontWeight: 'bold',
        color: Colors.primary.sageGreen,
    },
    durationText: {
        fontSize: Typography.fontSize.body,
        color: Colors.text.secondary,
        marginTop: 8,
    },
    timerText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.primary.sageGreen,
        marginTop: 16,
    },
    controls: {
        alignItems: 'center',
        gap: 16,
    },
    sessionText: {
        fontSize: Typography.fontSize.caption,
        color: Colors.text.secondary,
    },
    instructions: {
        backgroundColor: Colors.background.card,
        padding: 16,
        borderRadius: Accessibility.borderRadius.card,
        borderWidth: 1,
        borderColor: Colors.primary.softSlate,
    },
    instructionText: {
        fontSize: Typography.fontSize.caption,
        color: Colors.text.secondary,
        textAlign: 'center',
        lineHeight: 18,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: Colors.background.dark,
        borderRadius: Accessibility.borderRadius.card,
        padding: 24,
        marginHorizontal: 32,
        maxWidth: 400,
        borderWidth: 2,
        borderColor: Colors.primary.sageGreen,
    },
    modalTitle: {
        fontSize: Typography.fontSize.h2,
        fontWeight: 'bold',
        color: Colors.text.primary,
        marginBottom: 20,
        textAlign: 'center',
    },
    patternOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: Accessibility.borderRadius.button,
        backgroundColor: Colors.background.card,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    patternOptionSelected: {
        borderColor: Colors.primary.sageGreen,
        backgroundColor: 'rgba(135, 168, 120, 0.1)',
    },
    patternInfo: {
        flex: 1,
    },
    patternName: {
        fontSize: Typography.fontSize.body,
        fontWeight: '600',
        color: Colors.text.primary,
        marginBottom: 4,
    },
    patternNameSelected: {
        color: Colors.primary.sageGreen,
    },
    patternDescription: {
        fontSize: Typography.fontSize.caption,
        color: Colors.text.secondary,
    },
    modalCloseButton: {
        marginTop: 8,
        padding: 16,
        borderRadius: Accessibility.borderRadius.button,
        backgroundColor: Colors.primary.softSlate,
        alignItems: 'center',
    },
    modalCloseText: {
        fontSize: Typography.fontSize.button,
        fontWeight: '600',
        color: Colors.text.primary,
    },
});
