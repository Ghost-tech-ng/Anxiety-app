import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { EmergencyButton } from '../components/ui/EmergencyButton';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Accessibility } from '../constants/Accessibility';
import { Ionicons } from '@expo/vector-icons';

const steps = [
    { text: 'Find a comfortable position, either sitting or lying down.', icon: 'bed' as const },
    { text: 'Take a few deep breaths to center yourself.', icon: 'fitness' as const },
    { text: 'Tense your toes and feet for 5 seconds, then release.', icon: 'footsteps' as const },
    { text: 'Tense your calves and thighs for 5 seconds, then release.', icon: 'walk' as const },
    { text: 'Tense your abdomen and chest for 5 seconds, then release.', icon: 'body' as const },
    { text: 'Tense your hands and arms for 5 seconds, then release.', icon: 'hand-left' as const },
    { text: 'Tense your shoulders and neck for 5 seconds, then release.', icon: 'person' as const },
    { text: 'Tense your face muscles for 5 seconds, then release.', icon: 'happy' as const },
    { text: 'Take a few more deep breaths and notice how relaxed you feel.', icon: 'checkmark-circle' as const },
];

export default function ReleaseScreen() {
    return (
        <View style={styles.container}>
            <EmergencyButton />
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.header}>Progressive Muscle Relaxation</Text>
                <Text style={styles.subtitle}>
                    Release tension by systematically tensing and relaxing muscle groups
                </Text>

                <View style={styles.stepsContainer}>
                    {steps.map((step, index) => (
                        <View key={index} style={styles.stepCard}>
                            <View style={styles.stepHeader}>
                                <View style={styles.stepNumber}>
                                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                                </View>
                                <Ionicons name={step.icon} size={24} color={Colors.primary.sageGreen} />
                            </View>
                            <Text style={styles.stepText}>{step.text}</Text>
                        </View>
                    ))}
                </View>
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
        marginTop: 20,
    },
    subtitle: {
        fontSize: Typography.fontSize.body,
        color: Colors.text.secondary,
        marginTop: 8,
        marginBottom: 32,
        lineHeight: 22,
    },
    stepsContainer: {
        gap: 16,
    },
    stepCard: {
        backgroundColor: Colors.background.card,
        borderRadius: Accessibility.borderRadius.card,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.primary.softSlate,
    },
    stepHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    stepNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: Colors.primary.sageGreen,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepNumberText: {
        fontSize: Typography.fontSize.caption,
        fontWeight: 'bold',
        color: Colors.background.dark,
    },
    stepText: {
        fontSize: Typography.fontSize.body,
        color: Colors.text.primary,
        lineHeight: 24,
    },
});
