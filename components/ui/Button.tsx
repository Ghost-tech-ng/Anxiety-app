import React from 'react';
import { Pressable, Text, StyleSheet, PressableProps } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Accessibility } from '../../constants/Accessibility';

interface ButtonProps extends PressableProps {
    title: string;
    variant?: 'primary' | 'secondary';
    onPress: () => void;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    variant = 'primary',
    onPress,
    ...props
}) => {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.button,
                variant === 'primary' ? styles.primary : styles.secondary,
                pressed && styles.pressed,
            ]}
            onPress={onPress}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={title}
            {...props}
        >
            <Text
                style={[
                    styles.text,
                    variant === 'primary' ? styles.primaryText : styles.secondaryText,
                ]}
            >
                {title}
            </Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        height: Accessibility.touchTarget.minimum,
        borderRadius: Accessibility.borderRadius.button,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    primary: {
        backgroundColor: Colors.primary.sageGreen,
    },
    secondary: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: Colors.primary.sageGreen,
    },
    pressed: {
        opacity: 0.7,
    },
    text: {
        fontSize: Typography.fontSize.button,
        fontWeight: '500',
    },
    primaryText: {
        color: Colors.text.primary,
    },
    secondaryText: {
        color: Colors.primary.sageGreen,
    },
});
