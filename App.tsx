import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OrganizerDashboard from './src/screens/organizer/OrganizerDashboard';
import CreateEventDetails from './src/screens/organizer/CreateEventDetails';
import CreateEventTimeLocation from './src/screens/organizer/CreateEventTimeLocation';
import CreateEventTickets from './src/screens/organizer/CreateEventTickets';
import EventPublished from './src/screens/organizer/EventPublished';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="OrganizerDashboard"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="OrganizerDashboard"
          component={OrganizerDashboard}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}