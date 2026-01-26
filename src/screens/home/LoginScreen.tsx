import { View, Text, Button, Alert, TextInput } from 'react-native';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await login(email, password);
        } catch (err) {
            setError("Login failed. Please check your password or email.");
            Alert.alert("Login failed. Please check your password or email.");
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>Login Screen</Text>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={{ borderWidth: 1, borderColor: 'gray', marginBottom: 10, padding: 8 }}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{ borderWidth: 1, borderColor: 'gray', marginBottom: 20, padding: 8 }}
            />
            <Button title="Login" onPress={handleLogin} />
            {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
        </View>
    );
}