import { Accelerometer } from 'expo-sensors';
import { AccelerometerData } from '../types';

export class SensorService {
    // Tremor detection constants
    private static readonly WINDOW_SIZE = 10;
    private static readonly SAMPLE_RATE = 100; // 100ms between samples (10 samples/second)
    private static readonly TREMOR_DURATION = 2000; // 2 seconds sustained

    // Sensitivity thresholds - Optimized for responsiveness
    private static readonly THRESHOLDS = {
        low: 0.35,    // Less sensitive
        medium: 0.25, // Balanced (default)
        high: 0.18    // Most sensitive
    };

    private dataWindow: number[] = [];
    private tremorStartTime: number | null = null;
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
     * Calculate magnitude of acceleration vector (including gravity)
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
     * Calculate variance to detect shaking (motion changes)
     */
    private getVariance(): number {
        if (this.dataWindow.length < 2) return 0;
        const avg = this.getAverageMagnitude();
        const squaredDiffs = this.dataWindow.map(val => Math.pow(val - avg, 2));
        return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / this.dataWindow.length);
    }

    /**
     * Process accelerometer data and detect tremors
     * Uses variance (motion changes) instead of absolute magnitude
     */
    processAccelerometerData(data: AccelerometerData, onTremorDetected: () => void): void {
        const magnitude = this.calculateMagnitude(data);
        this.addToWindow(magnitude);

        // Use variance (standard deviation) to detect shaking
        const variance = this.getVariance();
        const threshold = this.getThreshold();

        if (variance > threshold) {
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
