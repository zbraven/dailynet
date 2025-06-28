import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useTheme} from '../contexts/ThemeContext';
import {useLanguage} from '../contexts/LanguageContext';
import {useAuth} from '../contexts/AuthContext';
import {notificationService} from '../services/notificationService';
import {NotificationSettings} from '../types';

const SettingsScreen = () => {
  const {theme, isDark, toggleTheme} = useTheme();
  const {language, setLanguage, t} = useLanguage();
  const {signOut} = useAuth();
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      const settings = await notificationService.getNotificationSettings();
      setNotificationSettings(settings);
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  const updateNotificationSetting = async (key: keyof NotificationSettings, value: any) => {
    if (!notificationSettings) return;

    try {
      setLoading(true);
      const updatedSettings = await notificationService.updateNotificationSettings({
        ...notificationSettings,
        [key]: value,
      });
      setNotificationSettings(updatedSettings);
    } catch (error) {
      console.error('Error updating notification settings:', error);
      Alert.alert(t('common.error'), t('settings.updateFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    
    if (selectedTime && notificationSettings) {
      const timeString = selectedTime.toTimeString().slice(0, 5);
      const newTimes = [...notificationSettings.reminder_times];
      newTimes[selectedTimeIndex] = timeString;
      updateNotificationSetting('reminder_times', newTimes);
    }
  };

  const addReminderTime = () => {
    if (!notificationSettings || notificationSettings.reminder_times.length >= 6) return;
    
    const newTimes = [...notificationSettings.reminder_times, '12:00'];
    updateNotificationSetting('reminder_times', newTimes);
  };

  const removeReminderTime = (index: number) => {
    if (!notificationSettings || notificationSettings.reminder_times.length <= 1) return;
    
    const newTimes = notificationSettings.reminder_times.filter((_, i) => i !== index);
    updateNotificationSetting('reminder_times', newTimes);
  };

  const handleSignOut = async () => {
    Alert.alert(
      t('settings.signOut'),
      t('settings.signOutConfirm'),
      [
        {text: t('common.cancel'), style: 'cancel'},
        {
          text: t('settings.signOut'),
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              console.error('Sign out error:', error);
            }
          }
        }
      ]
    );
  };

  const requestNotificationPermissions = async () => {
    try {
      const granted = await notificationService.requestPermissions();
      if (granted) {
        Alert.alert(t('common.success'), t('settings.notificationsEnabled'));
      } else {
        Alert.alert(t('common.error'), t('settings.notificationsDenied'));
      }
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    title: {
      fontSize: theme.typography.h2.fontSize,
      fontWeight: theme.typography.h2.fontWeight as any,
      color: theme.colors.text,
    },
    content: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
    },
    section: {
      marginVertical: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: theme.typography.h3.fontSize,
      fontWeight: theme.typography.h3.fontWeight as any,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    settingLabel: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.text,
      flex: 1,
    },
    languageButtons: {
      flexDirection: 'row',
    },
    languageButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
      borderRadius: 6,
      marginLeft: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    languageButtonActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    languageButtonText: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.text,
    },
    languageButtonTextActive: {
      color: '#FFFFFF',
      fontWeight: '600',
    },
    timeItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    timeText: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.text,
      flex: 1,
    },
    timeButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: 6,
      marginRight: theme.spacing.sm,
    },
    timeButtonText: {
      color: '#FFFFFF',
      fontSize: theme.typography.caption.fontSize,
      fontWeight: '600',
    },
    removeButton: {
      backgroundColor: theme.colors.error,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.sm,
      borderRadius: 6,
    },
    removeButtonText: {
      color: '#FFFFFF',
      fontSize: theme.typography.caption.fontSize,
    },
    addTimeButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.md,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: theme.spacing.sm,
    },
    addTimeButtonText: {
      color: '#FFFFFF',
      fontSize: theme.typography.body.fontSize,
      fontWeight: '600',
    },
    permissionButton: {
      backgroundColor: theme.colors.secondary,
      paddingVertical: theme.spacing.md,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    permissionButtonText: {
      color: '#FFFFFF',
      fontSize: theme.typography.body.fontSize,
      fontWeight: '600',
    },
    signOutButton: {
      backgroundColor: theme.colors.error,
      paddingVertical: theme.spacing.md,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: theme.spacing.xl,
    },
    signOutButtonText: {
      color: '#FFFFFF',
      fontSize: theme.typography.body.fontSize,
      fontWeight: '600',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('nav.settings')}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.appearance')}</Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>{t('settings.darkMode')}</Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{false: theme.colors.border, true: theme.colors.primary}}
              thumbColor={isDark ? '#FFFFFF' : theme.colors.surface}
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>{t('settings.language')}</Text>
            <View style={styles.languageButtons}>
              <TouchableOpacity
                style={[
                  styles.languageButton,
                  language === 'en' && styles.languageButtonActive,
                ]}
                onPress={() => setLanguage('en')}>
                <Text
                  style={[
                    styles.languageButtonText,
                    language === 'en' && styles.languageButtonTextActive,
                  ]}>
                  EN
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.languageButton,
                  language === 'tr' && styles.languageButtonActive,
                ]}
                onPress={() => setLanguage('tr')}>
                <Text
                  style={[
                    styles.languageButtonText,
                    language === 'tr' && styles.languageButtonTextActive,
                  ]}>
                  TR
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.notifications')}</Text>
          
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestNotificationPermissions}>
            <Text style={styles.permissionButtonText}>
              {t('settings.enableNotifications')}
            </Text>
          </TouchableOpacity>

          {notificationSettings && (
            <>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>{t('settings.moodReminders')}</Text>
                <Switch
                  value={notificationSettings.mood_reminders}
                  onValueChange={(value) => updateNotificationSetting('mood_reminders', value)}
                  trackColor={{false: theme.colors.border, true: theme.colors.primary}}
                  thumbColor={notificationSettings.mood_reminders ? '#FFFFFF' : theme.colors.surface}
                  disabled={loading}
                />
              </View>

              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>{t('settings.nutritionReminders')}</Text>
                <Switch
                  value={notificationSettings.nutrition_reminders}
                  onValueChange={(value) => updateNotificationSetting('nutrition_reminders', value)}
                  trackColor={{false: theme.colors.border, true: theme.colors.primary}}
                  thumbColor={notificationSettings.nutrition_reminders ? '#FFFFFF' : theme.colors.surface}
                  disabled={loading}
                />
              </View>

              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>{t('settings.financeReminders')}</Text>
                <Switch
                  value={notificationSettings.finance_reminders}
                  onValueChange={(value) => updateNotificationSetting('finance_reminders', value)}
                  trackColor={{false: theme.colors.border, true: theme.colors.primary}}
                  thumbColor={notificationSettings.finance_reminders ? '#FFFFFF' : theme.colors.surface}
                  disabled={loading}
                />
              </View>

              <Text style={styles.sectionTitle}>{t('settings.reminderTimes')}</Text>
              {notificationSettings.reminder_times.map((time, index) => (
                <View key={index} style={styles.timeItem}>
                  <Text style={styles.timeText}>{time}</Text>
                  <TouchableOpacity
                    style={styles.timeButton}
                    onPress={() => {
                      setSelectedTimeIndex(index);
                      setShowTimePicker(true);
                    }}>
                    <Text style={styles.timeButtonText}>{t('settings.edit')}</Text>
                  </TouchableOpacity>
                  {notificationSettings.reminder_times.length > 1 && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeReminderTime(index)}>
                      <Text style={styles.removeButtonText}>×</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}

              {notificationSettings.reminder_times.length < 6 && (
                <TouchableOpacity
                  style={styles.addTimeButton}
                  onPress={addReminderTime}>
                  <Text style={styles.addTimeButtonText}>{t('settings.addReminderTime')}</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutButtonText}>{t('settings.signOut')}</Text>
        </TouchableOpacity>
      </ScrollView>

      {showTimePicker && (
        <DateTimePicker
          value={new Date(`2000-01-01T${notificationSettings?.reminder_times[selectedTimeIndex]}:00`)}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleTimeChange}
        />
      )}
    </SafeAreaView>
  );
};

export default SettingsScreen;