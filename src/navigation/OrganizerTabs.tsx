import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../theme/colors';
import { typography } from '../theme/fonts';
import OrganizerDashboard from '../screens/organizer/OrganizerDashboard';
import VolunteerAllocationScreen from '../screens/organizer/VolunteerAllocationScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();

// Route names stay as the existing screen names (e.g. 'OrganizerDashboard')
// so navigation.navigate('OrganizerDashboard') calls already used elsewhere
// (like the close button in CreateEventDetails.tsx) keep working unchanged.
const TAB_ICONS: Record<string, string> = {
  OrganizerDashboard: 'grid',
  Volunteers: 'users',
  Profile: 'user',
};

const TAB_LABELS: Record<string, string> = {
  OrganizerDashboard: 'Dashboard',
  Volunteers: 'Volunteers',
  Profile: 'Profile',
};

export default function OrganizerTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: colors.surfaceContainerLowest,
          borderTopWidth: 1,
          borderTopColor: colors.slate[200],
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: typography.labelSm.fontFamily,
          fontSize: 11,
          fontWeight: typography.labelSm.fontWeight,
        },
        tabBarLabel: TAB_LABELS[route.name] ?? route.name,
        tabBarIcon: ({ color, size }) => (
          <Icon name={TAB_ICONS[route.name] ?? 'circle'} size={size ?? 20} color={color} />
        ),
      })}
    >
      <Tab.Screen name="OrganizerDashboard" component={OrganizerDashboard} />
      <Tab.Screen name="Volunteers" component={VolunteerAllocationScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}