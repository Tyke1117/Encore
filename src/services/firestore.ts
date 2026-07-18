import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: 'user' | 'organizer' | string;
  createdAt?: string;
  updatedAt?: string;
}

const USERS_KEY = '@mock_firestore_users';

// Helper to get all users
const getAllUsers = async (): Promise<Record<string, UserProfile>> => {
  try {
    const data = await AsyncStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.error('Mock Firestore: Failed to get users', e);
    return {};
  }
};

/**
 * Creates a new user profile document in the mock 'users' collection.
 */
export const createUser = async (uid: string, userData: Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'>): Promise<void> => {
  const users = await getAllUsers();
  const newProfile: UserProfile = {
    uid,
    ...userData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  users[uid] = newProfile;
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
};

/**
 * Fetches a user profile document from the mock 'users' collection.
 */
export const getUser = async (uid: string): Promise<UserProfile | null> => {
  const users = await getAllUsers();
  return users[uid] || null;
};

/**
 * Updates an existing user profile document.
 */
export const updateUser = async (uid: string, updates: Partial<Omit<UserProfile, 'uid' | 'createdAt'>>): Promise<void> => {
  const users = await getAllUsers();
  if (users[uid]) {
    users[uid] = {
      ...users[uid],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
};

/**
 * Deletes a user profile document.
 */
export const deleteUser = async (uid: string): Promise<void> => {
  const users = await getAllUsers();
  if (users[uid]) {
    delete users[uid];
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
};
