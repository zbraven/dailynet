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
import {nutritionService} from '../services/database';
import {NutritionEntry} from '../types';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

// Simple food database - in a real app, this would be much larger
const FOOD_DATABASE = [
  {name: 'Apple', calories: 95, protein: 0.5, fat: 0.3, carbs: 25, serving: '1 medium'},
  {name: 'Banana', calories: 105, protein: 1.3, fat: 0.4, carbs: 27, serving: '1 medium'},
  {name: 'Chicken Breast', calories: 165, protein: 31, fat: 3.6, carbs: 0, serving: '100g'},
  {name: 'Rice', calories: 130, protein: 2.7, fat: 0.3, carbs: 28, serving: '100g cooked'},
  {name: 'Bread', calories: 265, protein: 9, fat: 3.2, carbs: 49, serving: '100g'},
  {name: 'Egg', calories: 155, protein: 13, fat: 11, carbs: 1.1, serving: '1 large'},
  {name: 'Milk', calories: 42, protein: 3.4, fat: 1, carbs: 5, serving: '100ml'},
  {name: 'Yogurt', calories: 59, protein: 10, fat: 0.4, carbs: 3.6, serving: '100g'},
  {name: 'Salmon', calories: 208, protein: 20, fat: 12, carbs: 0, serving: '100g'},
  {name: 'Broccoli', calories: 34, protein: 2.8, fat: 0.4, carbs: 7, serving: '100g'},
];

