import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from '@react-native-firebase/auth';
import { getCurrentUserInfo, UserInfo } from '../services/userService';

interface AuthContextType {
  user: UserInfo | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    // Firebase's native SDK automatically persists the session on
    // device. onAuthStateChanged fires once on app start with
    // whatever session it restored (or null if none/logged out),
    // and again whenever the user logs in or out. This is what
    // gives us "stay logged in across app restarts" for free.
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ? getCurrentUserInfo(firebaseUser) : null);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    await signOut(getAuth());
    // onAuthStateChanged above will fire automatically and clear `user`.
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};