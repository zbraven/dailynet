import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import {useTheme} from '../contexts/ThemeContext';
import {useLanguage} from '../contexts/LanguageContext';
import {financialService, categoriesService} from '../services/database';
import {FinancialEntry, FinancialCategory} from '../types';

const FinanceScreen = () => {
  const {theme} = useTheme();
  const {t} = useLanguage();
  const [showAddModal, setShowAddModal] = useState(false);
  const [entryType, setEntryType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<FinancialCategory[]>([]);
  const [todayEntries, setTodayEntries] = useState<FinancialEntry[]>([]);
  const [recentEntries, setRecentEntries] = useState<FinancialEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [categoriesData, todayData, recentData] = await Promise.all([
        categoriesService.getAll(),
        financialService.getToday(),
        financialService.getRecent(20),
      ]);
      
      setCategories(categoriesData);
      setTodayEntries(todayData);
      setRecentEntries(recentData);
    } catch (error) {
      console.error('Error loading financial data:', error);
    }
  };

  const handleSaveEntry = async () => {
    if (!amount || !description || !selectedCategory) {
      Alert.alert(t('common.error'), t('finance.fillAllFields'));
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert(t('common.error'), t('finance.invalidAmount'));
      return;
    }

    try {
      setLoading(true);
      await financialService.create({
        type: entryType,
        amount: numericAmount,
        description,
        category: selectedCategory,
      });
      
      setShowAddModal(false);
      resetForm();
      await loadData();
      Alert.alert(t('common.success'), t('finance.entrySaved'));
    } catch (error) {
      console.error('Error saving financial entry:', error);
      Alert.alert(t('common.error'), t('finance.saveFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    Alert.alert(
      t('common.delete'),
      t('finance.deleteConfirm'),
      [
        {text: t('common.cancel'), style: 'cancel'},
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await financialService.delete(id);
              await loadData();
            } catch (error) {
              console.error('Error deleting financial entry:', error);
            }
          }
        }
      ]
    );
  };

  const resetForm = () => {
    setAmount('');
    setDescription('');
    setSelectedCategory('');
    setEntryType('expense');
  };

  const getFilteredCategories = () => {
    return categories.filter(cat => cat.type === entryType);
  };

  const getTodaySummary = () => {
    const income = todayEntries
      .filter(entry => entry.type === 'income')
      .reduce((sum, entry) => sum + entry.amount, 0);
    
    const expenses = todayEntries
      .filter(entry => entry.type === 'expense')
      .reduce((sum, entry) => sum + entry.amount, 0);
    
    return {income, expenses, net: income - expenses};
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    } else if (date.toDateString() === yesterday.toDateString()) {
      return t('finance.yesterday');
    } else {
      return date.toLocaleDateString();
    }
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.color || theme.colors.primary;
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
    summaryCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.xs,
    },
    summaryLabel: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.textSecondary,
    },
    summaryValue: {
      fontSize: theme.typography.body.fontSize,
      fontWeight: '600',
    },
    incomeValue: {
      color: theme.colors.success,
    },
    expenseValue: {
      color: theme.colors.error,
    },
    netValue: {
      color: theme.colors.text,
    },
    addButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.md,
      borderRadius: 8,
      alignItems: 'center',
    },
    addButtonText: {
      color: '#FFFFFF',
      fontSize: theme.typography.body.fontSize,
      fontWeight: '600',
    },
    entryCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
    },
    categoryIndicator: {
      width: 4,
      height: 40,
      borderRadius: 2,
      marginRight: theme.spacing.md,
    },
    entryContent: {
      flex: 1,
    },
    entryDescription: {
      fontSize: theme.typography.body.fontSize,
      fontWeight: '600',
      color: theme.colors.text,
    },
    entryDetails: {
      fontSize: theme.typography.caption.fontSize,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    entryAmount: {
      fontSize: theme.typography.body.fontSize,
      fontWeight: '600',
      marginRight: theme.spacing.md,
    },
    deleteButton: {
      padding: theme.spacing.sm,
    },
    deleteText: {
      color: theme.colors.error,
      fontSize: theme.typography.caption.fontSize,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      padding: theme.spacing.lg,
      width: '90%',
      maxHeight: '80%',
    },
    modalTitle: {
      fontSize: theme.typography.h3.fontSize,
      fontWeight: theme.typography.h3.fontWeight as any,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    typeButtons: {
      flexDirection: 'row',
      marginBottom: theme.spacing.md,
    },
    typeButton: {
      flex: 1,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      marginRight: theme.spacing.sm,
      alignItems: 'center',
    },
    typeButtonActive: {
      backgroundColor: theme.colors.primary,
    },
    typeButtonText: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.text,
    },
    typeButtonTextActive: {
      color: '#FFFFFF',
      fontWeight: '600',
    },
    input: {
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      padding: theme.spacing.md,
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    categoryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: theme.spacing.md,
    },
    categoryButton: {
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      marginRight: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    categoryButtonSelected: {
      borderColor: theme.colors.primary,
    },
    categoryButtonText: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.text,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.spacing.lg,
    },
    modalButton: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      borderRadius: 8,
      alignItems: 'center',
      marginHorizontal: theme.spacing.sm,
    },
    cancelButton: {
      backgroundColor: theme.colors.surface,
    },
    saveButton: {
      backgroundColor: theme.colors.primary,
    },
    cancelButtonText: {
      color: theme.colors.text,
      fontSize: theme.typography.body.fontSize,
    },
    saveButtonText: {
      color: '#FFFFFF',
      fontSize: theme.typography.body.fontSize,
      fontWeight: '600',
    },
    saveButtonDisabled: {
      opacity: 0.6,
    },
  });

  const todaySummary = getTodaySummary();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('nav.finance')}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('finance.todaySummary')}</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t('finance.income')}</Text>
              <Text style={[styles.summaryValue, styles.incomeValue]}>
                {formatCurrency(todaySummary.income)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t('finance.expenses')}</Text>
              <Text style={[styles.summaryValue, styles.expenseValue]}>
                {formatCurrency(todaySummary.expenses)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t('finance.net')}</Text>
              <Text style={[styles.summaryValue, styles.netValue]}>
                {formatCurrency(todaySummary.net)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}>
            <Text style={styles.addButtonText}>{t('finance.addTransaction')}</Text>
          </TouchableOpacity>
        </View>

        {recentEntries.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('finance.recentTransactions')}</Text>
            {recentEntries.map((entry) => (
              <View key={entry.id} style={styles.entryCard}>
                <View
                  style={[
                    styles.categoryIndicator,
                    {backgroundColor: getCategoryColor(entry.category)},
                  ]}
                />
                <View style={styles.entryContent}>
                  <Text style={styles.entryDescription}>{entry.description}</Text>
                  <Text style={styles.entryDetails}>
                    {entry.category} • {formatDate(entry.created_at)}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.entryAmount,
                    entry.type === 'income' ? styles.incomeValue : styles.expenseValue,
                  ]}>
                  {entry.type === 'income' ? '+' : '-'}{formatCurrency(entry.amount)}
                </Text>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteEntry(entry.id)}>
                  <Text style={styles.deleteText}>{t('common.delete')}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('finance.addTransaction')}</Text>
            
            <View style={styles.typeButtons}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  entryType === 'expense' && styles.typeButtonActive,
                ]}
                onPress={() => {
                  setEntryType('expense');
                  setSelectedCategory('');
                }}>
                <Text
                  style={[
                    styles.typeButtonText,
                    entryType === 'expense' && styles.typeButtonTextActive,
                  ]}>
                  {t('finance.expense')}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  entryType === 'income' && styles.typeButtonActive,
                ]}
                onPress={() => {
                  setEntryType('income');
                  setSelectedCategory('');
                }}>
                <Text
                  style={[
                    styles.typeButtonText,
                    entryType === 'income' && styles.typeButtonTextActive,
                  ]}>
                  {t('finance.income')}
                </Text>
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.input}
              placeholder={t('finance.amount')}
              placeholderTextColor={theme.colors.textSecondary}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
            
            <TextInput
              style={styles.input}
              placeholder={t('finance.description')}
              placeholderTextColor={theme.colors.textSecondary}
              value={description}
              onChangeText={setDescription}
            />
            
            <Text style={styles.sectionTitle}>{t('finance.category')}</Text>
            <ScrollView style={{maxHeight: 150}}>
              <View style={styles.categoryGrid}>
                {getFilteredCategories().map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryButton,
                      selectedCategory === category.name && styles.categoryButtonSelected,
                    ]}
                    onPress={() => setSelectedCategory(category.name)}>
                    <Text style={styles.categoryButtonText}>{category.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowAddModal(false);
                  resetForm();
                }}>
                <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.saveButton,
                  loading && styles.saveButtonDisabled,
                ]}
                onPress={handleSaveEntry}
                disabled={loading}>
                <Text style={styles.saveButtonText}>{t('common.save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default FinanceScreen;