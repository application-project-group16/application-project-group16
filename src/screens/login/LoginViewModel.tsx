import { Alert } from 'react-native';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import LoginView from './LoginView';

export default function LoginViewModel() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigation = useNavigation<any>();

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        Alert.alert("Fill both email and password.");
        return;
      }
      await login(email, password);
    } catch (err) {
      Alert.alert("Login failed. Please check your password or email.");
    }
  };

  const handleNavigateToRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <LoginView
      email={email}
      password={password}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onLogin={handleLogin}
      onNavigateToRegister={handleNavigateToRegister}
    />
  );
}