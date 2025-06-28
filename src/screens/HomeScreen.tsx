import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../contexts/ThemeContext';
import {useLanguage} from '../contexts/LanguageContext';
import {useAuth} from '../contexts/AuthContext';
import {dashboardService} from '../services/database';
import {healthService} from '../services/healthService';
import {DailySummary} from '../types';

const HomeScreen = () => {
  const navigation = useNavigation();
  const {theme} = useTheme();
  const {t} = useLanguage();
  const {user, signOut} = useAuth();
  const [dailySummary, setDailySummary] = useState<DailySummary | null>(null);

  useEffect(() => {
    loadDailySummary();
    // Auto-sync health data when home screen loads
    syncHealthData();
  }, []);

  const loadDailySummary = async () => {
    try {
      const summary = await dashboardService.getDailySummary();
      setDailySummary(summary);
    } catch (error) {
      console.error('Error loading daily summary:', error);
    }
  };

  const syncHealthData = async () => {
    try {
      await healthService.syncTodayData();
      // Reload summary after health sync
      await loadDailySummary();
    } catch (error) {
      console.error('Error syncing health data:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getMoodEmoji = (moodLevel?: number) => {
    if (!moodLevel) return '😐';
    const emojis = ['😢', '😞', '😕', '😐', '🙂', '😊', '😄', '😁', '😍', '🤩'];
    return emojis[Math.round(moodLevel) - 1] || '😐';
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
    welcomeText: {
      fontSize: theme.typography.h2.fontSize,
      fontWeight: theme.typography.h2.fontWeight as any,
      color: theme.colors.text,
    },
    userText: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
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
    summaryCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    summaryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    summaryItem: {
      width: '48%',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    summaryIcon: {
      fontSize: 32,
      marginBottom: theme.spacing.xs,
    },
    summaryLabel: {
      fontSize: theme.typography.caption.fontSize,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    summaryValue: {
      fontSize: theme.typography.body.fontSize,
      fontWeight: '600',
      color: theme.colors.text,
      textAlign: 'center',
      marginTop: theme.spacing.xs,
    },
    quickActionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    quickActionButton: {
      width: '48%',
      height: 100,
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    quickActionText: {
      fontSize: theme.typography.body.fontSize,
      fontWeight: '600',
      color: theme.colors.text,
      textAlign: 'center',
    },
    signOutButton: {
      backgroundColor: theme.colors.error,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: 8,
      alignSelf: 'center',
      marginTop: theme.spacing.lg,
    },
    signOutText: {
      color: '#FFFFFF',
      fontSize: theme.typography.body.fontSize,
      fontWeight: '600',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>{t('home.welcome')}</Text>
        <Text style={styles.userText}>{user?.name}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.todaysSummary')}</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryIcon}>
                  {getMoodEmoji(dailySummary?.mood_average)}
                </Text>
                <Text style={styles.summaryLabel}>{t('nav.mood')}</Text>
                <Text style={styles.summaryValue}>
                  {dailySummary?.mood_average 
                    ? `${dailySummary.mood_average.toFixed(1)}/10`
                    : t('common.noData')
                  }
                </Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryIcon}>🍎</Text>
                <Text style={styles.summaryLabel}>{t('nutrition.calories')}</Text>
                <Text style={styles.summaryValue}>
                  {Math.round(dailySummary?.total_calories || 0)}
                </Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryIcon}>💰</Text>
                <Text style={styles.summaryLabel}>{t('finance.income')}</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(dailySummary?.total_income || 0)}
                </Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryIcon}>💸</Text>
                <Text style={styles.summaryLabel}>{t('finance.expenses')}</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(dailySummary?.total_expenses || 0)}
                </Text>
              </View>

              {/* Health Data */}
              {dailySummary?.steps && (
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryIcon}>👟</Text>
                  <Text style={styles.summaryLabel}>{t('health.steps')}</Text>
                  <Text style={styles.summaryValue}>
                    {Math.round(dailySummary.steps).toLocaleString()}
                  </Text>
                </View>
              )}

              {dailySummary?.sleep_hours && (
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryIcon}>😴</Text>
                  <Text style={styles.summaryLabel}>{t('health.sleep')}</Text>
                  <Text style={styles.summaryValue}>
                    {dailySummary.sleep_hours.toFixed(1)}h
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.quickActions')}</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('Mood' as never)}>
              <Text style={styles.quickActionText}>{t('home.logMood')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('Nutrition' as never)}>
              <Text style={styles.quickActionText}>{t('home.addMeal')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('Finance' as never)}>
              <Text style={styles.quickActionText}>{t('home.addTransaction')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('Health' as never)}>
              <Text style={styles.quickActionText}>{t('nav.health')}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('Settings' as never)}>
              <Text style={styles.quickActionText}>{t('nav.settings')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>{t('settings.signOut')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;