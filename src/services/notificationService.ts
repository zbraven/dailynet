import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {Platform} from 'react-native';
import {supabase} from './supabase';
import {NotificationSettings} from '../types';

class NotificationService {
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Configure push notifications
    PushNotification.configure({
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },

      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
        if (Platform.OS === 'ios') {
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      },

      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);
      },

      onRegistrationError: function(err) {
        console.error(err.message, err);
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      popInitialNotification: true,
      requestPermissions: true,
    });

    // Create notification channel for Android
    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: 'daily-net-reminders',
          channelName: 'Daily Net Reminders',
          channelDescription: 'Reminders for mood, nutrition, and finance tracking',
          playSound: true,
          soundName: 'default',
          importance: 4,
          vibrate: true,
        },
        (created) => console.log(`createChannel returned '${created}'`)
      );
    }

    this.isInitialized = true;
  }

  async scheduleReminders(settings: NotificationSettings): Promise<void> {
    await this.initialize();
    
    // Cancel all existing reminders
    PushNotification.cancelAllLocalNotifications();

    const today = new Date();
    const messages = {
      mood: [
        'How are you feeling today? 😊',
        'Take a moment to check in with your emotions',
        'Your mood matters - log it now!',
      ],
      nutrition: [
        "Haven't logged your breakfast today? 🍳",
        'Time to track your meal! 🍽️',
        'Remember to log your nutrition intake',
      ],
      finance: [
        "You haven't entered today's expenses or income. Good financial management is achieved by regularly tracking both micro and macro expenses. 💰",
        'Track your spending to stay on budget 📊',
        'Log your financial transactions for better insights',
      ],
    };

    settings.reminder_times.forEach((time, index) => {
      const [hours, minutes] = time.split(':').map(Number);
      
      if (settings.mood_reminders) {
        this.scheduleNotification({
          id: `mood-${index}`,
          title: 'Daily Net - Mood Tracking',
          message: messages.mood[index % messages.mood.length],
          hours,
          minutes,
        });
      }

      if (settings.nutrition_reminders) {
        this.scheduleNotification({
          id: `nutrition-${index}`,
          title: 'Daily Net - Nutrition Tracking',
          message: messages.nutrition[index % messages.nutrition.length],
          hours,
          minutes,
        });
      }

      if (settings.finance_reminders) {
        this.scheduleNotification({
          id: `finance-${index}`,
          title: 'Daily Net - Finance Tracking',
          message: messages.finance[index % messages.finance.length],
          hours,
          minutes,
        });
      }
    });
  }

  private scheduleNotification({
    id,
    title,
    message,
    hours,
    minutes,
  }: {
    id: string;
    title: string;
    message: string;
    hours: number;
    minutes: number;
  }): void {
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // If the time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    PushNotification.localNotificationSchedule({
      id,
      title,
      message,
      date: scheduledTime,
      repeatType: 'day',
      channelId: 'daily-net-reminders',
      playSound: true,
      soundName: 'default',
    });
  }

  async getNotificationSettings(): Promise<NotificationSettings | null> {
    try {
      const {data, error} = await supabase
        .from('notification_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error getting notification settings:', error);
      return null;
    }
  }

  async updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<NotificationSettings> {
    try {
      const {data, error} = await supabase
        .from('notification_settings')
        .upsert(settings)
        .select()
        .single();

      if (error) throw error;

      // Reschedule notifications with new settings
      await this.scheduleReminders(data);

      return data;
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  }

  async cancelAllReminders(): Promise<void> {
    PushNotification.cancelAllLocalNotifications();
  }

  async requestPermissions(): Promise<boolean> {
    await this.initialize();
    
    if (Platform.OS === 'ios') {
      return new Promise((resolve) => {
        PushNotificationIOS.requestPermissions({
          alert: true,
          badge: true,
          sound: true,
        }).then((permissions) => {
          resolve(permissions.alert || permissions.badge || permissions.sound);
        });
      });
    } else {
      // Android permissions are handled in the configure method
      return true;
    }
  }
}

export const notificationService = new NotificationService();