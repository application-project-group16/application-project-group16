import { View, Text, TextInput, StyleSheet, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AVAILABLE_SPORTS } from '../../Models/User';
import { gradients } from '../../Models/Gradient';

const availableSports = AVAILABLE_SPORTS;

interface RegisterViewProps {
  name: string;
  email: string;
  password: string;
  secondPassword: string;
  age: string;
  gender: string;
  selectedSports: string[];
  modalVisible: boolean;
  error: string;
  onNameChange: (name: string) => void;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSecondPasswordChange: (password: string) => void;
  onAgeChange: (age: string) => void;
  onGenderChange: (gender: string) => void;
  onToggleSport: (sport: string) => void;
  onRegister: () => void;
  onNavigateToLogin: () => void;
  onCompleteProfile: () => void;
}

export default function RegisterView({
  name,
  email,
  password,
  secondPassword,
  age,
  gender,
  selectedSports,
  modalVisible,
  error,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onSecondPasswordChange,
  onAgeChange,
  onGenderChange,
  onToggleSport,
  onRegister,
  onNavigateToLogin,
  onCompleteProfile,
}: RegisterViewProps) {
  return (
    <LinearGradient colors={gradients.authBackground} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.logo}>🏋️ Sport Buddies</Text>
          
          <View style={styles.tabContainer}>
            <TouchableOpacity style={styles.loginTab} onPress={onNavigateToLogin}>
              <Text style={styles.inactiveTabText}>Login</Text>
            </TouchableOpacity>
            <LinearGradient
              colors={gradients.authBackground}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.signUpTab}
            >
              <Text style={styles.activeTabText}>Sign Up</Text>
            </LinearGradient>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>✉️</Text>
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
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={onPasswordChange}
              secureTextEntry
              placeholderTextColor="#ccc"
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              placeholder="Second Password"
              value={secondPassword}
              onChangeText={onSecondPasswordChange}
              secureTextEntry
              placeholderTextColor="#ccc"
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>👤</Text>
            <TextInput
              placeholder="Name"
              value={name}
              onChangeText={onNameChange}
              style={styles.input}
              placeholderTextColor="#ccc"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>📅</Text>
            <TextInput
              placeholder="Age"
              value={age}
              onChangeText={onAgeChange}
              keyboardType="numeric"
              style={styles.input}
              placeholderTextColor="#ccc"
            />
          </View>

          <Text style={styles.sectionLabel}>Select Your Sports</Text>
          <View style={styles.sportsContainer}>
            {availableSports.map(sport => (
              <TouchableOpacity
                key={sport}
                style={[styles.sportChip, selectedSports.includes(sport) && styles.sportChipSelected]}
                onPress={() => onToggleSport(sport)}
              >
                <Text style={[styles.sportChipText, selectedSports.includes(sport) && styles.sportChipTextSelected]}>
                  {sport}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.bioInputContainer}>
            <Text style={styles.bioIcon}>💬</Text>
            <TextInput
              placeholder="Tell us about yourself..."
              value={secondPassword}
              onChangeText={onSecondPasswordChange}
              style={[styles.input, styles.bioInput]}
              placeholderTextColor="#ccc"
              multiline
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <LinearGradient
            colors={gradients.authBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.registerButton}
          >
            <TouchableOpacity onPress={onRegister} style={styles.buttonInner}>
              <Text style={styles.registerButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  signUpTab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  inactiveTabText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
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
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  bioInputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#fafafa',
    paddingTop: 12,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  bioIcon: {
    fontSize: 18,
    marginRight: 10,
    marginTop: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  bioInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    marginTop: 8,
  },
  sportsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  sportChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sportChipSelected: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  sportChipText: {
    color: '#666',
    fontSize: 13,
    fontWeight: '500',
  },
  sportChipTextSelected: {
    color: '#fff',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  registerButton: {
    borderRadius: 12,
    marginTop: 16,
    overflow: 'hidden',
  },
  buttonInner: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});