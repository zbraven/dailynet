import {supabase} from './supabase';
import {MoodEntry, NutritionEntry, FinancialEntry, FinancialCategory, DailySummary} from '../types';

// Mood Services
export const moodService = {
  async create(mood_level: number, notes: string = ''): Promise<MoodEntry> {
    const {data, error} = await supabase
      .from('mood_entries')
      .insert({mood_level, notes})
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getToday(): Promise<MoodEntry[]> {
    const today = new Date().toISOString().split('T')[0];
    const {data, error} = await supabase
      .from('mood_entries')
      .select('*')
      .gte('created_at', `${today}T00:00:00.000Z`)
      .lt('created_at', `${today}T23:59:59.999Z`)
      .order('created_at', {ascending: false});
    
    if (error) throw error;
    return data || [];
  },

  async getRecent(limit: number = 10): Promise<MoodEntry[]> {
    const {data, error} = await supabase
      .from('mood_entries')
      .select('*')
      .order('created_at', {ascending: false})
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  },

  async delete(id: string): Promise<void> {
    const {error} = await supabase
      .from('mood_entries')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Nutrition Services
export const nutritionService = {
  async create(entry: Omit<NutritionEntry, 'id' | 'user_id' | 'created_at'>): Promise<NutritionEntry> {
    const {data, error} = await supabase
      .from('nutrition_entries')
      .insert(entry)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getToday(): Promise<NutritionEntry[]> {
    const today = new Date().toISOString().split('T')[0];
    const {data, error} = await supabase
      .from('nutrition_entries')
      .select('*')
      .gte('created_at', `${today}T00:00:00.000Z`)
      .lt('created_at', `${today}T23:59:59.999Z`)
      .order('created_at', {ascending: false});
    
    if (error) throw error;
    return data || [];
  },

  async update(id: string, updates: Partial<NutritionEntry>): Promise<NutritionEntry> {
    const {data, error} = await supabase
      .from('nutrition_entries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const {error} = await supabase
      .from('nutrition_entries')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Financial Services
export const financialService = {
  async create(entry: Omit<FinancialEntry, 'id' | 'user_id' | 'created_at'>): Promise<FinancialEntry> {
    const {data, error} = await supabase
      .from('financial_entries')
      .insert(entry)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getToday(): Promise<FinancialEntry[]> {
    const today = new Date().toISOString().split('T')[0];
    const {data, error} = await supabase
      .from('financial_entries')
      .select('*')
      .gte('created_at', `${today}T00:00:00.000Z`)
      .lt('created_at', `${today}T23:59:59.999Z`)
      .order('created_at', {ascending: false});
    
    if (error) throw error;
    return data || [];
  },

  async getRecent(limit: number = 50): Promise<FinancialEntry[]> {
    const {data, error} = await supabase
      .from('financial_entries')
      .select('*')
      .order('created_at', {ascending: false})
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  },

  async update(id: string, updates: Partial<FinancialEntry>): Promise<FinancialEntry> {
    const {data, error} = await supabase
      .from('financial_entries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const {error} = await supabase
      .from('financial_entries')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Financial Categories Services
export const categoriesService = {
  async getAll(): Promise<FinancialCategory[]> {
    const {data, error} = await supabase
      .from('financial_categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async create(category: Omit<FinancialCategory, 'id' | 'user_id' | 'created_at'>): Promise<FinancialCategory> {
    const {data, error} = await supabase
      .from('financial_categories')
      .insert(category)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<FinancialCategory>): Promise<FinancialCategory> {
    const {data, error} = await supabase
      .from('financial_categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const {error} = await supabase
      .from('financial_categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Dashboard Services
export const dashboardService = {
  async getDailySummary(date?: string): Promise<DailySummary> {
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    // Get mood data
    const {data: moodData} = await supabase
      .from('mood_entries')
      .select('mood_level')
      .gte('created_at', `${targetDate}T00:00:00.000Z`)
      .lt('created_at', `${targetDate}T23:59:59.999Z`);
    
    // Get nutrition data
    const {data: nutritionData} = await supabase
      .from('nutrition_entries')
      .select('calories')
      .gte('created_at', `${targetDate}T00:00:00.000Z`)
      .lt('created_at', `${targetDate}T23:59:59.999Z`);
    
    // Get financial data
    const {data: financialData} = await supabase
      .from('financial_entries')
      .select('type, amount')
      .gte('created_at', `${targetDate}T00:00:00.000Z`)
      .lt('created_at', `${targetDate}T23:59:59.999Z`);
    
    const mood_count = moodData?.length || 0;
    const mood_average = mood_count > 0 
      ? moodData!.reduce((sum, entry) => sum + entry.mood_level, 0) / mood_count 
      : undefined;
    
    const total_calories = nutritionData?.reduce((sum, entry) => sum + (entry.calories || 0), 0) || 0;
    
    const total_income = financialData?.filter(entry => entry.type === 'income')
      .reduce((sum, entry) => sum + entry.amount, 0) || 0;
    
    const total_expenses = financialData?.filter(entry => entry.type === 'expense')
      .reduce((sum, entry) => sum + entry.amount, 0) || 0;
    
    return {
      date: targetDate,
      mood_average,
      mood_count,
      total_calories,
      total_income,
      total_expenses,
      net_amount: total_income - total_expenses
    };
  }
};