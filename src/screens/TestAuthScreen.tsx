import { View, Text, TextInput, Button } from "react-native";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function TestAuthScreen() {
  const { user, register, login, logout, } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");


  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 10 }}>
        Auth Test
      </Text>

      {user ? (
        <>
          <Text>✅ Logged in</Text>
          <Text>{user.email}</Text>
          <Button title="Logout" onPress={logout} />
        </>
      ) : (
        <>
          <TextInput
            placeholder="Name (register only)"
            value={name}
            onChangeText={setName}
            style={{ borderWidth: 1, marginBottom: 8, padding: 6 }}
          />

          <TextInput
            placeholder="Email"
            autoCapitalize="none"
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

          {error ? <Text style={{ color: "red" }}>{error}</Text> : null}

          <Button
            title="Register"
            onPress={async () => {
              try {
                setError("");
                await register(name, email, password);
              } catch (e: any) {
                setError(e.message);
              }
            }}
          />

          <Button
            title="Login"
            onPress={async () => {
              try {
                setError("");
                await login(email, password);
              } catch (e: any) {
                setError(e.message);
              }
            }}
          />
        </>
      )}
    </View>
  );
}
