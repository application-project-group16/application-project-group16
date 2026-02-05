import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import SportPlacesViewModel from '../screens/NearestSportPlaces/SportPlaces/SportPlacesViewModel';
import SportPlacesInfoViewModel from '../screens/NearestSportPlaces/SportPlacesInfo/SportPlacesInfoViewModel';
import SwipeView from '../screens/swipe/SwipeView';
import type { MainTabParamList } from '../Models/navigation'
import LoginScreen from '../screens/login/LoginScreen';
import RegisterScreen from '../screens/login/RegisterScreen';
import { AuthProvider, useAuth } from '../context/AuthContext';
import SettingsViewModel from '../screens/settings/SettingsViewModel';
import { ActivityIndicator } from 'react-native';
import MyProfileView from '../screens/profile/MyProfileView';
import ProfileView from '../screens/profile/SwipeProfileView';
import ChatPage from '../screens/FriendList/FriendChat/chatPage';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator();
const RootStack = createStackNavigator();

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

function ProfileStack() {
  return (
    <Stack.Navigator id="ProfileStack">
      <Stack.Screen
        name="ProfileMain"
        component={MyProfileView}        
        options={{ title: 'Profile' }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsViewModel}
        options={{ title: 'Settings' }}
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  const { user } = useAuth()

  return (
    <Tab.Navigator id="MainTabs">
      <Tab.Screen name="Swipe" component={SwipeView} />
      <Tab.Screen name="SportPlaces" component={SportPlacesStack} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileStack} options={{ headerShown: false }} />
      <Tab.Screen name="FriendList" component={ChatPage} />
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
        <Stack.Navigator id="AuthStack">
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

  return (
    <NavigationContainer>
      <RootStack.Navigator id="RootStack">
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
    </NavigationContainer>
  )
}


export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}