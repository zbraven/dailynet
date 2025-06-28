import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {StatusBar, StyleSheet} from 'react-native';
import 'react-native-url-polyfill/auto';

import {AuthProvider, useAuth} from './contexts/AuthContext';
import {ThemeProvider} from './contexts/ThemeContext';
import {LanguageProvider} from './contexts/LanguageContext';
import {DatabaseProvider} from './contexts/DatabaseContext';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import MoodScreen from './screens/MoodScreen';
import NutritionScreen from './screens/NutritionScreen';
import FinanceScreen from './screens/FinanceScreen';
import HealthScreen from './screens/HealthScreen';
import AnalyticsScreen from './screens/AnalyticsScreen';
import SettingsScreen from './screens/SettingsScreen';
import LoadingScreen from './screens/LoadingScreen';

import {notificationService} from './services/notificationService';
import {healthService} from './services/healthService';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const {user, loading} = useAuth();

  useEffect(() => {
    if (user) {
      initializeServices();
    }
  }, [user]);

  const initializeServices = async () => {
    try {
      // Initialize notification service
      await notificationService.initialize();
      
      // Load and schedule notifications
      const settings = await notificationService.getNotificationSettings();
      if (settings) {
        await notificationService.scheduleReminders(settings);
      }
      
      // Initialize health service
      await healthService.initialize();
    } catch (error) {
      console.error('Error initializing services:', error);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Mood" component={MoodScreen} />
            <Stack.Screen name="Nutrition" component={NutritionScreen} />
            <Stack.Screen name="Finance" component={FinanceScreen} />
            <Stack.Screen name="Health" component={HealthScreen} />
            <Stack.Screen name="Analytics" component={AnalyticsScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <DatabaseProvider>
          <AuthProvider>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <AppNavigator />
          </AuthProvider>
        </DatabaseProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;