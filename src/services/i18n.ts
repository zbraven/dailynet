import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Authentication
      'auth.welcome': 'Welcome to Daily Net',
      'auth.subtitle': 'Track your daily life with ease',
      'auth.signInWithGoogle': 'Sign in with Google',
      'auth.signInWithApple': 'Sign in with Apple',
      'auth.signInRequired': 'Please sign in to continue',
      
      // Navigation
      'nav.home': 'Home',
      'nav.mood': 'Mood',
      'nav.nutrition': 'Nutrition',
      'nav.finance': 'Finance',
      'nav.health': 'Health',
      'nav.settings': 'Settings',
      
      // Home
      'home.welcome': 'Welcome back!',
      'home.todaysSummary': "Today's Summary",
      'home.quickActions': 'Quick Actions',
      'home.logMood': 'Log Mood',
      'home.addMeal': 'Add Meal',
      'home.addTransaction': 'Add Transaction',
      
      // Mood
      'mood.howAreYouFeeling': 'How are you feeling?',
      'mood.notes': 'Notes (Optional)',
      'mood.notesPlaceholder': 'How was your day? What affected your mood?',
      'mood.saveMood': 'Save Mood',
      'mood.todayEntries': "Today's Mood Entries",
      'mood.selectMoodFirst': 'Please select a mood level first',
      'mood.moodSaved': 'Mood saved successfully!',
      'mood.saveFailed': 'Failed to save mood. Please try again.',
      'mood.deleteConfirm': 'Are you sure you want to delete this mood entry?',
      
      // Nutrition
      'nutrition.todaySummary': "Today's Nutrition",
      'nutrition.calories': 'Calories',
      'nutrition.protein': 'Protein',
      'nutrition.fat': 'Fat',
      'nutrition.carbs': 'Carbs',
      'nutrition.addFood': 'Add Food',
      'nutrition.selectFood': 'Select Food',
      'nutrition.searchFood': 'Search foods...',
      'nutrition.breakfast': 'Breakfast',
      'nutrition.lunch': 'Lunch',
      'nutrition.dinner': 'Dinner',
      'nutrition.snack': 'Snack',
      'nutrition.foodAdded': 'Food added successfully!',
      'nutrition.addFailed': 'Failed to add food. Please try again.',
      'nutrition.deleteConfirm': 'Are you sure you want to delete this food entry?',
      
      // Finance
      'finance.todaySummary': "Today's Finance",
      'finance.income': 'Income',
      'finance.expenses': 'Expenses',
      'finance.expense': 'Expense',
      'finance.net': 'Net',
      'finance.addTransaction': 'Add Transaction',
      'finance.recentTransactions': 'Recent Transactions',
      'finance.amount': 'Amount',
      'finance.description': 'Description',
      'finance.category': 'Category',
      'finance.yesterday': 'Yesterday',
      'finance.fillAllFields': 'Please fill all fields',
      'finance.invalidAmount': 'Please enter a valid amount',
      'finance.entrySaved': 'Transaction saved successfully!',
      'finance.saveFailed': 'Failed to save transaction. Please try again.',
      'finance.deleteConfirm': 'Are you sure you want to delete this transaction?',
      
      // Health
      'health.permissionRequired': 'Health Permission Required',
      'health.permissionMessage': 'To sync your health data, please grant access to Apple Health or Google Fit.',
      'health.grantPermission': 'Grant Permission',
      'health.syncNow': 'Sync Health Data',
      'health.syncing': 'Syncing...',
      'health.syncSuccess': 'Health data synced successfully!',
      'health.syncFailed': 'Failed to sync health data. Please try again.',
      'health.todayData': "Today's Health Data",
      'health.steps': 'Steps',
      'health.sleep': 'Sleep',
      'health.weight': 'Weight',
      'health.caloriesBurned': 'Calories Burned',
      
      // Settings
      'settings.title': 'Settings',
      'settings.appearance': 'Appearance',
      'settings.language': 'Language',
      'settings.theme': 'Theme',
      'settings.notifications': 'Notifications',
      'settings.signOut': 'Sign Out',
      'settings.signOutConfirm': 'Are you sure you want to sign out?',
      'settings.darkMode': 'Dark Mode',
      'settings.lightMode': 'Light Mode',
      'settings.moodReminders': 'Mood Reminders',
      'settings.nutritionReminders': 'Nutrition Reminders',
      'settings.financeReminders': 'Finance Reminders',
      'settings.reminderTimes': 'Reminder Times',
      'settings.addReminderTime': 'Add Reminder Time',
      'settings.edit': 'Edit',
      'settings.enableNotifications': 'Enable Notifications',
      'settings.notificationsEnabled': 'Notifications enabled successfully!',
      'settings.notificationsDenied': 'Notification permissions denied. Please enable them in device settings.',
      'settings.updateFailed': 'Failed to update settings. Please try again.',
      
      // Common
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.success': 'Success',
      'common.cancel': 'Cancel',
      'common.save': 'Save',
      'common.delete': 'Delete',
      'common.edit': 'Edit',
      'common.noData': 'No data',
    },
  },
  tr: {
    translation: {
      // Authentication
      'auth.welcome': 'Daily Net\'e Hoş Geldiniz',
      'auth.subtitle': 'Günlük yaşamınızı kolayca takip edin',
      'auth.signInWithGoogle': 'Google ile Giriş Yap',
      'auth.signInWithApple': 'Apple ile Giriş Yap',
      'auth.signInRequired': 'Devam etmek için lütfen giriş yapın',
      
      // Navigation
      'nav.home': 'Ana Sayfa',
      'nav.mood': 'Ruh Hali',
      'nav.nutrition': 'Beslenme',
      'nav.finance': 'Finans',
      'nav.health': 'Sağlık',
      'nav.settings': 'Ayarlar',
      
      // Home
      'home.welcome': 'Tekrar hoş geldiniz!',
      'home.todaysSummary': 'Bugünün Özeti',
      'home.quickActions': 'Hızlı İşlemler',
      'home.logMood': 'Ruh Hali Kaydet',
      'home.addMeal': 'Öğün Ekle',
      'home.addTransaction': 'İşlem Ekle',
      
      // Mood
      'mood.howAreYouFeeling': 'Nasıl hissediyorsunuz?',
      'mood.notes': 'Notlar (İsteğe Bağlı)',
      'mood.notesPlaceholder': 'Gününüz nasıl geçti? Ruh halinizi ne etkiledi?',
      'mood.saveMood': 'Ruh Halini Kaydet',
      'mood.todayEntries': 'Bugünün Ruh Hali Kayıtları',
      'mood.selectMoodFirst': 'Lütfen önce bir ruh hali seviyesi seçin',
      'mood.moodSaved': 'Ruh hali başarıyla kaydedildi!',
      'mood.saveFailed': 'Ruh hali kaydedilemedi. Lütfen tekrar deneyin.',
      'mood.deleteConfirm': 'Bu ruh hali kaydını silmek istediğinizden emin misiniz?',
      
      // Nutrition
      'nutrition.todaySummary': 'Bugünün Beslenmesi',
      'nutrition.calories': 'Kalori',
      'nutrition.protein': 'Protein',
      'nutrition.fat': 'Yağ',
      'nutrition.carbs': 'Karbonhidrat',
      'nutrition.addFood': 'Yiyecek Ekle',
      'nutrition.selectFood': 'Yiyecek Seç',
      'nutrition.searchFood': 'Yiyecek ara...',
      'nutrition.breakfast': 'Kahvaltı',
      'nutrition.lunch': 'Öğle Yemeği',
      'nutrition.dinner': 'Akşam Yemeği',
      'nutrition.snack': 'Atıştırmalık',
      'nutrition.foodAdded': 'Yiyecek başarıyla eklendi!',
      'nutrition.addFailed': 'Yiyecek eklenemedi. Lütfen tekrar deneyin.',
      'nutrition.deleteConfirm': 'Bu yiyecek kaydını silmek istediğinizden emin misiniz?',
      
      // Finance
      'finance.todaySummary': 'Bugünün Finansı',
      'finance.income': 'Gelir',
      'finance.expenses': 'Giderler',
      'finance.expense': 'Gider',
      'finance.net': 'Net',
      'finance.addTransaction': 'İşlem Ekle',
      'finance.recentTransactions': 'Son İşlemler',
      'finance.amount': 'Tutar',
      'finance.description': 'Açıklama',
      'finance.category': 'Kategori',
      'finance.yesterday': 'Dün',
      'finance.fillAllFields': 'Lütfen tüm alanları doldurun',
      'finance.invalidAmount': 'Lütfen geçerli bir tutar girin',
      'finance.entrySaved': 'İşlem başarıyla kaydedildi!',
      'finance.saveFailed': 'İşlem kaydedilemedi. Lütfen tekrar deneyin.',
      'finance.deleteConfirm': 'Bu işlemi silmek istediğinizden emin misiniz?',
      
      // Health
      'health.permissionRequired': 'Sağlık İzni Gerekli',
      'health.permissionMessage': 'Sağlık verilerinizi senkronize etmek için Apple Health veya Google Fit erişimine izin verin.',
      'health.grantPermission': 'İzin Ver',
      'health.syncNow': 'Sağlık Verilerini Senkronize Et',
      'health.syncing': 'Senkronize ediliyor...',
      'health.syncSuccess': 'Sağlık verileri başarıyla senkronize edildi!',
      'health.syncFailed': 'Sağlık verileri senkronize edilemedi. Lütfen tekrar deneyin.',
      'health.todayData': 'Bugünün Sağlık Verileri',
      'health.steps': 'Adım',
      'health.sleep': 'Uyku',
      'health.weight': 'Kilo',
      'health.caloriesBurned': 'Yakılan Kalori',
      
      // Settings
      'settings.title': 'Ayarlar',
      'settings.appearance': 'Görünüm',
      'settings.language': 'Dil',
      'settings.theme': 'Tema',
      'settings.notifications': 'Bildirimler',
      'settings.signOut': 'Çıkış Yap',
      'settings.signOutConfirm': 'Çıkış yapmak istediğinizden emin misiniz?',
      'settings.darkMode': 'Karanlık Mod',
      'settings.lightMode': 'Açık Mod',
      'settings.moodReminders': 'Ruh Hali Hatırlatıcıları',
      'settings.nutritionReminders': 'Beslenme Hatırlatıcıları',
      'settings.financeReminders': 'Finans Hatırlatıcıları',
      'settings.reminderTimes': 'Hatırlatıcı Saatleri',
      'settings.addReminderTime': 'Hatırlatıcı Saati Ekle',
      'settings.edit': 'Düzenle',
      'settings.enableNotifications': 'Bildirimleri Etkinleştir',
      'settings.notificationsEnabled': 'Bildirimler başarıyla etkinleştirildi!',
      'settings.notificationsDenied': 'Bildirim izinleri reddedildi. Lütfen cihaz ayarlarından etkinleştirin.',
      'settings.updateFailed': 'Ayarlar güncellenemedi. Lütfen tekrar deneyin.',
      
      // Common
      'common.loading': 'Yükleniyor...',
      'common.error': 'Hata',
      'common.success': 'Başarılı',
      'common.cancel': 'İptal',
      'common.save': 'Kaydet',
      'common.delete': 'Sil',
      'common.edit': 'Düzenle',
      'common.noData': 'Veri yok',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;