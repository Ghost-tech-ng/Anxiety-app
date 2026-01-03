import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated } from 'react-native';
import { Button } from '../components/ui/Button';
import { EmergencyButton } from '../components/ui/EmergencyButton';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Accessibility } from '../constants/Accessibility';
import { Ionicons } from '@expo/vector-icons';

const steps = [
    {
        title: '5 things you see',
        description: 'Look around and name 5 things you can see right now.',
        icon: 'eye' as const,
        color: Colors.primary.sageGreen,
    },
    {
        title: '4 things you feel',
        description: 'Notice 4 things you can physically feel (texture, temperature, etc.).',
        icon: 'hand-left' as const,
        color: Colors.primary.warmSand,
    },
    {
        title: '3 things you hear',
        description: 'Listen carefully and identify 3 sounds around you.',
        icon: 'ear' as const,
        color: Colors.primary.softSlate,
    },
    {
        title: '2 things you smell',
        description: 'Notice 2 scents or smells in your environment.',
        icon: 'flower' as const,
        color: Colors.primary.sageGreen,
    },
    {
        title: '1 thing you taste',
        description: 'Focus on 1 taste in your mouth, or take a sip of water.',
        icon: 'water' as const,
        color: Colors.primary.warmSand,
    },
];

export default function GroundScreen() {
    const [currentStep, setCurrentStep] = useState(0);
    const slideAnim = useRef(new Animated.Value(0)).current;

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return Math.abs(gestureState.dx) > 20;
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dx < -50 && currentStep < steps.length - 1) {
                    // Swipe left - next
                    handleNext();
                } else if (gestureState.dx > 50 && currentStep > 0) {
                    // Swipe right - previous
                    handlePrevious();
                }
            },
        })
    ).current;

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            Animated.sequence([
                Animated.timing(slideAnim, {
                    toValue: -50,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]).start();
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            Animated.sequence([
                Animated.timing(slideAnim, {
                    toValue: 50,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]).start();
            setCurrentStep(currentStep - 1);
        }
    };

    const step = steps[currentStep];

    return (
        <View style={styles.container}>
            <EmergencyButton />
            <View style={styles.content}>
                <Text style={styles.header}>5-4-3-2-1 Grounding</Text>
                <Text style={styles.subtitle}>This technique helps you stay present by engaging your senses</Text>

                <Animated.View
                    style={[styles.stepContainer, { transform: [{ translateX: slideAnim }] }]}
                    {...panResponder.panHandlers}
                >
                    <View style={styles.iconContainer}>
                        <Ionicons name={step.icon} size={80} color={step.color} />
                    </View>

                    <Text style={styles.stepIndicator}>Step {currentStep + 1} of {steps.length}</Text>
                    <Text style={styles.stepTitle}>{step.title}</Text>
                    <Text style={styles.stepDescription}>{step.description}</Text>

                    <View style={styles.dotsContainer}>
                        {steps.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    index === currentStep && styles.dotActive,
                                ]}
                            />
                        ))}
                    </View>

                    <Text style={styles.swipeHint}>← Swipe to navigate →</Text>
                </Animated.View>

                <View style={styles.buttonContainer}>
                    {currentStep > 0 && (
                        <View style={styles.buttonWrapper}>
                            <Button
                                title="Previous"
                                onPress={handlePrevious}
                                variant="secondary"
                            />
                        </View>
                    )}
                    {currentStep < steps.length - 1 && (
                        <View style={styles.buttonWrapper}>
                            <Button
                                title="Next"
                                onPress={handleNext}
                            />
                        </View>
                    )}
                </View>
            </View>
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
    header: {
        fontSize: Typography.fontSize.h1,
        fontWeight: 'bold',
        color: Colors.text.primary,
        marginTop: 20,
    },
    subtitle: {
        fontSize: Typography.fontSize.body,
        color: Colors.text.secondary,
        marginTop: 8,
        marginBottom: 40,
    },
    stepContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    iconContainer: {
        marginBottom: 40,
        padding: 20,
        borderRadius: 100,
        backgroundColor: 'rgba(135, 168, 120, 0.1)',
    },
    stepIndicator: {
        fontSize: Typography.fontSize.caption,
        color: Colors.text.secondary,
        marginBottom: 16,
    },
    stepTitle: {
        fontSize: Typography.fontSize.h1,
        fontWeight: 'bold',
        color: Colors.primary.sageGreen,
        marginBottom: 16,
        textAlign: 'center',
    },
    stepDescription: {
        fontSize: Typography.fontSize.body,
        color: Colors.text.primary,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    dotsContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.primary.softSlate,
        opacity: 0.3,
    },
    dotActive: {
        backgroundColor: Colors.primary.sageGreen,
        opacity: 1,
        width: 24,
    },
    swipeHint: {
        fontSize: Typography.fontSize.caption,
        color: Colors.text.secondary,
        opacity: 0.5,
        marginTop: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        paddingHorizontal: Accessibility.spacing.screenPadding,
        paddingBottom: 20,
    },
    buttonWrapper: {
        flex: 1,
        maxWidth: 150,
    },
});
