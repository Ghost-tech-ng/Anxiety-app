import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Accessibility } from '../../constants/Accessibility';
import { Ionicons } from '@expo/vector-icons';

interface TremorAlertProps {
    visible: boolean;
    onDismiss: () => void;
}

export const TremorAlert: React.FC<TremorAlertProps> = ({ visible, onDismiss }) => {
    const router = useRouter();

    const handleStartBreathing = () => {
        onDismiss();
        router.push('/breathe');
    };

    React.useEffect(() => {
        if (visible) {
            // Trigger haptic alert
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }
    }, [visible]);

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onDismiss}
        >
            <Pressable style={styles.overlay} onPress={onDismiss}>
                <Pressable style={styles.alertContainer} onPress={(e) => e.stopPropagation()}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="alert-circle" size={48} color={Colors.primary.sageGreen} />
                    </View>

                    <Text style={styles.title}>Tremor Detected</Text>
                    <Text style={styles.message}>
                        We noticed some movement. Would you like to take a moment to breathe?
                    </Text>

                    <View style={styles.buttonContainer}>
                        <Pressable
                            style={[styles.button, styles.primaryButton]}
                            onPress={handleStartBreathing}
                            accessible={true}
                            accessibilityLabel="Start breathing exercise"
                            accessibilityRole="button"
                        >
                            <Text style={styles.primaryButtonText}>Start Breathing</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.button, styles.secondaryButton]}
                            onPress={onDismiss}
                            accessible={true}
                            accessibilityLabel="Dismiss alert"
                            accessibilityRole="button"
                        >
                            <Text style={styles.secondaryButtonText}>Dismiss</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertContainer: {
        backgroundColor: Colors.background.dark,
        borderRadius: Accessibility.borderRadius.card,
        padding: 24,
        marginHorizontal: 32,
        maxWidth: 400,
        borderWidth: 2,
        borderColor: Colors.primary.sageGreen,
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: Typography.fontSize.h2,
        fontWeight: 'bold',
        color: Colors.text.primary,
        textAlign: 'center',
        marginBottom: 12,
    },
    message: {
        fontSize: Typography.fontSize.body,
        color: Colors.text.secondary,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 24,
    },
    buttonContainer: {
        gap: 12,
    },
    button: {
        height: Accessibility.touchTarget.minimum,
        borderRadius: Accessibility.borderRadius.button,
        justifyContent: 'center',
        alignItems: 'center',
    },
    primaryButton: {
        backgroundColor: Colors.primary.sageGreen,
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: Colors.primary.sageGreen,
    },
    primaryButtonText: {
        fontSize: Typography.fontSize.button,
        fontWeight: '600',
        color: Colors.text.primary,
    },
    secondaryButtonText: {
        fontSize: Typography.fontSize.button,
        fontWeight: '600',
        color: Colors.primary.sageGreen,
    },
});
