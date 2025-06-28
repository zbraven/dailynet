export interface MoodEntry {
  id: string;
  user_id: string;
  mood_level: number;
  notes: string;
  created_at: string;
}

export interface NutritionEntry {
  id: string;
  user_id: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  food_name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  serving_size: string;
  created_at: string;
}

export interface FinancialEntry {
  id: string;
  user_id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  created_at: string;
}

export interface FinancialCategory {
  id: string;
  user_id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  created_at: string;
}

export interface HealthData {
  id: string;
  user_id: string;
  data_type: 'steps' | 'sleep' | 'weight' | 'heart_rate' | 'calories_burned';
  value: number;
  unit: string;
  recorded_at: string;
  source: 'apple_health' | 'google_health' | 'manual';
  created_at: string;
}

export interface NotificationSettings {
  id: string;
  user_id: string;
  mood_reminders: boolean;
  nutrition_reminders: boolean;
  finance_reminders: boolean;
  reminder_times: string[];
  created_at: string;
  updated_at: string;
}

export interface DailySummary {
  date: string;
  mood_average?: number;
  mood_count: number;
  total_calories: number;
  total_income: number;
  total_expenses: number;
  net_amount: number;
  steps?: number;
  sleep_hours?: number;
  weight?: number;
  calories_burned?: number;
}

export type TimeRange = 'week' | 'month' | 'year';

export interface TrendData {
  date: string;
  mood_average?: number;
  total_calories?: number;
  total_income?: number;
  total_expenses?: number;
  net_amount?: number;
  steps?: number;
  sleep_hours?: number;
}

export interface AnalyticsData {
  timeRange: TimeRange;
  startDate: string;
  endDate: string;
  summary: {
    avgMood?: number;
    avgCalories?: number;
    totalIncome: number;
    totalExpenses: number;
    avgSteps?: number;
    avgSleep?: number;
  };
  moodTrend: TrendData[];
  nutritionTrend: TrendData[];
  financeTrend: TrendData[];
  healthTrend: TrendData[];
}