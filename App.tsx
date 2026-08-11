import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';

// Import Auth Screens
import SplashScreen from './src/screens/auth/SplashScreen';
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { SignupScreen } from './src/screens/auth/SignupScreen';
import { ForgotPasswordScreen } from './src/screens/auth/ForgotPasswordScreen';
import { ResetPasswordScreen } from './src/screens/auth/ResetPasswordScreen';
import { EmailVerificationScreen } from './src/screens/auth/EmailVerificationScreen';

import { TermsScreen } from './src/screens/auth/TermsScreen';
import { PrivacyPolicyScreen } from './src/screens/auth/PrivacyPolicyScreen';

// Import Organizer / Event Screens
import OrganizerDashboard from './src/screens/organizer/OrganizerDashboard';
import OrganizerTabs from './src/navigation/OrganizerTabs';
import CreateEventDetails from './src/screens/organizer/CreateEventDetails';
import CreateEventTimeLocation from './src/screens/organizer/CreateEventTimeLocation';
import CreateEventTickets from './src/screens/organizer/CreateEventTickets';
import EventPublished from './src/screens/organizer/EventPublished';
import EditEventScreen from './src/screens/organizer/EditEventScreen';

import HomeScreen from './src/screens/home/HomeScreen';
import SearchScreen from './src/screens/search/SearchScreen';
import CategoriesScreen from './src/screens/categories/CategoriesScreen';
import FavoritesScreen from './src/screens/favorites/FavoritesScreen';
import AnnouncementScreen from './src/screens/announcements/AnnouncementScreen';

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

import { getAuth } from '@react-native-firebase/auth';

function AppTabs() {
  const { colors } = useTheme();
  const [isOrganizer, setIsOrganizer] = React.useState(false);

  React.useEffect(() => {
    const user = getAuth().currentUser;
    // if you store role as a custom claim or in Firestore, fetch it here instead
    // for now, defaulting to false (attendee) until you wire up role storage
    setIsOrganizer(false);
  }, []);

  return (
    <Tab.Navigator      screenOptions={({ route }) => ({
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
    <ThemeProvider>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          >
            {/* Splash Intro — now also checks Firebase's restored
                session and routes straight to AppDrawer if the user
                is already logged in, instead of always going to Login. */}
            <Stack.Screen name="Splash" component={SplashScreen} />

            {/* Auth Screens */}
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
            <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />
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
      </AuthProvider>
    </ThemeProvider>
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="OrganizerTabs"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="OrganizerTabs"
          component={OrganizerTabs}
        />
        <Stack.Screen
          name="CreateEventDetails"
          component={CreateEventDetails}
        />
        <Stack.Screen
          name="CreateEventTimeLocation"
          component={CreateEventTimeLocation}
        />
        <Stack.Screen
          name="CreateEventTickets"
          component={CreateEventTickets}
        />
        <Stack.Screen
          name="EventPublished"
          component={EventPublished}
        />
        <Stack.Screen
          name="EditEventScreen"
          component={EditEventScreen}
        />

        {/* Home-side screens (student view) — registered here as plain
            stack routes for now so they stay reachable via
            navigation.navigate('HomeScreen') etc. The previous dev-only
            useState screen switcher was removed because it bypassed
            React Navigation entirely, which breaks passing data via
            route.params (used by EditEventScreen and others). Whoever
            owns the student-side flow may want to nest these in their
            own tab navigator later, similar to OrganizerTabs. */}
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
        />
        <Stack.Screen
          name="SearchScreen"
          component={SearchScreen}
        />
        <Stack.Screen
          name="CategoriesScreen"
          component={CategoriesScreen}
        />
        <Stack.Screen
          name="FavoritesScreen"
          component={FavoritesScreen}
        />
        <Stack.Screen
          name="AnnouncementScreen"
          component={AnnouncementScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}