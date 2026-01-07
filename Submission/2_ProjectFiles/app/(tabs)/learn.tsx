import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import { Card } from '../../components/ui/Card';
import { EmergencyButton } from '../../components/ui/EmergencyButton';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Accessibility } from '../../constants/Accessibility';
import { Ionicons } from '@expo/vector-icons';

const articles = [
    {
        id: '1',
        title: 'Understanding Anxiety',
        subtitle: 'Learn about anxiety and its effects',
        url: 'https://www.mind.org.uk/information-support/types-of-mental-health-problems/anxiety-and-panic-attacks/',
        icon: 'information-circle-outline' as const,
    },
    {
        id: '2',
        title: 'Breathing Techniques',
        subtitle: 'Science-backed breathing exercises',
        url: 'https://www.health.harvard.edu/mind-and-mood/relaxation-techniques-breath-control-helps-quell-errant-stress-response',
        icon: 'fitness-outline' as const,
    },
    {
        id: '3',
        title: 'Neurodiversity & Mental Health',
        subtitle: 'Resources for neurodivergent individuals',
        url: 'https://www.mentalhealth.org.uk/explore-mental-health/a-z-topics/neurodiversity',
        icon: 'people-outline' as const,
    },
    {
        id: '4',
        title: 'Mindfulness Meditation',
        subtitle: 'Introduction to mindfulness practices',
        url: 'https://www.nhs.uk/mental-health/self-help/tips-and-support/mindfulness/',
        icon: 'leaf-outline' as const,
    },
    {
        id: '5',
        title: 'Cognitive Behavioral Therapy',
        subtitle: 'Understanding CBT for anxiety',
        url: 'https://www.apa.org/ptsd-guideline/patients-and-families/cognitive-behavioral',
        icon: 'bulb-outline' as const,
    },
    {
        id: '6',
        title: 'Sleep and Mental Health',
        subtitle: 'How sleep affects anxiety',
        url: 'https://www.sleepfoundation.org/mental-health',
        icon: 'moon-outline' as const,
    },
    {
        id: '7',
        title: 'Exercise for Anxiety',
        subtitle: 'Physical activity and mental wellness',
        url: 'https://www.adaa.org/living-with-anxiety/managing-anxiety/exercise-stress-and-anxiety',
        icon: 'walk-outline' as const,
    },
    {
        id: '8',
        title: 'Grounding Techniques',
        subtitle: 'Practical strategies for staying present',
        url: 'https://www.therapistaid.com/therapy-guide/grounding-techniques',
        icon: 'hand-right-outline' as const,
    },
    {
        id: '9',
        title: 'Building Resilience',
        subtitle: 'Developing coping strategies',
        url: 'https://www.apa.org/topics/resilience',
        icon: 'shield-checkmark-outline' as const,
    },
];

export default function LearnScreen() {
    const handleArticlePress = async (url: string) => {
        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                console.log("Cannot open URL:", url);
            }
        } catch (error) {
            console.error("Error opening URL:", error);
        }
    };

    return (
        <View style={styles.container}>
            <EmergencyButton />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.header}>Learn More</Text>
                <Text style={styles.subtitle}>
                    Explore resources to better understand anxiety and mental health
                </Text>

                {articles.map((article, index) => (
                    <React.Fragment key={article.id}>
                        <Card
                            title={article.title}
                            subtitle={article.subtitle}
                            color={Colors.primary.sageGreen}
                            icon={<Ionicons name={article.icon} size={28} color={Colors.primary.sageGreen} />}
                            onPress={() => handleArticlePress(article.url)}
                        />
                        {index < articles.length - 1 && <View style={styles.cardGap} />}
                    </React.Fragment>
                ))}
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
        marginBottom: 8,
        marginTop: 20,
    },
    subtitle: {
        fontSize: Typography.fontSize.body,
        color: Colors.text.secondary,
        marginBottom: 24,
    },
    cardGap: {
        height: Accessibility.spacing.cardGap,
    },
});
