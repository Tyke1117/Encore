import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUserInfo, UserInfo } from '../services/userService';

export type UserRole = 'attendee' | 'organizer';

interface AuthContextType {
  user: UserInfo | null;
  role: UserRole;
  loading: boolean;
  setRole: (role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
}

const ROLE_STORAGE_KEY = '@encore_user_role';

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: 'attendee',
  loading: true,
  setRole: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [role, setRoleState] = useState<UserRole>('attendee');
  const [loading, setLoading] = useState(true);

  // Load persisted role from AsyncStorage on startup
  useEffect(() => {
    const loadRole = async () => {
      try {
        const savedRole = await AsyncStorage.getItem(ROLE_STORAGE_KEY);
        if (savedRole === 'organizer' || savedRole === 'attendee') {
          setRoleState(savedRole);
        }
      } catch (e) {
        console.error('Failed to load user role from storage', e);
      }
    };
    loadRole();
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ? getCurrentUserInfo(firebaseUser) : null);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const setRole = async (newRole: UserRole) => {
    setRoleState(newRole);
    try {
      await AsyncStorage.setItem(ROLE_STORAGE_KEY, newRole);
    } catch (e) {
      console.error('Failed to persist user role', e);
    }
  };

  const logout = async () => {
    await signOut(getAuth());
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, setRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
