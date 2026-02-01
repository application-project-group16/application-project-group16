import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

interface LoginViewProps {
  email: string;
  password: string;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onLogin: () => void;
  onNavigateToRegister: () => void;
}

export default function LoginView({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onLogin,
  onNavigateToRegister,
}: LoginViewProps) {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login to your account</Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={onEmailChange}
          keyboardType="email-address"
          placeholderTextColor="#999"
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={onPasswordChange}
          secureTextEntry
          placeholderTextColor="#999"
          style={styles.input}
        />
        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={onLogin}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onNavigateToRegister}>
          <Text style={styles.registerLink}>Don't have an account? Register here</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d15f13',
  },
  scrollContent: {
    padding: 20,
    justifyContent: 'center',
    flexGrow: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  loginButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#5eff00',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerLink: {
    color: '#5eff00',
    textAlign: 'center',
    fontSize: 16,
  },
});