import * as React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SportPlacesViewModel from '../screens/NearestSportPlaces/SportPlaces/SportPlacesViewModel';
import SportPlacesInfoViewModel from '../screens/NearestSportPlaces/SportPlacesInfo/SportPlacesInfoViewModel';
import SwipeView from '../screens/swipe/SwipeView';
import type { MainTabParamList } from '../Models/navigation'
import LoginViewModel from '../screens/login/LoginViewModel';
import RegisterViewModel from '../screens/login/RegisterViewModel';
import { AuthProvider, useAuth } from '../context/AuthContext';
import SettingsViewModel from '../screens/settings/SettingsViewModel';
import { ActivityIndicator } from 'react-native';
import MyProfileView from '../screens/profile/MyProfileView';
import ProfileView from '../screens/profile/SwipeProfileView';
import ChatPage from '../screens/FriendList/FriendChat/chatPage';
import UserStatisticsViewModel from '../screens/UserStatistics/UserStatisticsViewModel';
import { gradients } from '../Models/Gradient';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator();
const RootStack = createStackNavigator();

function AppHeader() {
  return (
    <LinearGradient colors={gradients.authBackground} style={{ paddingHorizontal: 20, paddingTop: 45, paddingBottom: 15 }}>
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

function ProfileStack() {
  return (
    <Stack.Navigator id="ProfileStack" screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="ProfileMain"
        component={MyProfileView}        
      />
      <Stack.Screen
        name="Settings"
        component={SettingsViewModel}
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  const { user } = useAuth()

  return (
    <Tab.Navigator 
      id="MainTabs"
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
        component={SwipeView}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cards-heart" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="SportPlaces" 
        component={SportPlacesStack}
        options={{
          headerShown: false,
          tabBarLabel: '',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="map-marker" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="FriendList" 
        component={ChatPage}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chat" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="UserStatistics" 
        component={UserStatisticsViewModel}
        options={{
          headerShown: false,
          tabBarLabel: '',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStack}
        options={{
          headerShown: false,
          tabBarLabel: '',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />
  }

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
        <RootStack.Navigator id="RootStack" screenOptions={{ headerShown: false }}>
          <RootStack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="ProfileView"
            component={ProfileView}
            options={{ title: 'Profile' }}
          />
        </RootStack.Navigator>
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