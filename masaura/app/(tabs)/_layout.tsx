import { Tabs } from 'expo-router';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';
import Ionicons from '@expo/vector-icons/Ionicons';
import Login from '../login'
import Signup from '../signup'

const Stack = createNativeStackNavigator();

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        options={{ headerShown: false }}
      >
        {() => (
          <Tabs
            screenOptions={{
              tabBarActiveTintColor: '#FF6666',
              headerShown: false,
              tabBarShowLabel: false,
            }}
          >
            <Tabs.Screen
              name="events"
              options={{
                title: 'Events',
                tabBarIcon: ({ color, focused }) => (
                  <Ionicons
                    name={focused ? 'balloon-sharp' : 'balloon-outline'}
                    color={color}
                    size={24}
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="tickets"
              options={{
                title: 'Tickets',
                tabBarIcon: ({ color, focused }) => (
                  <Ionicons
                    name={focused ? 'ticket-sharp' : 'ticket-outline'}
                    color={color}
                    size={24}
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="map"
              options={{
                title: 'Map',
                tabBarIcon: ({ color, focused }) => (
                  <Ionicons
                    name={focused ? 'map-sharp' : 'map-outline'}
                    color={color}
                    size={24}
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="friends"
              options={{
                title: 'Friends',
                tabBarIcon: ({ color, focused }) => (
                  <Ionicons
                    name={focused ? 'people-sharp' : 'people-outline'}
                    color={color}
                    size={24}
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="profile"
              options={{
                title: 'Profile',
                tabBarIcon: ({ color, focused }) => (
                  <Ionicons
                    name={focused ? 'person-sharp' : 'person-outline'}
                    color={color}
                    size={24}
                  />
                ),
              }}
            />
          </Tabs>
        )}
      </Stack.Screen>

      <Stack.Screen
        name="settings"
        component={Login}
        options={{ title: 'Settings' }}
      />
      <Stack.Screen
        name="details"
        component={Signup}
        options={{ title: 'Details' }}
      />
    </Stack.Navigator>
  );
}
