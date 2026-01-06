import React, { useEffect, useRef, useCallback } from 'react';
import { Animated, StyleSheet, Easing } from 'react-native';
import { Colors } from '../../constants/Colors';

interface AnimatedCircleProps {
    isActive: boolean;
    onPhaseChange: (phase: 'inhale' | 'exhale') => void;
}

const INHALE_DURATION = 4000; // 4 seconds
const EXHALE_DURATION = 6000; // 6 seconds

export const AnimatedCircle: React.FC<AnimatedCircleProps> = ({ isActive, onPhaseChange }) => {
    const scale = useRef(new Animated.Value(0.5)).current;
    const opacity = useRef(new Animated.Value(0.6)).current;
    const shouldContinue = useRef(isActive);
    const onPhaseChangeRef = useRef(onPhaseChange);

    // Update ref when callback changes (doesn't trigger re-animation)
    useEffect(() => {
        onPhaseChangeRef.current = onPhaseChange;
    }, [onPhaseChange]);

    useEffect(() => {
        shouldContinue.current = isActive;

        if (isActive) {
            const animate = () => {
                if (!shouldContinue.current) {
                    return;
                }

                // Inhale
                console.log('[ANIMATION] Starting INHALE animation (4s)');
                onPhaseChangeRef.current('inhale');
                Animated.parallel([
                    Animated.timing(scale, {
                        toValue: 1.5,
                        duration: INHALE_DURATION,
                        easing: Easing.bezier(0.42, 0, 0.58, 1),
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacity, {
                        toValue: 1.0,
                        duration: INHALE_DURATION,
                        easing: Easing.bezier(0.42, 0, 0.58, 1),
                        useNativeDriver: true,
                    }),
                ]).start(() => {
                    if (!shouldContinue.current) {
                        return;
                    }

                    // Exhale
                    console.log('[ANIMATION] Starting EXHALE animation (6s)');
                    onPhaseChangeRef.current('exhale');
                    Animated.parallel([
                        Animated.timing(scale, {
                            toValue: 0.5,
                            duration: EXHALE_DURATION,
                            easing: Easing.bezier(0.42, 0, 0.58, 1),
                            useNativeDriver: true,
                        }),
                        Animated.timing(opacity, {
                            toValue: 0.6,
                            duration: EXHALE_DURATION,
                            easing: Easing.bezier(0.42, 0, 0.58, 1),
                            useNativeDriver: true,
                        }),
                    ]).start(() => {
                        if (shouldContinue.current) {
                            animate(); // Loop only if still active
                        } else {
                        }
                    });
                });
            };
            animate();
        } else {
            // Stop all animations immediately
            scale.stopAnimation();
            opacity.stopAnimation();

            // Reset to default
            Animated.parallel([
                Animated.timing(scale, {
                    toValue: 0.5,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.6,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [isActive, scale, opacity]); // Removed onPhaseChange from dependencies!

    return (
        <Animated.View style={[styles.circle, { transform: [{ scale }], opacity }]}>
            <Animated.View style={[styles.innerCircle, { transform: [{ scale }], opacity }]} />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    circle: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: Colors.primary.sageGreen,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.primary.sageGreen,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
        elevation: 10,
    },
    innerCircle: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(135, 168, 120, 0.5)',
    },
});
