import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '../../components/ui/Card';
import { EmergencyButton } from '../../components/ui/EmergencyButton';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Accessibility } from '../../constants/Accessibility';
import { Ionicons } from '@expo/vector-icons';

export default function CalmScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <EmergencyButton />

            {/* Header with Settings Button on Left */}
            <View style={styles.headerContainer}>
                <Pressable
                    style={styles.settingsButton}
                    onPress={() => router.push('/settings')}
                    accessible={true}
                    accessibilityLabel="Open settings"
                    accessibilityRole="button"
                >
                    <Ionicons name="settings-outline" size={28} color={Colors.primary.sageGreen} />
                </Pressable>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.header}>Find Your Calm</Text>
                    <Text style={styles.subtitle}>Choose what feels right</Text>
                </View>
                <View style={styles.spacer} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >

                <Card
                    title="Breathe"
                    subtitle="Guided breathing patterns"
                    color={Colors.primary.sageGreen}
                    icon={<Ionicons name="leaf" size={32} color={Colors.primary.sageGreen} />}
                    onPress={() => router.push('/breathe')}
                />

                <View style={styles.cardGap} />

                <Card
                    title="Ground"
                    subtitle="5-4-3-2-1 technique"
                    color={Colors.primary.softSlate}
                    icon={<Ionicons name="locate" size={32} color={Colors.primary.softSlate} />}
                    onPress={() => router.push('/ground')}
                />

                <View style={styles.cardGap} />

                <Card
                    title="Release"
                    subtitle="Progressive muscle relaxation"
                    color={Colors.primary.warmSand}
                    icon={<Ionicons name="body" size={32} color={Colors.primary.warmSand} />}
                    onPress={() => router.push('/release')}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.dark,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Accessibility.spacing.screenPadding,
        paddingTop: 20,
        paddingBottom: 16,
    },
    settingsButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 22,
        backgroundColor: 'rgba(135, 168, 120, 0.15)',
    },
    headerTextContainer: {
        flex: 1,
        alignItems: 'center',
    },
    header: {
        fontSize: Typography.fontSize.h1,
        fontWeight: 'bold',
        color: Colors.text.primary,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: Typography.fontSize.caption,
        color: Colors.text.secondary,
        textAlign: 'center',
        marginTop: 4,
    },
    spacer: {
        width: 44,
    },
    scrollContent: {
        padding: Accessibility.spacing.screenPadding,
        paddingTop: 0,
    },
    cardGap: {
        height: Accessibility.spacing.cardGap,
    },
});
