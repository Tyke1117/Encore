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
      </Stack.Navigator>
    </NavigationContainer>
  );
}