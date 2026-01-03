import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../components/ui/Button';
import { EmergencyButton } from '../components/ui/EmergencyButton';
import { useAnxietyLog } from '../hooks/useAnxietyLog';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Accessibility } from '../constants/Accessibility';

const symptoms = [
    'Tight chest',
    'Racing thoughts',
    'Nauseous',
    'Hand tremors',
    'Sweating',
    'Trembling',
];

export default function CheckInScreen() {
    const router = useRouter();
    const { addEntry } = useAnxietyLog();
    const [intensity, setIntensity] = useState<number | null>(null);
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    const toggleSymptom = (symptom: string) => {
        setSelectedSymptoms((prev) =>
            prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
        );
    };

    const handleCheckIn = async () => {
        if (intensity === null) {
            alert('Please select an intensity level');
            return;
        }

        setIsSaving(true);
        try {
            await addEntry({
                intensity,
                symptoms: selectedSymptoms,
            });
            router.back();
        } catch (error) {
            alert('Failed to save entry. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <View style={styles.container}>
            <EmergencyButton />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.header}>How are you feeling?</Text>
                <Text style={styles.subtitle}>Rate your current state</Text>

                <View style={styles.intensityContainer}>
                    <Text style={styles.sectionLabel}>Intensity Level</Text>
                    <View style={styles.intensityGrid}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                            <Pressable
                                key={level}
                                style={[
                                    styles.intensityButton,
                                    intensity === level && styles.intensityButtonSelected,
                                ]}
                                onPress={() => setIntensity(level)}
                                accessible={true}
                                accessibilityLabel={`Intensity level ${level}`}
                                accessibilityRole="button"
                            >
                                <Text
                                    style={[
                                        styles.intensityText,
                                        intensity === level && styles.intensityTextSelected,
                                    ]}
                                >
                                    {level}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                    {intensity !== null && (
                        <Text style={styles.selectedText}>Current level: {intensity}/10</Text>
                    )}
                </View>

                <View style={styles.symptomsContainer}>
                    <Text style={styles.sectionLabel}>What are you feeling?</Text>
                    <View style={styles.symptomsGrid}>
                        {symptoms.map((symptom) => (
                            <Pressable
                                key={symptom}
                                style={[
                                    styles.symptomChip,
                                    selectedSymptoms.includes(symptom) && styles.symptomChipSelected,
                                ]}
                                onPress={() => toggleSymptom(symptom)}
                                accessible={true}
                                accessibilityLabel={symptom}
                                accessibilityRole="checkbox"
                                accessibilityState={{ checked: selectedSymptoms.includes(symptom) }}
                            >
                                <Text
                                    style={[
                                        styles.symptomText,
                                        selectedSymptoms.includes(symptom) && styles.symptomTextSelected,
                                    ]}
                                >
                                    {symptom}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        title={isSaving ? 'Saving...' : 'Check In'}
                        onPress={handleCheckIn}
                        disabled={isSaving || intensity === null}
                    />
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
    scrollContent: {
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
        marginTop: 4,
        marginBottom: 32,
    },
    sectionLabel: {
        fontSize: Typography.fontSize.h3,
        fontWeight: '600',
        color: Colors.text.primary,
        marginBottom: 16,
    },
    intensityContainer: {
        marginBottom: 32,
    },
    intensityGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    intensityButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.background.card,
        borderWidth: 2,
        borderColor: Colors.primary.softSlate,
        justifyContent: 'center',
        alignItems: 'center',
    },
    intensityButtonSelected: {
        backgroundColor: Colors.primary.sageGreen,
        borderColor: Colors.primary.sageGreen,
    },
    intensityText: {
        fontSize: Typography.fontSize.h2,
        fontWeight: 'bold',
        color: Colors.text.secondary,
    },
    intensityTextSelected: {
        color: Colors.text.primary,
    },
    selectedText: {
        fontSize: Typography.fontSize.caption,
        color: Colors.text.secondary,
        marginTop: 12,
    },
    symptomsContainer: {
        marginBottom: 32,
    },
    symptomsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    symptomChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: Colors.background.card,
        borderWidth: 2,
        borderColor: Colors.primary.softSlate,
    },
    symptomChipSelected: {
        backgroundColor: 'rgba(135, 168, 120, 0.2)',
        borderColor: Colors.primary.sageGreen,
    },
    symptomText: {
        fontSize: Typography.fontSize.caption,
        color: Colors.text.secondary,
    },
    symptomTextSelected: {
        color: Colors.primary.sageGreen,
        fontWeight: '600',
    },
    buttonContainer: {
        marginTop: 16,
    },
});
