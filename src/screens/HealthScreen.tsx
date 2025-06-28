import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import {useTheme} from '../contexts/ThemeContext';
import {useLanguage} from '../contexts/LanguageContext';
import {healthService} from '../services/healthService';
import {HealthData} from '../types';

const HealthScreen = () => {
  const {theme} = useTheme();
  const {t} = useLanguage();
  const [healthData, setHealthData] = useState<HealthData[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    initializeHealth();
  }, []);

  const initializeHealth = async () => {
    try {
      setLoading(true);
      const initialized = await healthService.initialize();
      setHasPermission(initialized);
      
      if (initialized) {
        await loadHealthData();
      }
    } catch (error) {
      console.error('Error initializing health:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadHealthData = async () => {
    try {
      const data = await healthService.getTodayHealthData();
      setHealthData(data);
    } catch (error) {
      console.error('Error loading health data:', error);
    }
  };

  const handleSync = async () => {
    if (!hasPermission) {
      Alert.alert(
        t('health.permissionRequired'),
        t('health.permissionMessage'),
        [
          {text: t('common.cancel'), style: 'cancel'},
          {text: t('health.grantPermission'), onPress: initializeHealth},
        ]
      );
      return;
    }

    try {
      setRefreshing(true);
      await healthService.syncTodayData();
      await loadHealthData();
      Alert.alert(t('common.success'), t('health.syncSuccess'));
    } catch (error) {
      console.error('Error syncing health data:', error);
      Alert.alert(t('common.error'), t('health.syncFailed'));
    } finally {
      setRefreshing(false);
    }
  };

  const getHealthValue = (dataType: string): HealthData | undefined => {
    return healthData.find(item => item.data_type === dataType);
  };

  const formatHealthValue = (data: HealthData | undefined): string => {
    if (!data) return t('common.noData');
    
    switch (data.data_type) {
      case 'steps':
        return `${Math.round(data.value).toLocaleString()} ${data.unit}`;
      case 'sleep':
        return `${data.value.toFixed(1)} ${data.unit}`;
      case 'weight':
        return `${data.value.toFixed(1)} ${data.unit}`;
      case 'calories_burned':
        return `${Math.round(data.value)} ${data.unit}`;
      default:
        return `${data.value} ${data.unit}`;
    }
  };

  const getHealthIcon = (dataType: string): string => {
    switch (dataType) {
      case 'steps': return '👟';
      case 'sleep': return '😴';
      case 'weight': return '⚖️';
      case 'calories_burned': return '🔥';
      default: return '📊';
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
    syncButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.md,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    syncButtonDisabled: {
      backgroundColor: theme.colors.textSecondary,
    },
    syncButtonText: {
      color: '#FFFFFF',
      fontSize: theme.typography.body.fontSize,
      fontWeight: '600',
    },
    healthGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    healthCard: {
      width: '48%',
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      alignItems: 'center',
    },
    healthIcon: {
      fontSize: 32,
      marginBottom: theme.spacing.sm,
    },
    healthLabel: {
      fontSize: theme.typography.caption.fontSize,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.xs,
    },
    healthValue: {
      fontSize: theme.typography.body.fontSize,
      fontWeight: '600',
      color: theme.colors.text,
      textAlign: 'center',
    },
    permissionCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: theme.spacing.lg,
      alignItems: 'center',
    },
    permissionIcon: {
      fontSize: 48,
      marginBottom: theme.spacing.md,
    },
    permissionTitle: {
      fontSize: theme.typography.h3.fontSize,
      fontWeight: theme.typography.h3.fontWeight as any,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },
    permissionText: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
    permissionButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: 8,
    },
    permissionButtonText: {
      color: '#FFFFFF',
      fontSize: theme.typography.body.fontSize,
      fontWeight: '600',
    },
  });

  const healthMetrics = [
    {type: 'steps', label: t('health.steps')},
    {type: 'sleep', label: t('health.sleep')},
    {type: 'weight', label: t('health.weight')},
    {type: 'calories_burned', label: t('health.caloriesBurned')},
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('nav.health')}</Text>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleSync} />
        }>
        
        {!hasPermission ? (
          <View style={styles.section}>
            <View style={styles.permissionCard}>
              <Text style={styles.permissionIcon}>🏥</Text>
              <Text style={styles.permissionTitle}>{t('health.permissionRequired')}</Text>
              <Text style={styles.permissionText}>{t('health.permissionMessage')}</Text>
              <TouchableOpacity
                style={styles.permissionButton}
                onPress={initializeHealth}>
                <Text style={styles.permissionButtonText}>{t('health.grantPermission')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <TouchableOpacity
                style={[styles.syncButton, loading && styles.syncButtonDisabled]}
                onPress={handleSync}
                disabled={loading}>
                <Text style={styles.syncButtonText}>
                  {loading ? t('health.syncing') : t('health.syncNow')}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('health.todayData')}</Text>
              <View style={styles.healthGrid}>
                {healthMetrics.map((metric) => {
                  const data = getHealthValue(metric.type);
                  return (
                    <View key={metric.type} style={styles.healthCard}>
                      <Text style={styles.healthIcon}>{getHealthIcon(metric.type)}</Text>
                      <Text style={styles.healthLabel}>{metric.label}</Text>
                      <Text style={styles.healthValue}>{formatHealthValue(data)}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HealthScreen;