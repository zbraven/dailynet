import {supabase} from './supabase';
import {AnalyticsData, TimeRange, TrendData} from '../types';

class AnalyticsService {
  async getAnalytics(timeRange: TimeRange): Promise<AnalyticsData> {
    const {startDate, endDate} = this.getDateRange(timeRange);
    
    const [moodTrend, nutritionTrend, financeTrend, healthTrend] = await Promise.all([
      this.getMoodTrend(startDate, endDate, timeRange),
      this.getNutritionTrend(startDate, endDate, timeRange),
      this.getFinanceTrend(startDate, endDate, timeRange),
      this.getHealthTrend(startDate, endDate, timeRange),
    ]);

    const summary = this.calculateSummary(moodTrend, nutritionTrend, financeTrend, healthTrend);

    return {
      timeRange,
      startDate,
      endDate,
      summary,
      moodTrend,
      nutritionTrend,
      financeTrend,
      healthTrend,
    };
  }

  private getDateRange(timeRange: TimeRange): {startDate: string; endDate: string} {
    const endDate = new Date();
    const startDate = new Date();

    switch (timeRange) {
      case 'week':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'month':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case 'year':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
    }

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };
  }

  private async getMoodTrend(startDate: string, endDate: string, timeRange: TimeRange): Promise<TrendData[]> {
    try {
      const {data, error} = await supabase
        .from('mood_entries')
        .select('mood_level, created_at')
        .gte('created_at', `${startDate}T00:00:00.000Z`)
        .lte('created_at', `${endDate}T23:59:59.999Z`)
        .order('created_at');

      if (error) throw error;

      return this.groupDataByPeriod(data || [], 'mood_level', timeRange, startDate, endDate);
    } catch (error) {
      console.error('Error getting mood trend:', error);
      return [];
    }
  }

  private async getNutritionTrend(startDate: string, endDate: string, timeRange: TimeRange): Promise<TrendData[]> {
    try {
      const {data, error} = await supabase
        .from('nutrition_entries')
        .select('calories, created_at')
        .gte('created_at', `${startDate}T00:00:00.000Z`)
        .lte('created_at', `${endDate}T23:59:59.999Z`)
        .order('created_at');

      if (error) throw error;

      return this.groupDataByPeriod(data || [], 'calories', timeRange, startDate, endDate, 'sum');
    } catch (error) {
      console.error('Error getting nutrition trend:', error);
      return [];
    }
  }

  private async getFinanceTrend(startDate: string, endDate: string, timeRange: TimeRange): Promise<TrendData[]> {
    try {
      const {data, error} = await supabase
        .from('financial_entries')
        .select('type, amount, created_at')
        .gte('created_at', `${startDate}T00:00:00.000Z`)
        .lte('created_at', `${endDate}T23:59:59.999Z`)
        .order('created_at');

      if (error) throw error;

      // Group by date and calculate net amount (income - expenses)
      const groupedData = this.groupFinancialData(data || [], timeRange, startDate, endDate);
      return groupedData;
    } catch (error) {
      console.error('Error getting finance trend:', error);
      return [];
    }
  }

  private async getHealthTrend(startDate: string, endDate: string, timeRange: TimeRange): Promise<TrendData[]> {
    try {
      const {data, error} = await supabase
        .from('health_data')
        .select('data_type, value, recorded_at')
        .gte('recorded_at', `${startDate}T00:00:00.000Z`)
        .lte('recorded_at', `${endDate}T23:59:59.999Z`)
        .order('recorded_at');

      if (error) throw error;

      // Focus on steps data for the trend
      const stepsData = (data || []).filter(item => item.data_type === 'steps');
      return this.groupDataByPeriod(stepsData, 'value', timeRange, startDate, endDate, 'sum');
    } catch (error) {
      console.error('Error getting health trend:', error);
      return [];
    }
  }

  private groupDataByPeriod(
    data: any[],
    valueKey: string,
    timeRange: TimeRange,
    startDate: string,
    endDate: string,
    aggregation: 'avg' | 'sum' = 'avg'
  ): TrendData[] {
    const result: TrendData[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Generate all dates in the range
    const dates: string[] = [];
    const current = new Date(start);
    
    while (current <= end) {
      dates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }

    // Group data by date
    const groupedByDate: {[key: string]: number[]} = {};
    
    data.forEach(item => {
      const dateKey = item.created_at ? 
        new Date(item.created_at).toISOString().split('T')[0] :
        new Date(item.recorded_at).toISOString().split('T')[0];
      
      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = [];
      }
      groupedByDate[dateKey].push(item[valueKey] || 0);
    });

    // Calculate aggregated values for each date
    dates.forEach(date => {
      const values = groupedByDate[date] || [];
      let aggregatedValue = 0;

      if (values.length > 0) {
        if (aggregation === 'avg') {
          aggregatedValue = values.reduce((sum, val) => sum + val, 0) / values.length;
        } else {
          aggregatedValue = values.reduce((sum, val) => sum + val, 0);
        }
      }

      const trendItem: TrendData = {
        date,
        [valueKey === 'mood_level' ? 'mood_average' : 
         valueKey === 'calories' ? 'total_calories' :
         valueKey === 'value' ? 'steps' : valueKey]: aggregatedValue,
      };

      result.push(trendItem);
    });

    return result;
  }

  private groupFinancialData(
    data: any[],
    timeRange: TimeRange,
    startDate: string,
    endDate: string
  ): TrendData[] {
    const result: TrendData[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Generate all dates in the range
    const dates: string[] = [];
    const current = new Date(start);
    
    while (current <= end) {
      dates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }

    // Group data by date
    const groupedByDate: {[key: string]: {income: number; expenses: number}} = {};
    
    data.forEach(item => {
      const dateKey = new Date(item.created_at).toISOString().split('T')[0];
      
      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = {income: 0, expenses: 0};
      }
      
      if (item.type === 'income') {
        groupedByDate[dateKey].income += item.amount;
      } else {
        groupedByDate[dateKey].expenses += item.amount;
      }
    });

    // Calculate net amount for each date
    dates.forEach(date => {
      const dayData = groupedByDate[date] || {income: 0, expenses: 0};
      const netAmount = dayData.income - dayData.expenses;

      result.push({
        date,
        total_income: dayData.income,
        total_expenses: dayData.expenses,
        net_amount: netAmount,
      });
    });

    return result;
  }

  private calculateSummary(
    moodTrend: TrendData[],
    nutritionTrend: TrendData[],
    financeTrend: TrendData[],
    healthTrend: TrendData[]
  ) {
    const moodValues = moodTrend.map(item => item.mood_average).filter(val => val && val > 0);
    const calorieValues = nutritionTrend.map(item => item.total_calories).filter(val => val && val > 0);
    const incomeValues = financeTrend.map(item => item.total_income || 0);
    const expenseValues = financeTrend.map(item => item.total_expenses || 0);
    const stepsValues = healthTrend.map(item => item.steps).filter(val => val && val > 0);

    return {
      avgMood: moodValues.length > 0 ? moodValues.reduce((sum, val) => sum + val, 0) / moodValues.length : undefined,
      avgCalories: calorieValues.length > 0 ? calorieValues.reduce((sum, val) => sum + val, 0) / calorieValues.length : undefined,
      totalIncome: incomeValues.reduce((sum, val) => sum + val, 0),
      totalExpenses: expenseValues.reduce((sum, val) => sum + val, 0),
      avgSteps: stepsValues.length > 0 ? stepsValues.reduce((sum, val) => sum + val, 0) / stepsValues.length : undefined,
      avgSleep: undefined, // Will be implemented when sleep data is available
    };
  }

  async exportData(format: 'csv' | 'pdf', timeRange: TimeRange): Promise<string> {
    // This would be a premium feature
    // For now, return a placeholder
    throw new Error('Export feature requires premium subscription');
  }
}

export const analyticsService = new AnalyticsService();