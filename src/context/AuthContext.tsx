import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  login as serviceLogin, 
  signUp as serviceSignUp, 
  logout as serviceLogout, 
  forgotPassword as serviceForgotPassword,
  getCurrentUser
} from '../services/auth';
import { UserProfile } from '../services/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  currentUser: UserProfile | null;
  loading: boolean;
  login: typeof serviceLogin;
  signup: typeof serviceSignUp;
  logout: typeof serviceLogout;
  forgotPassword: typeof serviceForgotPassword;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize auth state from local storage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Mock Auth: Failed to restore session', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await serviceLogin(email, password);
      // Fetch custom profile details from mock database
      const profile = await getCurrentUser();
      setCurrentUser(profile);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, role: string) => {
    setLoading(true);
    try {
      const result = await serviceSignUp(email, password, name, role);
      // Fetch custom profile details from mock database
      const profile = await getCurrentUser();
      setCurrentUser(profile);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await serviceLogout();
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    await serviceForgotPassword(email);
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    login,
    signup,
    logout,
    forgotPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
