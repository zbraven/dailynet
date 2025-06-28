import {Platform, PermissionsAndroid} from 'react-native';
import AppleHealthKit, {HealthKitPermissions} from 'react-native-health';
import {supabase} from './supabase';
import {HealthData} from '../types';

// Health permissions for iOS
const permissions: HealthKitPermissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.Steps,
      AppleHealthKit.Constants.Permissions.SleepAnalysis,
      AppleHealthKit.Constants.Permissions.Weight,
      AppleHealthKit.Constants.Permissions.HeartRate,
      AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
    ],
  },
};

class HealthService {
  private isInitialized = false;

  async initialize(): Promise<boolean> {
    if (Platform.OS === 'ios') {
      return new Promise((resolve) => {
        AppleHealthKit.initHealthKit(permissions, (error: string) => {
          if (error) {
            console.log('HealthKit initialization error:', error);
            resolve(false);
          } else {
            this.isInitialized = true;
            resolve(true);
          }
        });
      });
    } else if (Platform.OS === 'android') {
      // For Android, we would use Google Fit API
      // This is a simplified implementation
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
          {
            title: 'Activity Recognition Permission',
            message: 'This app needs access to your activity data to track health metrics.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        this.isInitialized = granted === PermissionsAndroid.RESULTS.GRANTED;
        return this.isInitialized;
      } catch (err) {
        console.warn('Android health permission error:', err);
        return false;
      }
    }
    return false;
  }

  async syncTodayData(): Promise<void> {
    if (!this.isInitialized) {
      const initialized = await this.initialize();
      if (!initialized) return;
    }

    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000 - 1);

