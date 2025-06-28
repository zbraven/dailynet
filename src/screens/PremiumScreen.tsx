import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useTheme} from '../contexts/ThemeContext';
import {useLanguage} from '../contexts/LanguageContext';
import {subscriptionService} from '../services/subscriptionService';
import {Subscription} from '../types';

const PremiumScreen = () => {
  const {theme} = useTheme();
  const {t} = useLanguage();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    loadSubscriptionStatus();
    subscriptionService.initialize();
  }, []);

  const loadSubscriptionStatus = async () => {
    try {
      setLoading(true);
      const status = await subscriptionService.getSubscriptionStatus();
      setSubscription(status);
    } catch (error) {
      console.error('Error loading subscription status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchasePremium = async () => {
    try {
      setPurchasing(true);
      await subscriptionService.purchasePremium();
      await loadSubscriptionStatus();
      Alert.alert(t('common.success'), t('premium.purchaseSuccess'));
    } catch (error) {
      console.error('Error purchasing premium:', error);
      Alert.alert(t('common.error'), t('premium.purchaseFailed'));
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestorePurchases = async () => {
    try {
      setLoading(true);
      await subscriptionService.restorePurchases();
      await loadSubscriptionStatus();
      Alert.alert(t('common.success'), t('premium.restoreSuccess'));
    } catch (error) {
      console.error('Error restoring purchases:', error);
      Alert.alert(t('common.error'), t('premium.restoreFailed'));
    } finally {
      setLoading(false);
    }
  };

  const isPremium = subscription?.plan === 'premium' && subscription?.status === 'active';

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
    premiumBadge: {
      backgroundColor: theme.colors.primary,
      borderRadius: 20,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      alignSelf: 'center',
      marginVertical: theme.spacing.lg,
    },
    premiumBadgeText: {
      color: '#FFFFFF',
      fontSize: theme.typography.body.fontSize,
      fontWeight: '600',
    },
    statusCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: theme.spacing.lg,
      marginVertical: theme.spacing.md,
      alignItems: 'center',
    },
    statusIcon: {
      fontSize: 48,
      marginBottom: theme.spacing.md,
    },
    statusTitle: {
      fontSize: theme.typography.h3.fontSize,
      fontWeight: theme.typography.h3.fontWeight as any,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    statusText: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.md,
    },
    featuresSection: {
      marginVertical: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: theme.typography.h3.fontSize,
      fontWeight: theme.typography.h3.fontWeight as any,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    featureIcon: {
      fontSize: 24,
      marginRight: theme.spacing.md,
    },
    featureText: {
      flex: 1,
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.text,
    },
    premiumButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.md,
      borderRadius: 8,
      alignItems: 'center',
      marginVertical: theme.spacing.md,
    },
    premiumButtonDisabled: {
      backgroundColor: theme.colors.textSecondary,
    },
    premiumButtonText: {
      color: '#FFFFFF',
      fontSize: theme.typography.body.fontSize,
      fontWeight: '600',
    },
    restoreButton: {
      backgroundColor: theme.colors.surface,
      paddingVertical: theme.spacing.md,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    restoreButtonText: {
      color: theme.colors.text,
      fontSize: theme.typography.body.fontSize,
    },
    priceText: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.md,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  const premiumFeatures = [
    {icon: '📊', text: t('premium.advancedAnalytics')},
    {icon: '📈', text: t('premium.detailedCharts')},
    {icon: '📄', text: t('premium.csvExport')},
    {icon: '📋', text: t('premium.pdfReports')},
    {icon: '☁️', text: t('premium.cloudBackup')},
    {icon: '🔔', text: t('premium.customNotifications')},
    {icon: '🎯', text: t('premium.goalTracking')},
    {icon: '💎', text: t('premium.prioritySupport')},
  ];

  if (loading && !subscription) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('premium.title')}</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('premium.title')}</Text>
      </View>

      <ScrollView style={styles.content}>
        {isPremium && (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumBadgeText}>{t('premium.premiumUser')}</Text>
          </View>
        )}

        <View style={styles.statusCard}>
          <Text style={styles.statusIcon}>{isPremium ? '👑' : '⭐'}</Text>
          <Text style={styles.statusTitle}>
            {isPremium ? t('premium.currentlyPremium') : t('premium.upgradeToPremium')}
          </Text>
          <Text style={styles.statusText}>
            {isPremium 
              ? t('premium.premiumDescription')
              : t('premium.freeDescription')
            }
          </Text>
          
          {subscription?.expires_at && (
            <Text style={styles.statusText}>
              {t('premium.expiresOn')}: {new Date(subscription.expires_at).toLocaleDateString()}
            </Text>
          )}
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>{t('premium.premiumFeatures')}</Text>
          {premiumFeatures.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text style={styles.featureText}>{feature.text}</Text>
              {isPremium && <Text style={{color: theme.colors.success}}>✓</Text>}
            </View>
          ))}
        </View>

        {!isPremium && (
          <>
            <Text style={styles.priceText}>{t('premium.monthlyPrice')}</Text>
            
            <TouchableOpacity
              style={[styles.premiumButton, purchasing && styles.premiumButtonDisabled]}
              onPress={handlePurchasePremium}
              disabled={purchasing}>
              {purchasing ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.premiumButtonText}>{t('premium.subscribeToPremium')}</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          style={styles.restoreButton}
          onPress={handleRestorePurchases}
          disabled={loading}>
          <Text style={styles.restoreButtonText}>{t('premium.restorePurchases')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PremiumScreen;