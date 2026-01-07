import React, { createContext, useContext, useState, useRef } from 'react';
import { Pressable, StyleSheet, View, Text, Modal, PanResponder, Animated } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Accessibility } from '../../constants/Accessibility';

interface EmergencyContextType {
    isEmergencyMode: boolean;
    activateEmergency: () => void;
    deactivateEmergency: () => void;
}

const EmergencyContext = createContext<EmergencyContextType>({
    isEmergencyMode: false,
    activateEmergency: () => { },
    deactivateEmergency: () => { },
});

export const useEmergency = () => useContext(EmergencyContext);

export const EmergencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isEmergencyMode, setIsEmergencyMode] = useState(false);

    const activateEmergency = () => setIsEmergencyMode(true);
    const deactivateEmergency = () => setIsEmergencyMode(false);

    return (
        <EmergencyContext.Provider value={{ isEmergencyMode, activateEmergency, deactivateEmergency }}>
            {children}
            {isEmergencyMode && (
                <Modal visible={true} animationType="fade">
                    <Pressable
                        style={styles.emergencyOverlay}
                        onPress={deactivateEmergency}
                        accessible={true}
                        accessibilityLabel="Emergency privacy mode active. Tap to restore app."
                        accessibilityHint="Tap anywhere to return to the app"
                    >
                        <View style={styles.emergencyContent}>
                            <Text style={styles.emergencyText}>Privacy Mode</Text>
                            <Text style={styles.emergencySubtext}>Tap anywhere to restore</Text>
                        </View>
                    </Pressable>
                </Modal>
            )}
        </EmergencyContext.Provider>
    );
};

export const EmergencyButton: React.FC = () => {
    const { activateEmergency } = useEmergency();
    const pan = useRef(new Animated.ValueXY({ x: 0, y: 100 })).current;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event(
                [null, { dx: pan.x, dy: pan.y }],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: (_, gestureState) => {
                // If barely moved, treat as tap
                if (Math.abs(gestureState.dx) < 5 && Math.abs(gestureState.dy) < 5) {
                    activateEmergency();
                }
            },
        })
    ).current;

    return (
        <Animated.View
            style={[
                styles.button,
                {
                    transform: [
                        { translateX: pan.x },
                        { translateY: pan.y }
                    ]
                }
            ]}
            {...panResponder.panHandlers}
        >
            <Text style={styles.buttonText}>✕</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        top: 100, // Moved down to avoid settings icon
        right: 20,
        width: Accessibility.touchTarget.emergency,
        height: Accessibility.touchTarget.emergency,
        borderRadius: Accessibility.touchTarget.emergency / 2,
        backgroundColor: Colors.accent.emergencyRed,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 8,
    },
    pressed: {
        opacity: 0.8,
    },
    buttonText: {
        color: Colors.text.primary,
        fontSize: 20,
        fontWeight: 'bold',
    },
    emergencyOverlay: {
        flex: 1,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emergencyContent: {
        alignItems: 'center',
    },
    emergencyText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        opacity: 0.3,
    },
    emergencySubtext: {
        fontSize: 16,
        color: '#FFFFFF',
        opacity: 0.2,
        marginTop: 8,
    },
});
