import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/home/HomeScreen';
import SportPlacesScreen from '../screens/home/NearestSportPlaces/SportPlacesScreen';
import SportPlacesInfoScreen from '../screens/home/NearestSportPlaces/SportPlacesInfoScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function SportPlacesStack() {
  return (
    <Stack.Navigator>
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

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen 
          name="SportPlaces" 
          component={SportPlacesStack} 
          options={{ headerShown: false }}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}