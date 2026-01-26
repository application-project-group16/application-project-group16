import { View, Text, Button, TextInput } from 'react-native';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
  const navigation = useNavigation<any>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secondPassword, setSecondPassword] = useState('');
  const { register } = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

    const handleRegister = async () => {
        try {
            setError("");
            if (password !== secondPassword) {
                setError("Passwords do not match.");
                return;
            }
            await register(name, email, password,);
            setSuccess("Registration successful!");
            alert("Registration successful!");
            navigation().navigate("Home");
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>Register Screen</Text>
            <Button title="Go to Login" onPress={() => navigation.navigate("Login")} />
            <TextInput
                placeholder="Name"
                value={name}
                onChangeText={setName}
                style={{ borderWidth: 1, marginBottom: 8, padding: 6 }}
            />
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={{ borderWidth: 1, marginBottom: 8, padding: 6 }}
            />
            <TextInput
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={{ borderWidth: 1, marginBottom: 8, padding: 6 }}
            />
            <TextInput
                placeholder="Confirm Password"
                secureTextEntry
                value={secondPassword}
                onChangeText={setSecondPassword}
                style={{ borderWidth: 1, marginBottom: 8, padding: 6 }}
            />
            {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
            <Button title="Register" onPress={handleRegister} />
        </View>
    );
}