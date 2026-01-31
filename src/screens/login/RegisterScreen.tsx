import { View, Text, Button, TextInput, StyleSheet, ScrollView, Modal, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { doc, updateDoc } from '../../firebase/Config';
import { db } from '../../firebase/Config';
import { AVAILABLE_SPORTS } from '../../Models/User'

const availableSports = AVAILABLE_SPORTS;

export default function RegisterScreen() {
  const navigation = useNavigation<any>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secondPassword, setSecondPassword] = useState('');
  const [age, setAge] = useState(''); 
  const [gender, setGender] = useState('');
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const { register, user } = useAuth();
  const [error, setError] = useState("");


    const handleRegister = async () => {
        try {
            setError("");
            if (password !== secondPassword) {
                setError("Passwords do not match.");
                return;
            }
            if (!name || !email || !password) {
                setError("Fill all required fields.");
                return;
            }
            await register(name, email, password,);
            setModalVisible(true);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleProfile = async () => {
        if (!age || !gender || selectedSports.length === 0) {
            Alert.alert("Fill in all required profile fields and choose at least one sport.");
            return;
        }
        try {
        if (user?.uid) {
            await updateDoc(doc(db, "users", user.uid), {
                age: parseInt(age),
                gender: gender,
                sports: selectedSports,
            });
            Alert.alert("Profile updated!");
            setModalVisible(false);
            navigation.navigate("Home");
        }

        } catch (err: any) {
            Alert.alert(err.message);
        }
    };
    const toggleSport = (sport: string) => {
        if (selectedSports.includes(sport)) {
            setSelectedSports(selectedSports.filter(s => s !== sport));
        } else {
            setSelectedSports([...selectedSports, sport]);
        }
    };


   return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Create Account</Text>
        
        <TextInput
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholderTextColor="#999"
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          placeholderTextColor="#999"
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          placeholderTextColor="#999"
        />
        <TextInput
          placeholder="Confirm Password"
          secureTextEntry
          value={secondPassword}
          onChangeText={setSecondPassword}
          style={styles.input}
          placeholderTextColor="#999"
        />
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
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
              onChangeText={setAge}
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
                  onPress={() => setGender(g)}
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
                  onPress={() => toggleSport(sport)}
                >
                  <Text style={[styles.sportChipText, selectedSports.includes(sport) && styles.sportChipTextSelected]}>
                    {sport}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity 
            onPress={handleProfile}
            style={styles.completeButton}>
              <Text style={styles.buttonText}>{'Complete Profile'}</Text>
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