import { View, Text, TextInput, StyleSheet, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { AVAILABLE_SPORTS } from '../../Models/User';

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
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Create Account</Text>
        
        <TextInput
          placeholder="Full Name"
          value={name}
          onChangeText={onNameChange}
          style={styles.input}
          placeholderTextColor="#999"
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={onEmailChange}
          style={styles.input}
          keyboardType="email-address"
          placeholderTextColor="#999"
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={onPasswordChange}
          style={styles.input}
          placeholderTextColor="#999"
        />
        <TextInput
          placeholder="Confirm Password"
          secureTextEntry
          value={secondPassword}
          onChangeText={onSecondPasswordChange}
          style={styles.input}
          placeholderTextColor="#999"
        />
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <TouchableOpacity style={styles.registerButton} onPress={onRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onNavigateToLogin}>
          <Text style={styles.loginLink}>Already have an account? Login</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Complete Your Profile</Text>
            
            <TextInput
              placeholder="Age"
              value={age}
              onChangeText={onAgeChange}
              keyboardType="numeric"
              style={styles.input}
              placeholderTextColor="#999"
            />

            <Text style={styles.sectionLabel}>Gender</Text>
            <View style={styles.genderContainer}>
              {['Male', 'Female', 'Other'].map(g => (
                <TouchableOpacity
                  key={g}
                  style={[styles.genderButton, gender === g && styles.genderButtonSelected]}
                  onPress={() => onGenderChange(g)}
                >
                  <Text style={[styles.genderButtonText, gender === g && styles.genderButtonTextSelected]}>
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionLabel}>Select Sports (at least 1)</Text>
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

            <TouchableOpacity 
              onPress={onCompleteProfile}
              style={styles.completeButton}
            >
              <Text style={styles.buttonText}>Complete Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d15f13',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 2,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 16,
    borderColor: '#000000',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: '#000000',
    borderRadius: 8,
    paddingVertical: 13,
    marginTop: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#5eff00',
    fontSize: 16,
    fontWeight: '600',
  },
  loginLink: {
    color: '#5eff00',
    fontSize: 14,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#000',
    textAlign: 'center',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginTop: 15,
    marginBottom: 10,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  genderButtonSelected: {
    backgroundColor: '#ff1a75',
    borderColor: '#ff1a75',
  },
  genderButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  genderButtonTextSelected: {
    color: '#fff',
  },
  sportsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  sportChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sportChipSelected: {
    backgroundColor: '#b16004',
    borderColor: '#df620e',
  },
  sportChipText: {
    color: '#302e2e',
    fontSize: 14,
    fontWeight: '500',
  },
  sportChipTextSelected: {
    color: '#fff',
  },
  completeButton: {
    backgroundColor: '#ad3a0d',
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 15,
  },
});