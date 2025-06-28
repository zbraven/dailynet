import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import {VictoryChart, VictoryLine, VictoryArea, VictoryAxis, VictoryBar, VictoryTheme} from 'victory-native';
import {useTheme} from '../contexts/ThemeContext';
import {useLanguage} from '../contexts/LanguageContext';
import {analyticsService} from '../services/analytics';
import {AnalyticsData, TimeRange} from '../types';

const {width: screenWidth} = Dimensions.get('window');
const chartWidth = screenWidth - 32;

const AnalyticsScreen = () => {
  const {theme} = useTheme();
  const {t} = useLanguage();
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getAnalytics(timeRange);
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
      Alert.alert(t('common.error'), t('analytics.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (timeRange === 'week') {
      return date.toLocaleDateString([], {weekday: 'short'});
    } else if (timeRange === 'month') {
      return date.toLocaleDateString([], {day: 'numeric'});
    } else {
      return date.toLocaleDateString([], {month: 'short'});
    }
  };

  const getChartData = (data: any[], valueKey: string) => {
    return data.map((item, index) => ({
      x: index + 1,
      y: item[valueKey] || 0,
      label: formatDate(item.date),
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
    },
    timeRangeContainer: {
      flexDirection: 'row',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.surface,
    },
    timeRangeButton: {
      flex: 1,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: theme.colors.background,
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
    timeRangeText: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.text,
    },
    timeRangeTextActive: {
      color: '#FFFFFF',
      fontWeight: '600',
    },
    section: {
      marginVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: theme.typography.h3.fontSize,
      fontWeight: theme.typography.h3.fontWeight as any,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    chartContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.lg,
      alignItems: 'center',
    },
    chartTitle: {
      fontSize: theme.typography.body.fontSize,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    summaryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.lg,
    },
    summaryCard: {
      width: '48%',
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      alignItems: 'center',
    },
    summaryIcon: {
      fontSize: 32,
      marginBottom: theme.spacing.sm,
    },
    summaryLabel: {
      fontSize: theme.typography.caption.fontSize,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.xs,
    },
    summaryValue: {
      fontSize: theme.typography.body.fontSize,
      fontWeight: '600',
      color: theme.colors.text,
      textAlign: 'center',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.md,
    },
    noDataContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: theme.spacing.xl,
    },
    noDataText: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  });

  const timeRanges: {key: TimeRange; label: string}[] = [
    {key: 'week', label: t('analytics.week')},
    {key: 'month', label: t('analytics.month')},
    {key: 'year', label: t('analytics.year')},
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('analytics.title')}</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!analyticsData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('analytics.title')}</Text>
        </View>
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>{t('analytics.noData')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('analytics.title')}</Text>
      </View>

      <View style={styles.timeRangeContainer}>
        {timeRanges.map((range) => (
          <TouchableOpacity
            key={range.key}
            style={[
              styles.timeRangeButton,
              timeRange === range.key && styles.timeRangeButtonActive,
            ]}
            onPress={() => setTimeRange(range.key)}>
            <Text
              style={[
                styles.timeRangeText,
                timeRange === range.key && styles.timeRangeTextActive,
              ]}>
              {range.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('analytics.overview')}</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryIcon}>😊</Text>
              <Text style={styles.summaryLabel}>{t('analytics.avgMood')}</Text>
              <Text style={styles.summaryValue}>
                {analyticsData.summary.avgMood?.toFixed(1) || t('common.noData')}
              </Text>
            </View>
            
            <View style={styles.summaryCard}>
              <Text style={styles.summaryIcon}>🍎</Text>
              <Text style={styles.summaryLabel}>{t('analytics.avgCalories')}</Text>
              <Text style={styles.summaryValue}>
                {Math.round(analyticsData.summary.avgCalories || 0)}
              </Text>
            </View>
            
            <View style={styles.summaryCard}>
              <Text style={styles.summaryIcon}>💰</Text>
              <Text style={styles.summaryLabel}>{t('analytics.totalIncome')}</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(analyticsData.summary.totalIncome || 0)}
              </Text>
            </View>
            
            <View style={styles.summaryCard}>
              <Text style={styles.summaryIcon}>💸</Text>
              <Text style={styles.summaryLabel}>{t('analytics.totalExpenses')}</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(analyticsData.summary.totalExpenses || 0)}
              </Text>
            </View>

            {analyticsData.summary.avgSteps && (
              <View style={styles.summaryCard}>
                <Text style={styles.summaryIcon}>👟</Text>
                <Text style={styles.summaryLabel}>{t('analytics.avgSteps')}</Text>
                <Text style={styles.summaryValue}>
                  {Math.round(analyticsData.summary.avgSteps).toLocaleString()}
                </Text>
              </View>
            )}

            {analyticsData.summary.avgSleep && (
              <View style={styles.summaryCard}>
                <Text style={styles.summaryIcon}>😴</Text>
                <Text style={styles.summaryLabel}>{t('analytics.avgSleep')}</Text>
                <Text style={styles.summaryValue}>
                  {analyticsData.summary.avgSleep.toFixed(1)}h
                </Text>
              </View>
            )}
          </View>
        </View>

        {analyticsData.moodTrend.length > 0 && (
          <View style={styles.section}>
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>{t('analytics.moodTrend')}</Text>
              <VictoryChart
                theme={VictoryTheme.material}
                width={chartWidth}
                height={200}
                padding={{left: 50, top: 20, right: 50, bottom: 50}}>
                <VictoryAxis dependentAxis />
                <VictoryAxis />
                <VictoryLine
                  data={getChartData(analyticsData.moodTrend, 'mood_average')}
                  style={{
                    data: {stroke: theme.colors.primary, strokeWidth: 3},
                  }}
                  animate={{
                    duration: 1000,
                    onLoad: {duration: 500},
                  }}
                />
              </VictoryChart>
            </View>
          </View>
        )}

        {analyticsData.nutritionTrend.length > 0 && (
          <View style={styles.section}>
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>{t('analytics.caloriesTrend')}</Text>
              <VictoryChart
                theme={VictoryTheme.material}
                width={chartWidth}
                height={200}
                padding={{left: 70, top: 20, right: 50, bottom: 50}}>
                <VictoryAxis dependentAxis />
                <VictoryAxis />
                <VictoryArea
                  data={getChartData(analyticsData.nutritionTrend, 'total_calories')}
                  style={{
                    data: {fill: theme.colors.success, fillOpacity: 0.6, stroke: theme.colors.success, strokeWidth: 2},
                  }}
                  animate={{
                    duration: 1000,
                    onLoad: {duration: 500},
                  }}
                />
              </VictoryChart>
            </View>
          </View>
        )}

        {analyticsData.financeTrend.length > 0 && (
          <View style={styles.section}>
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>{t('analytics.financeTrend')}</Text>
              <VictoryChart
                theme={VictoryTheme.material}
                width={chartWidth}
                height={200}
                padding={{left: 70, top: 20, right: 50, bottom: 50}}>
                <VictoryAxis dependentAxis />
                <VictoryAxis />
                <VictoryBar
                  data={getChartData(analyticsData.financeTrend, 'net_amount')}
                  style={{
                    data: {fill: ({datum}) => datum.y >= 0 ? theme.colors.success : theme.colors.error},
                  }}
                  animate={{
                    duration: 1000,
                    onLoad: {duration: 500},
                  }}
                />
              </VictoryChart>
            </View>
          </View>
        )}

        {analyticsData.healthTrend.length > 0 && (
          <View style={styles.section}>
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>{t('analytics.stepsTrend')}</Text>
              <VictoryChart
                theme={VictoryTheme.material}
                width={chartWidth}
                height={200}
                padding={{left: 70, top: 20, right: 50, bottom: 50}}>
                <VictoryAxis dependentAxis />
                <VictoryAxis />
                <VictoryLine
                  data={getChartData(analyticsData.healthTrend, 'steps')}
                  style={{
                    data: {stroke: theme.colors.secondary, strokeWidth: 3},
                  }}
                  animate={{
                    duration: 1000,
                    onLoad: {duration: 500},
                  }}
                />
              </VictoryChart>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AnalyticsScreen;