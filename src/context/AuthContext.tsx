import React, { createContext, useContext, useState, ReactNode } from 'react';
import * as authService from '../services/authService';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  mobileNumber?: string;
  role: string;
}

export interface AuthContextType {
  currentUser: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  signup: (email: string, password: string, fullName: string, mobileNumber: string) => Promise<any>;
  logout: () => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  sendVerification: () => Promise<any>;
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
  const [loading, setLoading] = useState<boolean>(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      if (res.success) {
        setCurrentUser({
          uid: 'mock_uid_123',
          name: 'Attendee User',
          email: email,
          role: 'user',
        });
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, fullName: string, mobileNumber: string) => {
    setLoading(true);
    try {
      const res = await authService.signup(email, password, fullName, mobileNumber);
      if (res.success) {
        setCurrentUser({
          uid: 'mock_uid_123',
          name: fullName,
          email: email,
          mobileNumber: mobileNumber,
          role: 'user',
        });
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const res = await authService.logout();
      if (res.success) {
        setCurrentUser(null);
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    return authService.resetPassword(email);
  };

  const sendVerification = async () => {
    return authService.sendVerification();
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    login,
    signup,
    logout,
    resetPassword,
    sendVerification,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
