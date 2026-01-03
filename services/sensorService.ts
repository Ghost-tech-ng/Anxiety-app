import { Accelerometer } from 'expo-sensors';
import { AccelerometerData } from '../types';

export class SensorService {
    // Tremor detection constants
    private static readonly WINDOW_SIZE = 10;
    private static readonly TREMOR_THRESHOLD = 8.0; // Extremely high threshold - only very severe shaking
    private static readonly TREMOR_DURATION = 3000; // 3 seconds sustained
    private static readonly SAMPLE_RATE = 100; // 100ms between samples (10 samples/second)

    private dataWindow: number[] = [];
    private tremorStartTime: number | null = null;

    /**
     * High-pass filter to remove gravity component
     */
    private highPassFilter(data: AccelerometerData): AccelerometerData {
        const alpha = 0.8; // Filter coefficient
        const gravity = { x: 0, y: 0, z: 9.81 };

        return {
            x: alpha * (data.x - gravity.x),
            y: alpha * (data.y - gravity.y),
            z: alpha * (data.z - gravity.z),
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
        const filtered = this.highPassFilter(data);
        const magnitude = this.calculateMagnitude(filtered);
        this.addToWindow(magnitude);

        const avgMagnitude = this.getAverageMagnitude();

        if (avgMagnitude > SensorService.TREMOR_THRESHOLD) {
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
