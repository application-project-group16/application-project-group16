import { View, Text, TextInput, StyleSheet, ScrollView, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AVAILABLE_SPORTS } from '../../Models/User';
import { gradients } from '../../Models/Gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const availableSports = AVAILABLE_SPORTS;

interface RegisterViewProps {
  name: string;
  email: string;
  age: string;
  password: string;
  confirmPassword: string;
  gender: string;
  location: string;
  bio: string;
  selectedSports: string[];
  modalVisible: boolean;
  error: string;
  finlandCities: string[];
  cityQuery: string;
  onCityQueryChange: (query: string) => void;
  onNameChange: (name: string) => void;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (password: string) => void;
  onAgeChange: (age: string) => void;
  onBioChange: (bio: string) => void;
  onToggleSport: (sport: string) => void;
  onRegister: () => void;
  onNavigateToLogin: () => void;
  showGenderDropdown: boolean;
  showLocationDropdown: boolean;
  onToggleGenderDropdown: () => void;
  onToggleLocationDropdown: () => void;
  onGenderChange: (gender: string) => void;
  onLocationChange: (location: string) => void;
}

export default function RegisterView({
  name,
  email,
  age,
  password,
  confirmPassword,
  gender,
  location,
  bio,
  selectedSports,
  modalVisible,
  error,
  finlandCities,
  cityQuery,
  onCityQueryChange,
  onNameChange,
  onEmailChange,
  onAgeChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onBioChange,
  onToggleSport,
  onRegister,
  onNavigateToLogin,
  showGenderDropdown,
  showLocationDropdown,
  onToggleGenderDropdown,
  onToggleLocationDropdown,
  onGenderChange,
  onLocationChange,
}: RegisterViewProps) {

  const closeAllDropdowns = () => {
    if (showGenderDropdown) onToggleGenderDropdown();
    if (showLocationDropdown) onToggleLocationDropdown();
  };

  return (
    <LinearGradient colors={gradients.authBackground} style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback onPress={closeAllDropdowns}>
          <View style={styles.card}>
            <Text style={styles.logo}>
              <MaterialCommunityIcons name="dumbbell" size={28} color="#FF6B35" /> Sport Buddies
            </Text>
            
            <View style={styles.tabContainer}>
              <TouchableOpacity style={styles.loginTab} onPress={() => { closeAllDropdowns(); onNavigateToLogin(); }}>
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

            <Text style={styles.sectionLabel}>Profile Details</Text>

            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="account" size={18} color="#666" style={styles.inputIcon} />
              <TextInput
                placeholder="Name"
                value={name}
                onChangeText={onNameChange}
                style={styles.input}
                placeholderTextColor="#ccc"
                onFocus={closeAllDropdowns}
              />
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
                onFocus={closeAllDropdowns}
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="calendar" size={18} color="#666" style={styles.inputIcon} />
              <TextInput
                placeholder="Age"
                value={age}
                onChangeText={onAgeChange}
                keyboardType="numeric"
                style={styles.input}
                placeholderTextColor="#ccc"
                onFocus={closeAllDropdowns}
              />
            </View>

            <View style={[styles.dropdownContainer, showGenderDropdown && styles.dropdownContainerActive]}>
              <TouchableOpacity 
                style={styles.inputContainer}
                onPress={() => {
                  if (showLocationDropdown) onToggleLocationDropdown();
                  onToggleGenderDropdown();
                }}
              >
                <MaterialCommunityIcons name="human" size={18} color="#666" style={styles.inputIcon} />
                <Text style={[styles.input, { color: gender ? '#333' : '#ccc' }]}>
                  {gender || 'Select Gender'}
                </Text>
                <MaterialCommunityIcons name="chevron-down" size={18} color="#666" />
              </TouchableOpacity>

              {showGenderDropdown && (
                <View style={styles.dropdownMenu}>
                  {['Male', 'Female', 'Other'].map(option => (
                    <TouchableOpacity
                      key={option}
                      style={styles.dropdownOption}
                      onPress={() => {
                        onGenderChange(option);
                        onToggleGenderDropdown();
                      }}
                    >
                      <Text style={styles.dropdownOptionText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            
            <View style={[styles.dropdownContainer, showLocationDropdown && styles.dropdownContainerActive]}>
              <TouchableOpacity
                style={styles.inputContainer}
                onPress={() => {
                  if (showGenderDropdown) onToggleGenderDropdown();
                  onToggleLocationDropdown();
                }}
              >
                <MaterialCommunityIcons name="map-marker" size={18} color="#666" style={styles.inputIcon} />
                {!showLocationDropdown ? (
                  <>
                    <Text style={[styles.input, { color: location ? '#333' : '#ccc', flex: 1 }]}>
                      {location || 'Select City'}
                    </Text>
                    <MaterialCommunityIcons name="chevron-down" size={18} color="#666" />
                  </>
                ) : (
                  <>
                    <TextInput
                      placeholder="Search city..."
                      value={cityQuery}
                      onChangeText={onCityQueryChange}
                      style={[styles.input, { flex: 1 }]}
                      placeholderTextColor="#999"
                      autoFocus
                    />
                    <TouchableOpacity onPress={onToggleLocationDropdown}>
                      <MaterialCommunityIcons name="close" size={18} color="#666" />
                    </TouchableOpacity>
                  </>
                )}
              </TouchableOpacity>

              {showLocationDropdown && (
                <View style={styles.dropdownMenu}>
                  <ScrollView
                    nestedScrollEnabled
                    keyboardShouldPersistTaps="handled"
                    style={{ maxHeight: 150 }}
                  >
                    {finlandCities.map(city => (
                      <TouchableOpacity
                        key={city}
                        style={styles.dropdownOption}
                        onPress={() => {
                          onLocationChange(city);
                          onToggleLocationDropdown();
                        }}
                      >
                        <Text style={styles.dropdownOptionText}>{city}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <Text style={styles.sectionLabel}>Select Your Sports</Text>

            <View style={styles.sportsContainer}>
              {availableSports.map(sport => (
                <TouchableOpacity
                  key={sport}
                  style={[styles.sportChip, selectedSports.includes(sport) && styles.sportChipSelected]}
                  onPress={() => { closeAllDropdowns(); onToggleSport(sport); }}
                >
                  <Text style={[styles.sportChipText, selectedSports.includes(sport) && styles.sportChipTextSelected]}>
                    {sport}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionLabel}>Bio</Text>

            <View style={styles.bioInputContainer}>
              <TextInput
                placeholder="Tell us about yourself..."
                value={bio}
                onChangeText={onBioChange}
                style={[styles.input, styles.bioInput]}
                placeholderTextColor="#ccc"
                multiline
                onFocus={closeAllDropdowns}
              />
            </View>

            <Text style={styles.sectionLabel}>Password</Text>

            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="lock-outline" size={18} color="#666" style={styles.inputIcon} />
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={onPasswordChange}
                secureTextEntry
                placeholderTextColor="#ccc"
                style={styles.input}
                onFocus={closeAllDropdowns}
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="lock-outline" size={18} color="#666" style={styles.inputIcon} />
              <TextInput
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={onConfirmPasswordChange}
                secureTextEntry
                placeholderTextColor="#ccc"
                style={styles.input}
                onFocus={closeAllDropdowns}
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            
            <LinearGradient
              colors={gradients.authBackground}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.registerButton}
            >
              <TouchableOpacity onPress={() => { closeAllDropdowns(); onRegister(); }} style={styles.buttonInner}>
                <Text style={styles.registerButtonText}>Sign Up</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </TouchableWithoutFeedback>
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
    marginBottom: 15,
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
    paddingHorizontal: 5,
    marginBottom: 10,
    backgroundColor: '#fafafa',
    paddingTop: 12,
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
  bioInput: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: 0,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    marginTop: 5,
  },
  sportsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
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
  dropdownContainer: {
    position: 'relative',
    marginBottom: 1,
    zIndex: 1,
  },
  dropdownContainerActive: {
    zIndex: 50,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
    zIndex: 100,
    elevation: 10,
  },
  dropdownOption: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownSearch: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fff',
  },
});