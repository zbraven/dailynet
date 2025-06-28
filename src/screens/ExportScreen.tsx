import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useTheme} from '../contexts/ThemeContext';
import {useLanguage} from '../contexts/LanguageContext';
import {exportService} from '../services/exportService';
import {subscriptionService} from '../services/subscriptionService';
import {ExportOptions, TimeRange} from '../types';

const ExportScreen = () => {
  const {theme} = useTheme();
  const {t} = useLanguage();
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    timeRange: 'month',
    includeData: {
      mood: true,
      nutrition: true,
      finance: true,
      health: true,
    },
  });
  const [exporting, setExporting] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  React.useEffect(() => {
    checkPremiumStatus();
  }, []);

  const checkPremiumStatus = async () => {
    const premium = await subscriptionService.isPremiumUser();
    setIsPremium(premium);
  };

  const handleExport = async () => {
    if (!isPremium) {
      Alert.alert(
        t('premium.premiumRequired'),
        t('premium.exportRequiresPremium'),
        [
          {text: t('common.cancel'), style: 'cancel'},
          {text: t('premium.upgradeToPremium'), onPress: () => {/* Navigate to premium screen */}},
        ]
      );
      return;
    }

    try {
      setExporting(true);
      await exportService.exportData(exportOptions);
      Alert.alert(t('common.success'), t('export.exportSuccess'));
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert(t('common.error'), t('export.exportFailed'));
    } finally {
      setExporting(false);
    }
  };

  const updateIncludeData = (key: keyof ExportOptions['includeData'], value: boolean) => {
    setExportOptions(prev => ({
      ...prev,
      includeData: {
        ...prev.includeData,
        [key]: value,
      },
    }));
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
    optionGroup: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    optionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
    },
    optionLabel: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.text,
      flex: 1,
    },
    formatButtons: {
      flexDirection: 'row',
      marginBottom: theme.spacing.md,
    },
    formatButton: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      marginHorizontal: theme.spacing.xs,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    formatButtonActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    formatButtonText: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.text,
    },
    formatButtonTextActive: {
      color: '#FFFFFF',
      fontWeight: '600',
    },
    timeRangeButtons: {
      flexDirection: 'row',
      marginBottom: theme.spacing.md,
    },
    timeRangeButton: {
      flex: 1,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      marginHorizontal: theme.spacing.xs,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    timeRangeButtonActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    timeRangeButtonText: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.text,
    },
    timeRangeButtonTextActive: {
      color: '#FFFFFF',
      fontWeight: '600',
    },
    exportButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.md,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: theme.spacing.lg,
    },
    exportButtonDisabled: {
      backgroundColor: theme.colors.textSecondary,
    },
    exportButtonText: {
      color: '#FFFFFF',
      fontSize: theme.typography.body.fontSize,
      fontWeight: '600',
    },
    premiumNotice: {
      backgroundColor: theme.colors.warning + '20',
      borderRadius: 8,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    premiumNoticeText: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.text,
      textAlign: 'center',
    },
  });

  const formatOptions = [
    {key: 'csv' as const, label: 'CSV', description: t('export.csvDescription')},
    {key: 'pdf' as const, label: 'PDF', description: t('export.pdfDescription')},
  ];

  const timeRangeOptions: {key: TimeRange; label: string}[] = [
    {key: 'week', label: t('analytics.week')},
    {key: 'month', label: t('analytics.month')},
    {key: 'year', label: t('analytics.year')},
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('export.title')}</Text>
      </View>

      <ScrollView style={styles.content}>
        {!isPremium && (
          <View style={styles.premiumNotice}>
            <Text style={styles.premiumNoticeText}>{t('premium.exportRequiresPremium')}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('export.format')}</Text>
          <View style={styles.formatButtons}>
            {formatOptions.map((format) => (
              <TouchableOpacity
                key={format.key}
                style={[
                  styles.formatButton,
                  exportOptions.format === format.key && styles.formatButtonActive,
                ]}
                onPress={() => setExportOptions(prev => ({...prev, format: format.key}))}>
                <Text
                  style={[
                    styles.formatButtonText,
                    exportOptions.format === format.key && styles.formatButtonTextActive,
                  ]}>
                  {format.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('export.timeRange')}</Text>
          <View style={styles.timeRangeButtons}>
            {timeRangeOptions.map((range) => (
              <TouchableOpacity
                key={range.key}
                style={[
                  styles.timeRangeButton,
                  exportOptions.timeRange === range.key && styles.timeRangeButtonActive,
                ]}
                onPress={() => setExportOptions(prev => ({...prev, timeRange: range.key}))}>
                <Text
                  style={[
                    styles.timeRangeButtonText,
                    exportOptions.timeRange === range.key && styles.timeRangeButtonTextActive,
                  ]}>
                  {range.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('export.includeData')}</Text>
          <View style={styles.optionGroup}>
            <View style={styles.optionRow}>
              <Text style={styles.optionLabel}>{t('nav.mood')}</Text>
              <Switch
                value={exportOptions.includeData.mood}
                onValueChange={(value) => updateIncludeData('mood', value)}
                trackColor={{false: theme.colors.border, true: theme.colors.primary}}
                thumbColor={exportOptions.includeData.mood ? '#FFFFFF' : theme.colors.surface}
              />
            </View>
            
            <View style={styles.optionRow}>
              <Text style={styles.optionLabel}>{t('nav.nutrition')}</Text>
              <Switch
                value={exportOptions.includeData.nutrition}
                onValueChange={(value) => updateIncludeData('nutrition', value)}
                trackColor={{false: theme.colors.border, true: theme.colors.primary}}
                thumbColor={exportOptions.includeData.nutrition ? '#FFFFFF' : theme.colors.surface}
              />
            </View>
            
            <View style={styles.optionRow}>
              <Text style={styles.optionLabel}>{t('nav.finance')}</Text>
              <Switch
                value={exportOptions.includeData.finance}
                onValueChange={(value) => updateIncludeData('finance', value)}
                trackColor={{false: theme.colors.border, true: theme.colors.primary}}
                thumbColor={exportOptions.includeData.finance ? '#FFFFFF' : theme.colors.surface}
              />
            </View>
            
            <View style={styles.optionRow}>
              <Text style={styles.optionLabel}>{t('nav.health')}</Text>
              <Switch
                value={exportOptions.includeData.health}
                onValueChange={(value) => updateIncludeData('health', value)}
                trackColor={{false: theme.colors.border, true: theme.colors.primary}}
                thumbColor={exportOptions.includeData.health ? '#FFFFFF' : theme.colors.surface}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.exportButton, (!isPremium || exporting) && styles.exportButtonDisabled]}
          onPress={handleExport}
          disabled={!isPremium || exporting}>
          {exporting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.exportButtonText}>{t('export.exportData')}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExportScreen;