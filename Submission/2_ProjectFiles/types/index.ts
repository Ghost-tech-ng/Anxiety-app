export interface AnxietyEntry {
    id: string;
    timestamp: number;
    intensity: number; // 1-10
    symptoms: string[];
    intervention?: 'breathe' | 'ground' | 'release';
    duration?: number; // seconds
}

export interface UserPreferences {
    hapticPattern: 'wave' | 'pulse' | 'alternating';
    tremorSensitivity: 'low' | 'medium' | 'high';
    tremorDetectionEnabled: boolean;
    intervention?: 'breathe' | 'ground' | 'release';
    duration?: number; // seconds
    breathingRate: number; // 4-8 BPM
}

export interface AccelerometerData {
    x: number;
    y: number;
    z: number;
    timestamp: number;
}
