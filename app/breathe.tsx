import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnimatedCircle } from '../components/breathing/AnimatedCircle';
import { EmergencyButton } from '../components/ui/EmergencyButton';
import { useHaptics } from '../hooks/useHaptics';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';

const INHALE_DURATION = 4; // seconds
const EXHALE_DURATION = 6; // seconds
const TOTAL_ROUNDS = 5;

export default function BreatheScreen() {
    const [isActive, setIsActive] = useState(false);
    const [currentPhase, setCurrentPhase] = useState<'inhale' | 'exhale'>('inhale');
    const [countdown, setCountdown] = useState(INHALE_DURATION);
    const [currentRound, setCurrentRound] = useState(1);
    const [hapticPattern, setHapticPattern] = useState<string>('wave');

    const { playHapticForPhase, stopHaptics, setCurrentPattern } = useHaptics();
    const phaseStartTimeRef = useRef<number>(0);
    const animationPhaseRef = useRef<'inhale' | 'exhale'>('inhale');

    // Handle phase changes from animation
    const handlePhaseChange = (phase: 'inhale' | 'exhale') => {

        // Prevent duplicate calls for same phase
        if (animationPhaseRef.current === phase) {
            return;
        }

        animationPhaseRef.current = phase;
        setCurrentPhase(phase);
        phaseStartTimeRef.current = Date.now();

        const duration = phase === 'inhale' ? INHALE_DURATION : EXHALE_DURATION;
        setCountdown(duration);

        // Play continuous haptic pattern for this phase
        if (isActive) {
            playHapticForPhase(phase);
        }

        // Increment round when exhale completes (next phase is inhale)
        if (phase === 'inhale' && currentRound < TOTAL_ROUNDS) {
            const newRound = currentRound + 1;
            setCurrentRound(newRound);
        }

        // Check if we've completed all rounds
        if (phase === 'exhale' && currentRound >= TOTAL_ROUNDS) {
            // Stop after this exhale completes
            setTimeout(() => {
                setIsActive(false);
                stopHaptics();
            }, EXHALE_DURATION * 1000);
        }
    };

    // Countdown timer
    useEffect(() => {
        if (!isActive) {
            return;
        }

        const interval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - phaseStartTimeRef.current) / 1000);
            const phaseDuration = currentPhase === 'inhale' ? INHALE_DURATION : EXHALE_DURATION;
            const remaining = Math.max(0, phaseDuration - elapsed);
            setCountdown(remaining);
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [isActive, currentPhase]);

    // Toggle breathing exercise
    const toggleBreathing = () => {
        if (!isActive) {
            setIsActive(true);
            setCurrentPhase('inhale');
            setCountdown(INHALE_DURATION);
            setCurrentRound(1);
            phaseStartTimeRef.current = Date.now();
            animationPhaseRef.current = 'inhale';
        } else {
            setIsActive(false);
            stopHaptics();
            setCurrentPhase('inhale');
            setCountdown(INHALE_DURATION);
            setCurrentRound(1);
            animationPhaseRef.current = 'inhale';
        }
    };

    // Load haptic pattern from settings when screen focuses
    useFocusEffect(
        React.useCallback(() => {
            const loadPattern = async () => {
                try {
                    const saved = await AsyncStorage.getItem('@settings');
                    if (saved) {
                        const settings = JSON.parse(saved);
                        const pattern = settings.hapticPattern || 'wave';
                        setHapticPattern(pattern);
                        setCurrentPattern(pattern);
                    }
                } catch (error) {
                    console.error('Failed to load haptic pattern:', error);
                }
            };
            loadPattern();

            // Return cleanup function that runs when screen loses focus
            return () => {
                setIsActive(false);
                stopHaptics();
            };
        }, [stopHaptics, setCurrentPattern])
    );



    return (
        <View style={styles.container}>
            <EmergencyButton />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerText}>Breathe with the rhythm</Text>
            </View>

            {/* Main breathing area */}
            <View style={styles.breathingArea}>
                {/* Phase indicator */}
                <Text style={[
                    styles.phaseText,
                    currentPhase === 'inhale' && styles.phaseTextInhale
                ]}>
                    {currentPhase === 'inhale' ? 'Inhale' : 'Exhale'}
                </Text>

                {/* Animated circle with countdown */}
                <View style={styles.circleContainer}>
                    <AnimatedCircle
                        isActive={isActive}
                        onPhaseChange={handlePhaseChange}
                    />
                    <View style={styles.countdownOverlay}>
                        <Text style={styles.countdownNumber}>{countdown}</Text>
                    </View>
                </View>

                {/* Duration indicator */}
                <Text style={styles.durationText}>
                    {INHALE_DURATION} sec in / {EXHALE_DURATION} sec out
                </Text>

                {/* Haptic pattern indicator */}
                <Text style={styles.patternText}>
                    Pattern: {hapticPattern.charAt(0).toUpperCase() + hapticPattern.slice(1)}
                </Text>

                {/* Round counter */}
                <Text style={styles.roundText}>
                    Round {Math.min(currentRound, TOTAL_ROUNDS)} of {TOTAL_ROUNDS}
                </Text>

                {/* Progress bar */}
                <View style={styles.progressBarContainer}>
                    <View
                        style={[
                            styles.progressBar,
                            { width: `${(currentRound / TOTAL_ROUNDS) * 100}%` }
                        ]}
                    />
                </View>
            </View>

            {/* Control button */}
            <View style={styles.buttonContainer}>
                <Pressable
                    style={styles.controlButton}
                    onPress={toggleBreathing}
                >
                    <Text style={styles.controlButtonText}>
                        {isActive ? 'Pause' : 'Start'}
                    </Text>
                </Pressable>
            </View>

            {/* Bottom spacing */}
            <View style={styles.bottomSpacer} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.dark,
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 24,
        paddingBottom: 20,
        alignItems: 'center',
    },
    headerText: {
        fontSize: Typography.fontSize.h2,
        fontWeight: '600',
        color: Colors.text.primary,
    },
    breathingArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    phaseText: {
        fontSize: Typography.fontSize.h3,
        fontWeight: '600',
        color: Colors.text.secondary,
        marginBottom: 40,
    },
    phaseTextInhale: {
        color: Colors.accent.orange,
    },
    circleContainer: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    countdownOverlay: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    countdownNumber: {
        fontSize: 72,
        fontWeight: 'bold',
        color: Colors.text.primary,
    },
    durationText: {
        fontSize: Typography.fontSize.caption,
        color: Colors.text.secondary,
        marginBottom: 4,
    },
    patternText: {
        fontSize: Typography.fontSize.caption,
        color: Colors.primary.sageGreen,
        marginBottom: 8,
        fontWeight: '600',
    },
    roundText: {
        fontSize: Typography.fontSize.caption,
        color: Colors.text.tertiary,
        marginBottom: 16,
    },
    progressBarContainer: {
        width: '80%',
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: Colors.primary.sageGreen,
        borderRadius: 2,
    },
    buttonContainer: {
        paddingHorizontal: 24,
        paddingBottom: 20,
    },
    controlButton: {
        backgroundColor: Colors.background.card,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    controlButtonText: {
        fontSize: Typography.fontSize.button,
        fontWeight: '600',
        color: Colors.text.primary,
    },
    bottomSpacer: {
        height: 40,
    },
});
