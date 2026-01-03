import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { EmergencyButton } from '../../components/ui/EmergencyButton';
import { Button } from '../../components/ui/Button';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Accessibility } from '../../constants/Accessibility';
import { useAnxietyLog } from '../../hooks/useAnxietyLog';
import { Ionicons } from '@expo/vector-icons';

export default function TrackScreen() {
    const router = useRouter();
    const { entries, loadEntries, exportToPDF } = useAnxietyLog();
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        loadEntries();
    }, []);

    // Reload entries when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            loadEntries();
        }, [loadEntries])
    );

    const handleExport = async () => {
        setIsExporting(true);
        await exportToPDF();
        setIsExporting(false);
    };

    return (
        <View style={styles.container}>
            <EmergencyButton />
            <View style={styles.header}>
                <Text style={styles.headerText}>Your Journey</Text>
                <Pressable
                    style={styles.addButton}
                    onPress={() => router.push('/check-in')}
                    accessible={true}
                    accessibilityLabel="Add new check-in"
                    accessibilityRole="button"
                >
                    <Ionicons name="add-circle" size={40} color={Colors.primary.sageGreen} />
                </Pressable>
            </View>

            {entries.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="heart-outline" size={64} color={Colors.text.secondary} />
                    <Text style={styles.emptyText}>No entries yet</Text>
                    <Text style={styles.emptySubtext}>Tap + to log how you're feeling</Text>
                </View>
            ) : (
                <>
                    <FlatList
                        data={entries}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.entryCard}>
                                <View style={styles.entryHeader}>
                                    <View>
                                        <Text style={styles.entryDate}>
                                            {new Date(item.timestamp).toLocaleDateString()}
                                        </Text>
                                        <Text style={styles.entryTime}>
                                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </Text>
                                    </View>
                                    <View style={styles.intensityBadge}>
                                        <Text style={styles.intensityText}>{item.intensity}/10</Text>
                                    </View>
                                </View>
                                <View style={styles.symptomsContainer}>
                                    {item.symptoms.map((symptom, index) => (
                                        <View key={index} style={styles.symptomChip}>
                                            <Text style={styles.symptomText}>{symptom}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}
                        contentContainerStyle={styles.listContent}
                    />
                    <View style={styles.exportContainer}>
                        <Button
                            title={isExporting ? "Exporting..." : "Export PDF Report"}
                            onPress={handleExport}
                            variant="secondary"
                            disabled={entries.length === 0 || isExporting}
                        />
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.dark,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Accessibility.spacing.screenPadding,
        paddingTop: 20,
    },
    headerText: {
        fontSize: Typography.fontSize.h1,
        fontWeight: 'bold',
        color: Colors.text.primary,
    },
    addButton: {
        padding: 4,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyText: {
        fontSize: Typography.fontSize.h2,
        color: Colors.text.primary,
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: Typography.fontSize.body,
        color: Colors.text.secondary,
        marginTop: 8,
    },
    listContent: {
        padding: Accessibility.spacing.screenPadding,
        paddingTop: 0,
    },
    entryCard: {
        backgroundColor: Colors.background.card,
        borderRadius: Accessibility.borderRadius.card,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.primary.softSlate,
    },
    entryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    entryDate: {
        fontSize: Typography.fontSize.body,
        color: Colors.text.primary,
        fontWeight: '600',
    },
    entryTime: {
        fontSize: Typography.fontSize.caption,
        color: Colors.text.secondary,
        marginTop: 2,
    },
    intensityBadge: {
        backgroundColor: Colors.primary.sageGreen,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    intensityText: {
        fontSize: Typography.fontSize.caption,
        color: Colors.text.primary,
        fontWeight: 'bold',
    },
    symptomsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    symptomChip: {
        backgroundColor: 'rgba(135, 168, 120, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.primary.sageGreen,
    },
    symptomText: {
        fontSize: Typography.fontSize.caption,
        color: Colors.primary.sageGreen,
    },
    exportContainer: {
        padding: Accessibility.spacing.screenPadding,
        paddingTop: 0,
    },
});
