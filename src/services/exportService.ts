import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import {supabase} from './supabase';
import {ExportOptions, TimeRange} from '../types';
import {subscriptionService} from './subscriptionService';

class ExportService {
  async exportData(options: ExportOptions): Promise<void> {
    // Check if user has premium access
    const isPremium = await subscriptionService.isPremiumUser();
    if (!isPremium) {
      throw new Error('Premium subscription required for data export');
    }

    const {startDate, endDate} = this.getDateRange(options.timeRange);
    const data = await this.fetchExportData(startDate, endDate, options.includeData);

    if (options.format === 'csv') {
      await this.exportToCSV(data, options);
    } else {
      await this.exportToPDF(data, options);
    }
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

  private async fetchExportData(
    startDate: string,
    endDate: string,
    includeData: ExportOptions['includeData']
  ): Promise<any> {
    const data: any = {};

    if (includeData.mood) {
      const {data: moodData} = await supabase
        .from('mood_entries')
        .select('*')
        .gte('created_at', `${startDate}T00:00:00.000Z`)
        .lte('created_at', `${endDate}T23:59:59.999Z`)
        .order('created_at');
      data.mood = moodData || [];
    }

    if (includeData.nutrition) {
      const {data: nutritionData} = await supabase
        .from('nutrition_entries')
        .select('*')
        .gte('created_at', `${startDate}T00:00:00.000Z`)
        .lte('created_at', `${endDate}T23:59:59.999Z`)
        .order('created_at');
      data.nutrition = nutritionData || [];
    }

    if (includeData.finance) {
      const {data: financeData} = await supabase
        .from('financial_entries')
        .select('*')
        .gte('created_at', `${startDate}T00:00:00.000Z`)
        .lte('created_at', `${endDate}T23:59:59.999Z`)
        .order('created_at');
      data.finance = financeData || [];
    }

    if (includeData.health) {
      const {data: healthData} = await supabase
        .from('health_data')
        .select('*')
        .gte('recorded_at', `${startDate}T00:00:00.000Z`)
        .lte('recorded_at', `${endDate}T23:59:59.999Z`)
        .order('recorded_at');
      data.health = healthData || [];
    }

    return data;
  }

  private async exportToCSV(data: any, options: ExportOptions): Promise<void> {
    let csvContent = '';

    // Add mood data
    if (data.mood && data.mood.length > 0) {
      csvContent += 'MOOD DATA\n';
      csvContent += 'Date,Time,Mood Level,Notes\n';
      data.mood.forEach((entry: any) => {
        const date = new Date(entry.created_at);
        csvContent += `${date.toLocaleDateString()},${date.toLocaleTimeString()},${entry.mood_level},"${entry.notes || ''}"\n`;
      });
      csvContent += '\n';
    }

    // Add nutrition data
    if (data.nutrition && data.nutrition.length > 0) {
      csvContent += 'NUTRITION DATA\n';
      csvContent += 'Date,Time,Meal Type,Food Name,Calories,Protein,Fat,Carbs,Serving Size\n';
      data.nutrition.forEach((entry: any) => {
        const date = new Date(entry.created_at);
        csvContent += `${date.toLocaleDateString()},${date.toLocaleTimeString()},${entry.meal_type},"${entry.food_name}",${entry.calories},${entry.protein},${entry.fat},${entry.carbs},"${entry.serving_size}"\n`;
      });
      csvContent += '\n';
    }

    // Add financial data
    if (data.finance && data.finance.length > 0) {
      csvContent += 'FINANCIAL DATA\n';
      csvContent += 'Date,Time,Type,Amount,Description,Category\n';
      data.finance.forEach((entry: any) => {
        const date = new Date(entry.created_at);
        csvContent += `${date.toLocaleDateString()},${date.toLocaleTimeString()},${entry.type},${entry.amount},"${entry.description}","${entry.category}"\n`;
      });
      csvContent += '\n';
    }

    // Add health data
    if (data.health && data.health.length > 0) {
      csvContent += 'HEALTH DATA\n';
      csvContent += 'Date,Time,Data Type,Value,Unit,Source\n';
      data.health.forEach((entry: any) => {
        const date = new Date(entry.recorded_at);
        csvContent += `${date.toLocaleDateString()},${date.toLocaleTimeString()},${entry.data_type},${entry.value},${entry.unit},${entry.source}\n`;
      });
    }

    // Save and share CSV file
    const fileName = `daily_net_export_${options.timeRange}_${new Date().toISOString().split('T')[0]}.csv`;
    const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

    await RNFS.writeFile(filePath, csvContent, 'utf8');

    await Share.open({
      url: `file://${filePath}`,
      type: 'text/csv',
      title: 'Export Daily Net Data',
    });
  }

  private async exportToPDF(data: any, options: ExportOptions): Promise<void> {
    // For PDF export, we would need a more complex implementation
    // This is a simplified version that creates a text-based PDF
    
    let content = 'DAILY NET DATA EXPORT\n\n';
    content += `Export Date: ${new Date().toLocaleDateString()}\n`;
    content += `Time Range: ${options.timeRange}\n\n`;

    // Add summary statistics
    if (data.mood && data.mood.length > 0) {
      const avgMood = data.mood.reduce((sum: number, entry: any) => sum + entry.mood_level, 0) / data.mood.length;
      content += `Average Mood: ${avgMood.toFixed(1)}/10\n`;
      content += `Mood Entries: ${data.mood.length}\n\n`;
    }

    if (data.nutrition && data.nutrition.length > 0) {
      const totalCalories = data.nutrition.reduce((sum: number, entry: any) => sum + (entry.calories || 0), 0);
      content += `Total Calories: ${Math.round(totalCalories)}\n`;
      content += `Nutrition Entries: ${data.nutrition.length}\n\n`;
    }

    if (data.finance && data.finance.length > 0) {
      const totalIncome = data.finance.filter((e: any) => e.type === 'income').reduce((sum: number, entry: any) => sum + entry.amount, 0);
      const totalExpenses = data.finance.filter((e: any) => e.type === 'expense').reduce((sum: number, entry: any) => sum + entry.amount, 0);
      content += `Total Income: $${totalIncome.toFixed(2)}\n`;
      content += `Total Expenses: $${totalExpenses.toFixed(2)}\n`;
      content += `Net Amount: $${(totalIncome - totalExpenses).toFixed(2)}\n\n`;
    }

    // Save as text file (in a real implementation, you'd use a PDF library)
    const fileName = `daily_net_export_${options.timeRange}_${new Date().toISOString().split('T')[0]}.txt`;
    const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

    await RNFS.writeFile(filePath, content, 'utf8');

    await Share.open({
      url: `file://${filePath}`,
      type: 'text/plain',
      title: 'Export Daily Net Data',
    });
  }
}

export const exportService = new ExportService();