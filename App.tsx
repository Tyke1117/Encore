import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './src/screens/home/HomeScreen';
import SearchScreen from './src/screens/search/SearchScreen';
import CategoriesScreen from './src/screens/categories/CategoriesScreen';
import FavoritesScreen from './src/screens/favorites/FavoritesScreen';
import AnnouncementScreen from './src/screens/announcements/AnnouncementScreen';

import { colors } from './src/theme/colors';
import { spacing } from './src/theme/spacing';
import { typography } from './src/theme/fonts';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'search' | 'categories' | 'favorites' | 'announcements'>('home');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'search':
        return <SearchScreen />;
      case 'categories':
        return <CategoriesScreen />;
      case 'favorites':
        return <FavoritesScreen />;
      case 'announcements':
        return <AnnouncementScreen />;
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.appContainer}>
        <StatusBar barStyle="dark-content" />
        
        {/* Active Screen View */}
        <View style={styles.screenContainer}>
          {renderScreen()}
        </View>

        {/* Dynamic Dev Navigation Bar to switch between all five screens */}
        <View style={styles.navBar}>
          <TouchableOpacity
            style={[styles.navItem, currentScreen === 'home' && styles.navItemActive]}
            onPress={() => setCurrentScreen('home')}
          >
            <Text style={[styles.navText, currentScreen === 'home' && styles.navTextActive]}>
              Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, currentScreen === 'search' && styles.navItemActive]}
            onPress={() => setCurrentScreen('search')}
          >
            <Text style={[styles.navText, currentScreen === 'search' && styles.navTextActive]}>
              Search
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, currentScreen === 'categories' && styles.navItemActive]}
            onPress={() => setCurrentScreen('categories')}
          >
            <Text style={[styles.navText, currentScreen === 'categories' && styles.navTextActive]}>
              Browse
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, currentScreen === 'favorites' && styles.navItemActive]}
            onPress={() => setCurrentScreen('favorites')}
          >
            <Text style={[styles.navText, currentScreen === 'favorites' && styles.navTextActive]}>
              Saved
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, currentScreen === 'announcements' && styles.navItemActive]}
            onPress={() => setCurrentScreen('announcements')}
          >
            <Text style={[styles.navText, currentScreen === 'announcements' && styles.navTextActive]}>
              Updates
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContainer: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainerLowest,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
    paddingVertical: spacing.sm,
    paddingBottom: spacing.lg, // Safe padding for home indicator on modern devices
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 4,
  },
  navItem: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  navItemActive: {
    backgroundColor: colors.surfaceContainer,
  },
  navText: {
    ...typography.labelSm,
    color: colors.slate[500],
    fontWeight: '600',
  },
  navTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
});