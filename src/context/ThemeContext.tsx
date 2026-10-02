import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors, ColorsType } from '../theme/colors';

type ThemeType = 'light' | 'dark';
type ThemeModeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeType;
  themeMode: ThemeModeType;
  isDark: boolean;
  colors: ColorsType;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeModeType) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@encore_user_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeModeType>('dark');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load theme from storage on mount
  useEffect(() => {
    const loadPersistedTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        // Distinguish explicit preferences from unset/system
        if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
          setThemeModeState(savedTheme as ThemeModeType);
        } else {
          // If no preference or legacy preference exists, default to 'dark'
          setThemeModeState('dark');
        }
      } catch (e) {
        console.error('Failed to load theme preference', e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadPersistedTheme();
  }, []);

  // Determine active theme based on themeMode
  const activeTheme: ThemeType = themeMode === 'system'
    ? (systemColorScheme === 'dark' ? 'dark' : 'light')
    : themeMode === 'dark' ? 'dark' : 'light';

  const isDark = activeTheme === 'dark';
  const activeColors = isDark ? (darkColors as unknown as ColorsType) : lightColors;

  // Add listener for live updates when themeMode is 'system'
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      // Trigger a state refresh/re-render when appearance changes if in system mode
      if (themeMode === 'system') {
        console.log('[ThemeContext] System theme changed live to:', colorScheme);
      }
    });
    return () => subscription.remove();
  }, [themeMode]);

  // Debug logging
  useEffect(() => {
    console.log(
      `[ThemeContext Debug]\n` +
      `- Raw systemColorScheme: ${systemColorScheme}\n` +
      `- Current themeMode: ${themeMode}\n` +
      `- Final resolved theme: ${activeTheme}\n` +
      `- isDark: ${isDark}`
    );
  }, [systemColorScheme, themeMode, activeTheme, isDark]);

  const setThemeMode = async (mode: ThemeModeType) => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (e) {
      console.error('Failed to save theme preference', e);
    }
  };

  const toggleTheme = async () => {
    // Cycle: system -> light -> dark -> system
    let nextMode: ThemeModeType = 'system';
    if (themeMode === 'system') {
      nextMode = 'light';
    } else if (themeMode === 'light') {
      nextMode = 'dark';
    } else if (themeMode === 'dark') {
      nextMode = 'system';
    }
    await setThemeMode(nextMode);
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme: activeTheme,
        themeMode,
        isDark,
        colors: activeColors,
        toggleTheme,
        setThemeMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
