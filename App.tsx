import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './src/context/AuthContext';

// Import Screens
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { SignupScreen } from './src/screens/auth/SignupScreen';
import { ForgotPasswordScreen } from './src/screens/auth/ForgotPasswordScreen';
import { ResetPasswordScreen } from './src/screens/auth/ResetPasswordScreen';
import { EmailVerificationScreen } from './src/screens/auth/EmailVerificationScreen';
import { OTPVerificationScreen } from './src/screens/auth/OTPVerificationScreen';
import { TermsScreen } from './src/screens/auth/TermsScreen';
import { PrivacyPolicyScreen } from './src/screens/auth/PrivacyPolicyScreen';
import OrganizerDashboard from './src/screens/organizer/OrganizerDashboard';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />
          <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
          <Stack.Screen name="Terms" component={TermsScreen} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
          <Stack.Screen name="OrganizerDashboard" component={OrganizerDashboard} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
