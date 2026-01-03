import { useState, useEffect, useCallback, useRef } from 'react';
import { SensorService } from '../services/sensorService';
import { usePathname } from 'expo-router';

export const useTremorDetection = (enabled: boolean = true) => {
    const [isTremorDetected, setIsTremorDetected] = useState(false);
    const [isAvailable, setIsAvailable] = useState(false);
    const [sensorService] = useState(() => new SensorService());
    const pathname = usePathname();
    const lastTriggerTime = useRef(0);

    // Disable tremor detection on certain screens
    const shouldDetect = enabled &&
        pathname !== '/breathe' &&
        pathname !== '/ground' &&
        pathname !== '/release' &&
        pathname !== '/check-in';

    useEffect(() => {
        // Check if accelerometer is available
        SensorService.isAvailable()
            .then(setIsAvailable)
            .catch((error) => {
                console.log('Accelerometer not available:', error);
                setIsAvailable(false);
            });
    }, []);

    useEffect(() => {
        if (!shouldDetect || !isAvailable) return;

        try {
            const handleTremorDetected = () => {
                const now = Date.now();
                // Prevent re-triggering within 15 seconds
                if (now - lastTriggerTime.current < 15000) {
                    return;
                }

                lastTriggerTime.current = now;
                setIsTremorDetected(true);

                // Auto-reset after 10 seconds
                setTimeout(() => {
                    setIsTremorDetected(false);
                }, 10000);
            };

            const subscription = SensorService.setupAccelerometer((data) => {
                sensorService.processAccelerometerData(data, handleTremorDetected);
            });

            return () => {
                subscription.remove();
                sensorService.reset();
            };
        } catch (error) {
            console.error('Error setting up tremor detection:', error);
        }
    }, [shouldDetect, isAvailable, sensorService]);

    const resetTremorDetection = useCallback(() => {
        setIsTremorDetected(false);
        sensorService.reset();
        lastTriggerTime.current = 0;
    }, [sensorService]);

    return {
        isTremorDetected,
        isAvailable,
        resetTremorDetection,
    };
};
