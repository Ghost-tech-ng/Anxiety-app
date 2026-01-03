import React from 'react';
import { View, Text, StyleSheet, Pressable, PressableProps } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Accessibility } from '../../constants/Accessibility';

interface CardProps extends PressableProps {
    title: string;
    subtitle: string;
    color: string;
    icon?: React.ReactNode;
    onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
    title,
    subtitle,
    color,
    icon,
    onPress,
    ...props
}) => {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.card,
                { borderColor: color },
                pressed && styles.pressed,
            ]}
            onPress={onPress}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`${title}: ${subtitle}`}
            {...props}
        >
            <View style={styles.content}>
                {icon && <View style={styles.iconContainer}>{icon}</View>}
                <View style={styles.textContainer}>
                    <Text style={[styles.title, { color }]}>{title}</Text>
                    <Text style={styles.subtitle}>{subtitle}</Text>
                </View>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.background.card,
        borderWidth: 2,
        borderRadius: Accessibility.borderRadius.card,
        padding: Accessibility.spacing.cardPadding,
        minHeight: 100,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 5,
    },
    pressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: Typography.fontSize.body,
        fontWeight: '500',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: Typography.fontSize.caption,
        color: Colors.text.secondary,
    },
});
