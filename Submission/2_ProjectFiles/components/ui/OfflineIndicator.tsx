import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NetInfo from '@react-native-community/netinfo';

/**
 * OfflineIndicator Component
 * 
 * Displays a prominent banner below the status bar when the device is offline.
 * Uses @react-native-community/netinfo to monitor network connectivity.
 */
export const OfflineIndicator: React.FC = () => {
    const [isOffline, setIsOffline] = useState(false);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsOffline(!state.isConnected);
        });

        return () => unsubscribe();
    }, []);

    if (!isOffline) {
        return null;
    }

    return (
        <View style={[styles.container, { top: insets.top }]}>
            <Text style={styles.text}>📵 Offline Mode - All features available</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        backgroundColor: '#F59E0B',
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    text: {
        fontSize: 12,
        color: '#FFFFFF',
        fontWeight: '700',
        textAlign: 'center',
    },
});