const NutritionScreen = () => {
  const {theme} = useTheme();
  const {t} = useLanguage();
  const [selectedMealType, setSelectedMealType] = useState<typeof MEAL_TYPES[number]>('breakfast');
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [todayEntries, setTodayEntries] = useState<NutritionEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTodayEntries();
  }, []);

  const loadTodayEntries = async () => {
    try {
      const entries = await nutritionService.getToday();
      setTodayEntries(entries);
    } catch (error) {
      console.error('Error loading nutrition entries:', error);
    }
  };

  const handleAddFood = async (food: typeof FOOD_DATABASE[0]) => {
    try {
      setLoading(true);
      await nutritionService.create({
        meal_type: selectedMealType,
        food_name: food.name,
        calories: food.calories,
        protein: food.protein,
        fat: food.fat,
        carbs: food.carbs,
        serving_size: food.serving,
      });
      
      setShowFoodModal(false);
      setSearchQuery('');
      await loadTodayEntries();
      Alert.alert(t('common.success'), t('nutrition.foodAdded'));
    } catch (error) {
      console.error('Error adding food:', error);
      Alert.alert(t('common.error'), t('nutrition.addFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    Alert.alert(
      t('common.delete'),
      t('nutrition.deleteConfirm'),
      [
        {text: t('common.cancel'), style: 'cancel'},
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await nutritionService.delete(id);
              await loadTodayEntries();
            } catch (error) {
              console.error('Error deleting nutrition entry:', error);
            }
          }
        }
      ]
    );
  };

  const filteredFoods = FOOD_DATABASE.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTotalNutrition = () => {
    return todayEntries.reduce(
      (totals, entry) => ({
        calories: totals.calories + (entry.calories || 0),
        protein: totals.protein + (entry.protein || 0),
        fat: totals.fat + (entry.fat || 0),
        carbs: totals.carbs + (entry.carbs || 0),
      }),
      {calories: 0, protein: 0, fat: 0, carbs: 0}
    );
  };

  const getMealEntries = (mealType: string) => {
    return todayEntries.filter(entry => entry.meal_type === mealType);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
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
      color: theme.colors.text,
    },
    mealTypeButtons: {
      flexDirection: 'row',
      marginBottom: theme.spacing.md,
    },
    mealTypeButton: {
      flex: 1,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      marginRight: theme.spacing.sm,
      alignItems: 'center',
    },
    mealTypeButtonActive: {
      backgroundColor: theme.colors.primary,
    },
    mealTypeText: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.text,
      textTransform: 'capitalize',
    },
    mealTypeTextActive: {
      color: '#FFFFFF',
      fontWeight: '600',
    },
    addFoodButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.md,
      borderRadius: 8,
      alignItems: 'center',
    },
    addFoodText: {
      color: '#FFFFFF',
      fontSize: theme.typography.body.fontSize,
      fontWeight: '600',
    },
    mealSection: {
      marginBottom: theme.spacing.lg,
    },
    mealTitle: {
      fontSize: theme.typography.h3.fontSize,
      fontWeight: theme.typography.h3.fontWeight as any,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      textTransform: 'capitalize',
    },
    entryCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    entryContent: {
      flex: 1,
    },
    entryName: {
      fontSize: theme.typography.body.fontSize,
      fontWeight: '600',
      color: theme.colors.text,
    },
    entryDetails: {
      fontSize: theme.typography.caption.fontSize,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
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
    searchInput: {
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      padding: theme.spacing.md,
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    foodItem: {
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    foodName: {
      fontSize: theme.typography.body.fontSize,
      fontWeight: '600',
      color: theme.colors.text,
    },
    foodNutrition: {
      fontSize: theme.typography.caption.fontSize,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
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
    cancelButtonText: {
      color: theme.colors.text,
      fontSize: theme.typography.body.fontSize,
    },
  });

  const totalNutrition = getTotalNutrition();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('nav.nutrition')}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('nutrition.todaySummary')}</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t('nutrition.calories')}</Text>
              <Text style={styles.summaryValue}>{Math.round(totalNutrition.calories)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t('nutrition.protein')}</Text>
              <Text style={styles.summaryValue}>{Math.round(totalNutrition.protein)}g</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t('nutrition.fat')}</Text>
              <Text style={styles.summaryValue}>{Math.round(totalNutrition.fat)}g</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t('nutrition.carbs')}</Text>
              <Text style={styles.summaryValue}>{Math.round(totalNutrition.carbs)}g</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('nutrition.addFood')}</Text>
          <View style={styles.mealTypeButtons}>
            {MEAL_TYPES.map((mealType) => (
              <TouchableOpacity
                key={mealType}
                style={[
                  styles.mealTypeButton,
                  selectedMealType === mealType && styles.mealTypeButtonActive,
                ]}
                onPress={() => setSelectedMealType(mealType)}>
                <Text
                  style={[
                    styles.mealTypeText,
                    selectedMealType === mealType && styles.mealTypeTextActive,
                  ]}>
                  {t(`nutrition.${mealType}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity
            style={styles.addFoodButton}
            onPress={() => setShowFoodModal(true)}>
            <Text style={styles.addFoodText}>{t('nutrition.selectFood')}</Text>
          </TouchableOpacity>
        </View>

        {MEAL_TYPES.map((mealType) => {
          const mealEntries = getMealEntries(mealType);
          if (mealEntries.length === 0) return null;
          
          return (
            <View key={mealType} style={styles.mealSection}>
              <Text style={styles.mealTitle}>{t(`nutrition.${mealType}`)}</Text>
              {mealEntries.map((entry) => (
                <View key={entry.id} style={styles.entryCard}>
                  <View style={styles.entryContent}>
                    <Text style={styles.entryName}>{entry.food_name}</Text>
                    <Text style={styles.entryDetails}>
                      {Math.round(entry.calories || 0)} cal • {entry.serving_size} • {formatTime(entry.created_at)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteEntry(entry.id)}>
                    <Text style={styles.deleteText}>{t('common.delete')}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          );
        })}
      </ScrollView>

      <Modal visible={showFoodModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('nutrition.selectFood')}</Text>
            
            <TextInput
              style={styles.searchInput}
              placeholder={t('nutrition.searchFood')}
              placeholderTextColor={theme.colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            
            <ScrollView style={{maxHeight: 300}}>
              {filteredFoods.map((food, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.foodItem}
                  onPress={() => handleAddFood(food)}
                  disabled={loading}>
                  <Text style={styles.foodName}>{food.name}</Text>
                  <Text style={styles.foodNutrition}>
                    {food.calories} cal • {food.protein}g protein • {food.serving}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowFoodModal(false);
                  setSearchQuery('');
                }}>
                <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default NutritionScreen;