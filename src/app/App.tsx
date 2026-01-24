import { StatusBar } from 'expo-status-bar';
import HomeScreen from '../screens/home/HomeScreen';
import { AuthProvider } from '../context/AuthContext';
import TestAuthScreen from '../screens/TestAuthScreen';

export default function App() {
  return (

    /* Tätä voi käyttää testatessa loginia ja registeriä
    <AuthProvider>
      <TestAuthScreen/>
    </AuthProvider>
    */

    <AuthProvider>
      <HomeScreen/>
      <StatusBar style="auto" />
    </AuthProvider>
  );
}