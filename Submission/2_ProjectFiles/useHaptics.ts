import { useState, useCallback, useEffect, useRef } from 'react';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type HapticPattern = 'wave' | 'pulse' | 'alternating';

const INHALE_DURATION = 4000; // 4 seconds
const EXHALE_DURATION = 6000; // 6 seconds

export const useHaptics = () => {
    const [currentPattern, setCurrentPattern] = useState<HapticPattern>('wave');
    const cancelledRef = useRef(false);

    // Load saved pattern from settings
    useEffect(() => {
        const loadPattern = async () => {
            try {
                const saved = await AsyncStorage.getItem('@settings');
                if (saved) {
                    const settings = JSON.parse(saved);
                    if (settings.hapticPattern) {
                        setCurrentPattern(settings.hapticPattern);
                    }
                }
            } catch (error) {
                console.error('Failed to load haptic pattern:', error);
            }
        };
        loadPattern();
    }, []);

    const triggerHaptic = useCallback(async (intensity: 'light' | 'medium' | 'heavy') => {
        if (cancelledRef.current) return; // Stop if cancelled
        if (Platform.OS === 'ios') {
            const style =
                intensity === 'light'
                    ? Haptics.ImpactFeedbackStyle.Light
                    : intensity === 'medium'
                        ? Haptics.ImpactFeedbackStyle.Medium
                        : Haptics.ImpactFeedbackStyle.Heavy;
            await Haptics.impactAsync(style);
        } else {
            // Android
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
    }, []);

    const playWavePattern = useCallback(
        async (phase: 'inhale' | 'exhale') => {
            if (phase === 'inhale') {
                // Gradual intensity increase over 4 seconds
                // Trigger at 0s, 1.3s, 2.6s, 4s
                if (cancelledRef.current) return;
                await triggerHaptic('light');
                await new Promise((resolve) => setTimeout(resolve, 1300));
                if (cancelledRef.current) return;
                await triggerHaptic('medium');
                await new Promise((resolve) => setTimeout(resolve, 1300));
                if (cancelledRef.current) return;
                await triggerHaptic('heavy');
                await new Promise((resolve) => setTimeout(resolve, 1400));
                if (cancelledRef.current) return;
                await triggerHaptic('heavy'); // Final pulse at end
            } else {
                // Gradual intensity decrease over 6 seconds
                if (cancelledRef.current) return;
                await triggerHaptic('heavy');
                await new Promise((resolve) => setTimeout(resolve, 2000));
                if (cancelledRef.current) return;
                await triggerHaptic('medium');
                await new Promise((resolve) => setTimeout(resolve, 2000));
                if (cancelledRef.current) return;
                await triggerHaptic('light');
                await new Promise((resolve) => setTimeout(resolve, 2000));
                if (cancelledRef.current) return;
                await triggerHaptic('light');
            }
        },
        [triggerHaptic]
    );

    const playPulsePattern = useCallback(
        async (phase: 'inhale' | 'exhale') => {
            if (phase === 'inhale') {
                // Light pulse every 500ms (8 pulses)
                for (let i = 0; i < 8; i++) {
                    if (cancelledRef.current) return;
                    await triggerHaptic('light');
                    await new Promise((resolve) => setTimeout(resolve, 500));
                }
            } else {
                // Medium pulse every 750ms (8 pulses)
                for (let i = 0; i < 8; i++) {
                    if (cancelledRef.current) return;
                    await triggerHaptic('medium');
                    await new Promise((resolve) => setTimeout(resolve, 750));
                }
            }
        },
        [triggerHaptic]
    );

    const playAlternatingPattern = useCallback(
        async (phase: 'inhale' | 'exhale') => {
            if (phase === 'inhale') {
                // Heavy → None → Heavy (alternating 1s)
                for (let i = 0; i < 4; i++) {
                    if (cancelledRef.current) return;
                    await triggerHaptic('heavy');
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }
            } else {
                // Medium → None → Medium (alternating 1.5s)
                for (let i = 0; i < 4; i++) {
                    if (cancelledRef.current) return;
                    await triggerHaptic('medium');
                    await new Promise((resolve) => setTimeout(resolve, 1500));
                }
            }
        },
        [triggerHaptic]
    );

    const playHapticForPhase = useCallback(
        async (phase: 'inhale' | 'exhale') => {
            // Immediate feedback - trigger haptic instantly
            cancelledRef.current = false; // Reset cancel flag
            await triggerHaptic('light'); // Instant response

            // Then play the full pattern
            switch (currentPattern) {
                case 'wave':
                    await playWavePattern(phase);
                    break;
                case 'pulse':
                    await playPulsePattern(phase);
                    break;
                case 'alternating':
                    await playAlternatingPattern(phase);
                    break;
            }
        },
        [currentPattern, playWavePattern, playPulsePattern, playAlternatingPattern, triggerHaptic]
    );

    const stopHaptics = useCallback(() => {
        cancelledRef.current = true;
        // Reset after a short delay
        setTimeout(() => {
            cancelledRef.current = false;
        }, 100);
    }, []);

    return {
        currentPattern,
        setCurrentPattern,
        playHapticForPhase,
        triggerHaptic,
        stopHaptics,
    };
};
