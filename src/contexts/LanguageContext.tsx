import React, {createContext, useContext, useEffect, useState, ReactNode} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getLocales} from 'react-native-localize';
import i18n from '../services/i18n';

type Language = 'en' | 'tr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: any) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({children}) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    initializeLanguage();
  }, []);

  const initializeLanguage = async () => {
    try {
      // Check for saved language preference
      const savedLanguage = await AsyncStorage.getItem('language');
      
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'tr')) {
        setLanguageState(savedLanguage);
        i18n.changeLanguage(savedLanguage);
      } else {
        // Use device locale if available
        const locales = getLocales();
        const deviceLanguage = locales[0]?.languageCode;
        
        if (deviceLanguage === 'tr') {
          setLanguageState('tr');
          i18n.changeLanguage('tr');
        } else {
          setLanguageState('en');
          i18n.changeLanguage('en');
        }
      }
    } catch (error) {
      console.error('Error initializing language:', error);
      setLanguageState('en');
      i18n.changeLanguage('en');
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      setLanguageState(lang);
      await AsyncStorage.setItem('language', lang);
      i18n.changeLanguage(lang);
    } catch (error) {
      console.error('Error setting language:', error);
    }
  };

  const t = (key: string, options?: any) => {
    return i18n.t(key, options);
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};