import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import SportPlacesViewModel from '../screens/NearestSportPlaces/SportPlaces/SportPlacesViewModel';
import SportPlacesInfoViewModel from '../screens/NearestSportPlaces/SportPlacesInfo/SportPlacesInfoViewModel';
import SwipeScreen from '../screens/swipe/SwipeScreen';
import type { MainTabParamList } from '../Models/navigation'
import LoginViewModel from '../screens/login/LoginViewModel';
import RegisterViewModel from '../screens/login/RegisterViewModel';
import { AuthProvider, useAuth } from '../context/AuthContext';
import SettingsViewModel from '../screens/settings/SettingsViewModel';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator();

function SportPlacesStack() {
  return (
    <Stack.Navigator id="SportPlacesStack">
      <Stack.Screen
        name="SportPlacesSelect"
        component={SportPlacesViewModel}
        options={{
          headerShown: true,
          title: "Select Sport Places", 
        }}
      />
      <Stack.Screen
        name="SportPlacesInfo"
        component={SportPlacesInfoViewModel}
        options={{
          headerShown: true,
          title: "Sport Places Info", 
        }}
      />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { user } = useAuth();

  if (!user) {
    return (
      <NavigationContainer>
        <Stack.Navigator id="AuthStack">
          <Stack.Screen
            name="Login"
            component={LoginViewModel}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterViewModel}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator id="MainTab">
        <Tab.Screen name="Swipe" component={SwipeScreen} />
        <Tab.Screen 
          name="SportPlaces" 
          component={SportPlacesStack} 
          options={{ headerShown: false }}/>
        <Tab.Screen name="Settings" component={SettingsViewModel} />
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