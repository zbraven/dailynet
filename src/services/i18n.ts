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
      
      // Settings
      'settings.title': 'Settings',
      'settings.language': 'Language',
      'settings.theme': 'Theme',
      'settings.notifications': 'Notifications',
      'settings.signOut': 'Sign Out',
      'settings.darkMode': 'Dark Mode',
      'settings.lightMode': 'Light Mode',
      
      // Common
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.success': 'Success',
      'common.cancel': 'Cancel',
      'common.save': 'Save',
      'common.delete': 'Delete',
      'common.edit': 'Edit',
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
      
      // Settings
      'settings.title': 'Ayarlar',
      'settings.language': 'Dil',
      'settings.theme': 'Tema',
      'settings.notifications': 'Bildirimler',
      'settings.signOut': 'Çıkış Yap',
      'settings.darkMode': 'Karanlık Mod',
      'settings.lightMode': 'Açık Mod',
      
      // Common
      'common.loading': 'Yükleniyor...',
      'common.error': 'Hata',
      'common.success': 'Başarılı',
      'common.cancel': 'İptal',
      'common.save': 'Kaydet',
      'common.delete': 'Sil',
      'common.edit': 'Düzenle',
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