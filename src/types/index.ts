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

export interface DailySummary {
  date: string;
  mood_average?: number;
  mood_count: number;
  total_calories: number;
  total_income: number;
  total_expenses: number;
  net_amount: number;
}