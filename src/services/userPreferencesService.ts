import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export interface UserPreferences {
  userId: string;
  categories: string[]; // e.g., ['tech', 'cultural', 'music', 'sports']
  eventFormat: 'all' | 'in-person' | 'virtual';
  maxPrice: number; // Max ticket price in INR, 0 means free only, 5000+ means any
  enableDiscountAlerts: boolean;
  enableEventAlerts: boolean;
  setupCompleted: boolean;
  updatedAt: string;
}

const PREFS_STORAGE_KEY_PREFIX = '@encore_user_preferences_';

export const DEFAULT_PREFERENCES: Omit<UserPreferences, 'userId'> = {
  categories: ['tech', 'cultural', 'music', 'sports'],
  eventFormat: 'all',
  maxPrice: 5000,
  enableDiscountAlerts: true,
  enableEventAlerts: true,
  setupCompleted: false,
  updatedAt: new Date().toISOString(),
};

/**
 * Retrieves preferences for a given user ID.
 */
export async function getUserPreferences(userId: string = 'demo-user-123'): Promise<UserPreferences> {
  try {
    const key = `${PREFS_STORAGE_KEY_PREFIX}${userId}`;
    const jsonStr = await AsyncStorage.getItem(key);
    if (jsonStr) {
      const data = JSON.parse(jsonStr);
      return { ...DEFAULT_PREFERENCES, userId, ...data };
    }
  } catch (error) {
    console.warn('Failed to load user preferences from storage:', error);
  }
  return { ...DEFAULT_PREFERENCES, userId };
}

/**
 * Saves updated preferences for a given user ID.
 */
export async function saveUserPreferences(
  userId: string = 'demo-user-123',
  prefsData: Partial<UserPreferences>
): Promise<UserPreferences> {
  try {
    const current = await getUserPreferences(userId);
    const updated: UserPreferences = {
      ...current,
      ...prefsData,
      userId,
      setupCompleted: true,
      updatedAt: new Date().toISOString(),
    };

    const key = `${PREFS_STORAGE_KEY_PREFIX}${userId}`;
    await AsyncStorage.setItem(key, JSON.stringify(updated));

    // Sync to Firestore if on native & logged in
    if (Platform.OS !== 'web') {
      try {
        const { getAuth } = require('@react-native-firebase/auth');
        const currentUser = getAuth().currentUser;
        if (currentUser && currentUser.uid === userId) {
          const FIREBASE_PROJECT_ID = 'encore-6a677';
          const token = await currentUser.getIdToken();
          const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/userPreferences/${userId}`;
          
          await fetch(url, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              fields: {
                categories: {
                  arrayValue: {
                    values: updated.categories.map((c) => ({ stringValue: c })),
                  },
                },
                eventFormat: { stringValue: updated.eventFormat },
                maxPrice: { integerValue: updated.maxPrice.toString() },
                enableDiscountAlerts: { booleanValue: updated.enableDiscountAlerts },
                enableEventAlerts: { booleanValue: updated.enableEventAlerts },
                setupCompleted: { booleanValue: true },
                updatedAt: { stringValue: updated.updatedAt },
              },
            }),
          });
        }
      } catch (fsErr) {
        console.warn('Firestore sync for preferences skipped:', fsErr);
      }
    }

    return updated;
  } catch (error) {
    console.error('Failed to save user preferences:', error);
    throw error;
  }
}
