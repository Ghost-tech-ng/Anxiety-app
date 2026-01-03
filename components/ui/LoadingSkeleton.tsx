import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Accessibility } from '../../constants/Accessibility';

export const LoadingSkeleton: React.FC = () => {
    const opacity = React.useRef(new Animated.Value(0.3)).current;

    React.useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        );
        animation.start();
        return () => animation.stop();
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.skeleton, styles.header, { opacity }]} />
            <Animated.View style={[styles.skeleton, styles.card, { opacity }]} />
            <Animated.View style={[styles.skeleton, styles.card, { opacity }]} />
            <Animated.View style={[styles.skeleton, styles.card, { opacity }]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: Accessibility.spacing.screenPadding,
    },
    skeleton: {
        backgroundColor: Colors.background.card,
        borderRadius: Accessibility.borderRadius.card,
    },
    header: {
        height: 32,
        width: '60%',
        marginBottom: 24,
    },
    card: {
        height: 120,
        marginBottom: 16,
    },
});