    if (Platform.OS === 'ios') {
      await this.syncIOSHealthData(startOfDay, endOfDay);
    } else if (Platform.OS === 'android') {
      await this.syncAndroidHealthData(startOfDay, endOfDay);
    }
  }

  private async syncIOSHealthData(startDate: Date, endDate: Date): Promise<void> {
    try {
      // Sync steps
      const stepsData = await this.getIOSSteps(startDate, endDate);
      if (stepsData) {
        await this.saveHealthData({
          data_type: 'steps',
          value: stepsData.value,
          unit: 'steps',
          recorded_at: stepsData.endDate,
          source: 'apple_health',
        });
      }

      // Sync sleep
      const sleepData = await this.getIOSSleep(startDate, endDate);
      if (sleepData) {
        await this.saveHealthData({
          data_type: 'sleep',
          value: sleepData.value,
          unit: 'hours',
          recorded_at: sleepData.endDate,
          source: 'apple_health',
        });
      }

      // Sync weight (latest)
      const weightData = await this.getIOSWeight();
      if (weightData) {
        await this.saveHealthData({
          data_type: 'weight',
          value: weightData.value,
          unit: 'kg',
          recorded_at: weightData.endDate,
          source: 'apple_health',
        });
      }

      // Sync calories burned
      const caloriesData = await this.getIOSCaloriesBurned(startDate, endDate);
      if (caloriesData) {
        await this.saveHealthData({
          data_type: 'calories_burned',
          value: caloriesData.value,
          unit: 'kcal',
          recorded_at: caloriesData.endDate,
          source: 'apple_health',
        });
      }
    } catch (error) {
      console.error('Error syncing iOS health data:', error);
    }
  }

  private async syncAndroidHealthData(startDate: Date, endDate: Date): Promise<void> {
    // Simplified Android implementation
    // In a real app, you would use Google Fit API
    try {
      // Mock data for demonstration
      const mockSteps = Math.floor(Math.random() * 10000) + 2000;
      const mockSleep = Math.random() * 3 + 6; // 6-9 hours
      const mockCalories = Math.floor(Math.random() * 500) + 200;

      await this.saveHealthData({
        data_type: 'steps',
        value: mockSteps,
        unit: 'steps',
        recorded_at: endDate.toISOString(),
        source: 'google_health',
      });

      await this.saveHealthData({
        data_type: 'sleep',
        value: mockSleep,
        unit: 'hours',
        recorded_at: endDate.toISOString(),
        source: 'google_health',
      });

      await this.saveHealthData({
        data_type: 'calories_burned',
        value: mockCalories,
        unit: 'kcal',
        recorded_at: endDate.toISOString(),
        source: 'google_health',
      });
    } catch (error) {
      console.error('Error syncing Android health data:', error);
    }
  }

  private getIOSSteps(startDate: Date, endDate: Date): Promise<any> {
    return new Promise((resolve) => {
      const options = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      AppleHealthKit.getStepCount(options, (error: string, results: any) => {
        if (error) {
          console.log('Error getting steps:', error);
          resolve(null);
        } else {
          resolve(results);
        }
      });
    });
  }

  private getIOSSleep(startDate: Date, endDate: Date): Promise<any> {
    return new Promise((resolve) => {
      const options = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      AppleHealthKit.getSleepSamples(options, (error: string, results: any[]) => {
        if (error) {
          console.log('Error getting sleep:', error);
          resolve(null);
        } else if (results && results.length > 0) {
          // Calculate total sleep hours
          const totalMinutes = results.reduce((total, sample) => {
            const start = new Date(sample.startDate);
            const end = new Date(sample.endDate);
            return total + (end.getTime() - start.getTime()) / (1000 * 60);
          }, 0);
          
          resolve({
            value: totalMinutes / 60,
            endDate: endDate.toISOString(),
          });
        } else {
          resolve(null);
        }
      });
    });
  }

  private getIOSWeight(): Promise<any> {
    return new Promise((resolve) => {
      const options = {
        unit: 'kg',
      };

      AppleHealthKit.getLatestWeight(options, (error: string, results: any) => {
        if (error) {
          console.log('Error getting weight:', error);
          resolve(null);
        } else {
          resolve(results);
        }
      });
    });
  }

  private getIOSCaloriesBurned(startDate: Date, endDate: Date): Promise<any> {
    return new Promise((resolve) => {
      const options = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      AppleHealthKit.getActiveEnergyBurned(options, (error: string, results: any) => {
        if (error) {
          console.log('Error getting calories burned:', error);
          resolve(null);
        } else {
          resolve(results);
        }
      });
    });
  }

  private async saveHealthData(data: Omit<HealthData, 'id' | 'user_id' | 'created_at'>): Promise<void> {
    try {
      // Check if data for today already exists
      const today = new Date().toISOString().split('T')[0];
      const {data: existingData} = await supabase
        .from('health_data')
        .select('id')
        .eq('data_type', data.data_type)
        .gte('recorded_at', `${today}T00:00:00.000Z`)
        .lt('recorded_at', `${today}T23:59:59.999Z`)
        .single();

      if (existingData) {
        // Update existing record
        await supabase
          .from('health_data')
          .update({
            value: data.value,
            recorded_at: data.recorded_at,
          })
          .eq('id', existingData.id);
      } else {
        // Insert new record
        await supabase
          .from('health_data')
          .insert(data);
      }
    } catch (error) {
      console.error('Error saving health data:', error);
    }
  }

  async getTodayHealthData(): Promise<HealthData[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const {data, error} = await supabase
        .from('health_data')
        .select('*')
        .gte('recorded_at', `${today}T00:00:00.000Z`)
        .lt('recorded_at', `${today}T23:59:59.999Z`)
        .order('recorded_at', {ascending: false});

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting today health data:', error);
      return [];
    }
  }

  async getHealthDataByType(dataType: string, days: number = 7): Promise<HealthData[]> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const {data, error} = await supabase
        .from('health_data')
        .select('*')
        .eq('data_type', dataType)
        .gte('recorded_at', startDate.toISOString())
        .order('recorded_at', {ascending: false});

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting health data by type:', error);
      return [];
    }
  }
}

export const healthService = new HealthService();