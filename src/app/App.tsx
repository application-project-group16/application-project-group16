import { StatusBar } from 'expo-status-bar';
import HomeScreen from '../screens/home/HomeScreen';

export default function App() {
  return (
    <>
      <HomeScreen />
      <StatusBar style="auto" />
    </>
  );
}