import React, {createContext, useContext, useEffect, ReactNode} from 'react';
import {supabase} from '../services/supabase';
import {useAuth} from './AuthContext';

interface DatabaseContextType {
  // Database operations will be added here
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

interface DatabaseProviderProps {
  children: ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({children}) => {
  const {user} = useAuth();

  useEffect(() => {
    if (user) {
      initializeUserData();
    }
  }, [user]);

  const initializeUserData = async () => {
    try {
      // Initialize user profile if it doesn't exist
      const {data: profile, error} = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create it
        const {error: insertError} = await supabase
          .from('profiles')
          .insert({
            id: user?.id,
            email: user?.email,
            name: user?.name,
            provider: user?.provider,
            created_at: new Date().toISOString(),
          });

        if (insertError) {
          console.error('Error creating profile:', insertError);
        }
      }
    } catch (error) {
      console.error('Error initializing user data:', error);
    }
  };

  const value: DatabaseContextType = {
    // Database operations will be added here
  };

  return <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>;
};