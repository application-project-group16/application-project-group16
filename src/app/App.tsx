import * as React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SportPlacesViewModel from '../screens/NearestSportPlaces/SportPlaces/SportPlacesViewModel';
import SportPlacesInfoViewModel from '../screens/NearestSportPlaces/SportPlacesInfo/SportPlacesInfoViewModel';
import SwipeScreen from '../screens/swipe/SwipeScreen';
import type { MainTabParamList } from '../Models/navigation'
import LoginViewModel from '../screens/login/LoginViewModel';
import RegisterViewModel from '../screens/login/RegisterViewModel';
import { AuthProvider, useAuth } from '../context/AuthContext';
import SettingsViewModel from '../screens/settings/SettingsViewModel';
import { gradients } from '../Models/Gradient';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator();

function AppHeader() {
  return (
    <LinearGradient colors={gradients.authBackground} style={{ paddingHorizontal: 20, paddingTop: 38, paddingBottom: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <MaterialCommunityIcons name="dumbbell" size={28} color="#fff" />
        <Text style={{ fontSize: 20, fontWeight: '700', color: '#fff' }}>Sport Buddies</Text>
      </View>
    </LinearGradient>
  );
}

function SportPlacesStack() {
  return (
    <Stack.Navigator 
      id="SportPlacesStack"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="SportPlacesSelect"
        component={SportPlacesViewModel}
      />
      <Stack.Screen
        name="SportPlacesInfo"
        component={SportPlacesInfoViewModel}
      />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { user } = useAuth();

  if (!user) {
    return (
      <NavigationContainer>
        <Stack.Navigator id="AuthStack" screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="Login"
            component={LoginViewModel}
          />
          <Stack.Screen
            name="Register"
            component={RegisterViewModel}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        <AppHeader />
        <Tab.Navigator 
          id="MainTab"
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              borderTopWidth: 1,
              borderTopColor: '#e0e0e0',
            },
          }}
        >
          <Tab.Screen 
            name="Swipe" 
            component={SwipeScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="cards-heart" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen 
            name="SportPlaces" 
            component={SportPlacesStack}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="map-marker" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen 
            name="Settings" 
            component={SettingsViewModel}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="cog" color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
      </View>
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