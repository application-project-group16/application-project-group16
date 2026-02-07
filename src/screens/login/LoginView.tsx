import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients } from '../../Models/Gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
    <LinearGradient colors={gradients.authBackground} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.card}>
          
          <Text style={styles.logo}>
            <MaterialCommunityIcons name="dumbbell" size={28} color="#FF6B35" /> Sport Buddies
          </Text>

          <View style={styles.tabContainer}>
            <LinearGradient
              colors={gradients.authBackground}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.loginTab}
            >
              <TouchableOpacity>
              <Text style={styles.activeTabText}>Login</Text>
              </TouchableOpacity>
            </LinearGradient>

            <TouchableOpacity style={styles.signUpTab}>
              <Text style={styles.inactiveTabText} onPress={onNavigateToRegister}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="email-outline" size={18} color="#666" style={styles.inputIcon} />
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={onEmailChange}
              keyboardType="email-address"
              placeholderTextColor="#ccc"
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="lock-outline" size={18} color="#666" style={styles.inputIcon} />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={onPasswordChange}
              secureTextEntry
              placeholderTextColor="#ccc"
              style={styles.input}
            />
          </View>
          <LinearGradient
            colors={['#FF6B35', '#FF1744']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.loginButton}
          ><Text style={styles.loginButtonText} onPress={onLogin}>Login</Text></LinearGradient>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF5A4A',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  logo: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FF6B35',
    textAlign: 'center',
    marginBottom: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  loginTab: {
    flex: 1,
    backgroundColor: '#FF6B35',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  signUpTab: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTabText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  inactiveTabText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#fafafa',
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  signUpLink: {
    color: '#666',
    textAlign: 'center',
    fontSize: 14,
  },
});