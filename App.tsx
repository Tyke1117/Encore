import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

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

const Stack = createNativeStackNavigator();

export default function App() {
  return (
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