import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

// Import Auth Screens
import SplashScreen from './src/screens/auth/SplashScreen';
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { SignupScreen } from './src/screens/auth/SignupScreen';
import { ForgotPasswordScreen } from './src/screens/auth/ForgotPasswordScreen';
import { ResetPasswordScreen } from './src/screens/auth/ResetPasswordScreen';
import { EmailVerificationScreen } from './src/screens/auth/EmailVerificationScreen';
import { OTPVerificationScreen } from './src/screens/auth/OTPVerificationScreen';
import { TermsScreen } from './src/screens/auth/TermsScreen';
import { PrivacyPolicyScreen } from './src/screens/auth/PrivacyPolicyScreen';

// Import Organizer / Event Screens
import OrganizerDashboard from './src/screens/organizer/OrganizerDashboard';
import CreateEventDetails from './src/screens/organizer/CreateEventDetails';
import CreateEventTimeLocation from './src/screens/organizer/CreateEventTimeLocation';
import CreateEventTickets from './src/screens/organizer/CreateEventTickets';
import EventPublished from './src/screens/organizer/EventPublished';

// Import Core Tab & Settings Screens
import HomeScreen from './src/screens/home/HomeScreen';
import AIScreen from './src/screens/ai/AIScreen';
import ProfileScreen from './src/screens/profile/ProfileScreen';
import NotificationScreen from './src/screens/settings/NotificationScreen';
import SettingsScreen from './src/screens/settings/SettingsScreen';
import CustomDrawerContent from './src/components/CustomDrawerContent';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

function AppTabs() {
  const { colors } = useTheme();
  const { currentUser } = useAuth();

  const isOrganizer = currentUser?.role === 'organizer';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: React.ComponentProps<typeof Ionicons>['name'] = 'home-outline';
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'AI') {
            iconName = focused ? 'sparkles' : 'sparkles-outline';
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.outlineVariant,
          height: 100,
          // marginBottom: 60,
          paddingTop: 8,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={isOrganizer ? OrganizerDashboard : HomeScreen} />
  <Tab.Screen name="AI" component={AIScreen} />
      <Tab.Screen name="Notifications" component={NotificationScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AppDrawer() {
  const { colors } = useTheme();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
        drawerStyle: {
          width: 280,
          backgroundColor: colors.background,
        },
      }}
    >
      <Drawer.Screen name="AppTabs" component={AppTabs} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="ProfileScreen" component={ProfileScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          >
            {/* Splash Intro */}
            <Stack.Screen name="Splash" component={SplashScreen} />

            {/* Auth Screens */}
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
            <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />
            <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
            <Stack.Screen name="Terms" component={TermsScreen} />
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />

            {/* Main App (Drawer Wrapper containing Tabs) */}
            <Stack.Screen name="AppDrawer" component={AppDrawer} />

            {/* Organizer / Event Flow Screens */}
            <Stack.Screen name="CreateEventDetails" component={CreateEventDetails} />
            <Stack.Screen name="CreateEventTimeLocation" component={CreateEventTimeLocation} />
            <Stack.Screen name="CreateEventTickets" component={CreateEventTickets} />
            <Stack.Screen name="EventPublished" component={EventPublished} />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </AuthProvider>
  );
}
    