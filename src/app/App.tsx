import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import SportPlacesScreen from '../screens/home/NearestSportPlaces/SportPlacesScreen';
import SportPlacesInfoScreen from '../screens/home/NearestSportPlaces/SportPlacesInfoScreen';
import SwipeScreen from '../screens/swipe/SwipeScreen';
import type { MainTabParamList } from '../types/navigation'
import LoginScreen from '../screens/home/LoginScreen';
import RegisterScreen from '../screens/home/RegisterScreen';
import { AuthProvider, useAuth } from '../context/AuthContext';
import SettingsScreen from '../screens/settings/SettingsScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator();

function SportPlacesStack() {
  return (
    <Stack.Navigator id="SportPlacesStack">
      <Stack.Screen
        name="SportPlacesSelect"
        component={SportPlacesScreen}
        options={{
          headerShown: true,
          title: "Select Sport Places", 
        }}
      />
      <Stack.Screen
        name="SportPlacesInfo"
        component={SportPlacesInfoScreen}
        options={{
          headerShown: true,
          title: "Sport Places Info", 
        }}
      />
    </Stack.Navigator>
  );
}

// Wrapper to access auth context inside navigation
function RootNavigator() {
  const { user } = useAuth();

  if (!user) {
    // Only show login screen before authentication
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  // Show tab navigator after login
  return (
    <NavigationContainer>
      <Tab.Navigator id="MainTab">
        <Tab.Screen name="Swipe" component={SwipeScreen} />
        <Tab.Screen 
          name="SportPlaces" 
          component={SportPlacesStack} 
          options={{ headerShown: false }}/>
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}