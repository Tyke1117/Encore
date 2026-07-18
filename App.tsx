import React, { useState } from 'react';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { SignupScreen } from './src/screens/auth/SignupScreen';
import { ForgotPasswordScreen } from './src/screens/auth/ForgotPasswordScreen';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { theme } from './src/theme/theme';

function MainAppContent({ navigationMock }: { navigationMock: any }) {
  const { currentUser, logout } = useAuth();

  if (currentUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome, {currentUser.name}!</Text>
        <Text style={styles.subtitle}>Email: {currentUser.email}</Text>
        <Text style={styles.subtitle}>Role: {currentUser.role}</Text>
        <Text style={styles.successMessage}>
          Authentication & Database Storage successfully verified!
        </Text>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'Login' | 'Signup' | 'ForgotPassword'>('Login');

  const navigationMock = {
    navigate: (screenName: string) => {
      if (screenName === 'Signup') setCurrentScreen('Signup');
      if (screenName === 'Login') setCurrentScreen('Login');
      if (screenName === 'ForgotPassword') setCurrentScreen('ForgotPassword');
    },
    goBack: () => {
      setCurrentScreen('Login');
    }
  };

  return (
    <AuthProvider>
      <MainAppContent navigationMock={navigationMock} />
      
      <View style={{ flex: 1 }}>
        {currentScreen === 'Login' && <LoginScreen navigation={navigationMock} />}
        {currentScreen === 'Signup' && <SignupScreen navigation={navigationMock} />}
        {currentScreen === 'ForgotPassword' && <ForgotPasswordScreen navigation={navigationMock} />}
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF7FF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999, // Render on top of screens when logged in
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1D1B20',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#625B71',
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 24,
  },
  logoutButton: {
    backgroundColor: '#6750A4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});

