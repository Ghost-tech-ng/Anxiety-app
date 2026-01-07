import { Accelerometer } from 'expo-sensors';
import { AccelerometerData } from '../types';

export class SensorService {
    // Tremor detection constants
    private static readonly WINDOW_SIZE = 10;
    private static readonly SAMPLE_RATE = 100; // 100ms between samples (10 samples/second)
    private static readonly TREMOR_DURATION = 5000; // 5 seconds sustained - prevents false positives

    // Sensitivity thresholds (m/s²) - VERY HIGH to avoid false positives
    private static readonly THRESHOLDS = {
        low: 20.0,    // Extremely high - only very extreme shaking
        medium: 18.0, // Very high - sustained deliberate shaking only
        high: 15.0    // High - still requires deliberate effort
    };

    private dataWindow: number[] = [];
    private tremorStartTime: number | null = null;
    private gravity: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
    private sensitivity: 'low' | 'medium' | 'high' = 'medium';

    /**
     * Set sensitivity level
     */
    setSensitivity(sensitivity: 'low' | 'medium' | 'high'): void {
        this.sensitivity = sensitivity;
    }

    /**
     * Get current threshold based on sensitivity
     */
    private getThreshold(): number {
        return SensorService.THRESHOLDS[this.sensitivity];
    }

    /**
     * Low-pass filter to isolate gravity component
     * This properly tracks gravity regardless of phone orientation
     */
    private updateGravity(data: AccelerometerData): void {
        const alpha = 0.8; // Low-pass filter coefficient
        this.gravity.x = alpha * this.gravity.x + (1 - alpha) * data.x;
        this.gravity.y = alpha * this.gravity.y + (1 - alpha) * data.y;
        this.gravity.z = alpha * this.gravity.z + (1 - alpha) * data.z;
    }

    /**
     * High-pass filter to remove gravity and get linear acceleration
     */
    private getLinearAcceleration(data: AccelerometerData): AccelerometerData {
        return {
            x: data.x - this.gravity.x,
            y: data.y - this.gravity.y,
            z: data.z - this.gravity.z,
            timestamp: data.timestamp,
        };
    }

    /**
     * Calculate magnitude of acceleration vector
     */
    private calculateMagnitude(data: AccelerometerData): number {
        return Math.sqrt(data.x ** 2 + data.y ** 2 + data.z ** 2);
    }

    /**
     * Add data to window and calculate moving average
     */
    private addToWindow(magnitude: number): void {
        this.dataWindow.push(magnitude);
        if (this.dataWindow.length > SensorService.WINDOW_SIZE) {
            this.dataWindow.shift();
        }
    }

    /**
     * Calculate average magnitude from window
     */
    private getAverageMagnitude(): number {
        if (this.dataWindow.length === 0) return 0;
        const sum = this.dataWindow.reduce((acc, val) => acc + val, 0);
        return sum / this.dataWindow.length;
    }

    /**
     * Process accelerometer data and detect tremors
     */
    processAccelerometerData(data: AccelerometerData, onTremorDetected: () => void): void {
        // Update gravity estimate
        this.updateGravity(data);

        // Get linear acceleration (motion without gravity)
        const linear = this.getLinearAcceleration(data);
        const magnitude = this.calculateMagnitude(linear);

        this.addToWindow(magnitude);

        const avgMagnitude = this.getAverageMagnitude();
        const threshold = this.getThreshold();

        if (avgMagnitude > threshold) {
            if (this.tremorStartTime === null) {
                this.tremorStartTime = Date.now();
            } else {
                const duration = Date.now() - this.tremorStartTime;
                if (duration >= SensorService.TREMOR_DURATION) {
                    onTremorDetected();
                    this.reset();
                }
            }
        } else {
            this.tremorStartTime = null;
        }
    }

    /**
     * Reset the sensor service state
     */
    reset(): void {
        this.dataWindow = [];
        this.tremorStartTime = null;
        // Keep gravity estimate to maintain calibration
    }

    /**
     * Set up accelerometer subscription
     */
    static setupAccelerometer(callback: (data: AccelerometerData) => void) {
        Accelerometer.setUpdateInterval(SensorService.SAMPLE_RATE);
        return Accelerometer.addListener(callback);
    }

    /**
     * Check if accelerometer is available
     */
    static async isAvailable(): Promise<boolean> {
        return await Accelerometer.isAvailableAsync();
    }
}
