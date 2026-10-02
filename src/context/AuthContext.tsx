import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { getCurrentUserInfo, UserInfo } from '../services/userService';

// Default mock user for web preview & fast testing
const DEFAULT_WEB_USER: UserInfo = {
  uid: 'demo-user-123',
  email: 'organizer@encore.app',
  name: 'Demo Organizer',
  photoURL: null,
  emailVerified: true,
};

interface AuthContextType {
  user: UserInfo | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: DEFAULT_WEB_USER,
  loading: false,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(DEFAULT_WEB_USER);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web') {
      // On Web, react-native-firebase native modules are inactive.
      // Set default demo user so web rendering works instantly.
      setUser(DEFAULT_WEB_USER);
      setLoading(false);
      return;
    }

    try {
      const { getAuth, onAuthStateChanged } = require('@react-native-firebase/auth');
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser: any) => {
        setUser(firebaseUser ? getCurrentUserInfo(firebaseUser) : DEFAULT_WEB_USER);
        setLoading(false);
      });

      // Safety timeout in case native listener stalls
      const safetyTimeout = setTimeout(() => {
        setLoading(false);
      }, 1500);

      return () => {
        unsubscribe();
        clearTimeout(safetyTimeout);
      };
    } catch (e) {
      console.warn('Native Firebase Auth listener fallback:', e);
      setUser(DEFAULT_WEB_USER);
      setLoading(false);
    }
  }, []);

  const logout = async () => {
    if (Platform.OS !== 'web') {
      try {
        const { getAuth, signOut } = require('@react-native-firebase/auth');
        await signOut(getAuth());
      } catch (e) {
        console.warn('Logout fallback:', e);
      }
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
