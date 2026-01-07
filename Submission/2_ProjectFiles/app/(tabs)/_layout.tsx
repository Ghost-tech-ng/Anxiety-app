import { Tabs } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { ErrorBoundary } from '../../components/ui/ErrorBoundary';

export default function TabLayout() {
    return (
        <ErrorBoundary>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: Colors.primary.sageGreen,
                    tabBarInactiveTintColor: Colors.text.secondary,
                    tabBarStyle: {
                        backgroundColor: Colors.background.dark,
                        borderTopColor: Colors.primary.softSlate,
                        borderTopWidth: 1,
                    },
                    headerStyle: {
                        backgroundColor: Colors.background.dark,
                    },
                    headerTintColor: Colors.text.primary,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Calm',
                        tabBarIcon: ({ color, size }) => <Ionicons name="leaf" size={size} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="track"
                    options={{
                        title: 'Track',
                        tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart" size={size} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="learn"
                    options={{
                        title: 'Learn',
                        tabBarIcon: ({ color, size }) => <Ionicons name="book" size={size} color={color} />,
                    }}
                />
            </Tabs>
        </ErrorBoundary>
    );
}
