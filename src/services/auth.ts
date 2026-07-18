import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUser, getUser, UserProfile } from './firestore';

const CURRENT_USER_UID_KEY = '@mock_auth_current_user_uid';
const USERS_KEY = '@mock_firestore_users';

// Helper to get all registered mockup users
const getAllUsers = async (): Promise<Record<string, UserProfile>> => {
  try {
    const data = await AsyncStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
};

/**
 * Mock login function.
 */
export const login = async (email: string, password: string): Promise<{ user: { uid: string } }> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const users = await getAllUsers();
  const matchedUser = Object.values(users).find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );

  if (!matchedUser) {
    const error = new Error('User not found.');
    (error as any).code = 'auth/user-not-found';
    throw error;
  }

  // Simulate password check (any password is valid for demo if email exists)
  await AsyncStorage.setItem(CURRENT_USER_UID_KEY, matchedUser.uid);
  return { user: { uid: matchedUser.uid } };
};

/**
 * Mock signUp function.
 */
export const signUp = async (
  email: string,
  password: string,
  name: string,
  role: 'user' | 'organizer' | string
): Promise<{ user: { uid: string } }> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const users = await getAllUsers();
  const exists = Object.values(users).some(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );

  if (exists) {
    const error = new Error('Email already in use.');
    (error as any).code = 'auth/email-already-in-use';
    throw error;
  }

  const mockUid = 'mock_uid_' + Math.random().toString(36).substring(2, 11);
  
  // Store custom fields in Mock Firestore database
  await createUser(mockUid, {
    name: name.trim(),
    email: email.trim(),
    role: role,
  });

  await AsyncStorage.setItem(CURRENT_USER_UID_KEY, mockUid);
  return { user: { uid: mockUid } };
};

/**
 * Mock logout function.
 */
export const logout = async (): Promise<void> => {
  await AsyncStorage.removeItem(CURRENT_USER_UID_KEY);
};

/**
 * Mock forgot password function.
 */
export const forgotPassword = async (email: string): Promise<void> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600));
  
  const users = await getAllUsers();
  const exists = Object.values(users).some(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );

  if (!exists) {
    const error = new Error('No user found with this email.');
    (error as any).code = 'auth/user-not-found';
    throw error;
  }
};

/**
 * Mock get current user function.
 */
export const getCurrentUser = async (): Promise<UserProfile | null> => {
  const uid = await AsyncStorage.getItem(CURRENT_USER_UID_KEY);
  if (!uid) return null;
  return getUser(uid);
};
