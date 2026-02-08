import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Modal, TouchableWithoutFeedback, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AVAILABLE_SPORTS } from '../../Models/User';
import { gradients, colors } from '../../Models/Gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const availableSports = AVAILABLE_SPORTS;

interface SettingsViewProps {
  name: string;
  age: number;
  bio: string;
  city: string;
  selectedSports: string[];
  image: string | null;
  showImageOptions: boolean;
  showPasswordModal: boolean;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  onNameChange: (name: string) => void;
  onAgeChange: (age: number) => void;
  onCityChange: (city: string) => void;
  onBioChange: (bio: string) => void;
  onToggleSport: (sport: string) => void;
  onShowImageOptions: () => void;
  onHideImageOptions: () => void;
  onPickFromCamera: () => void;
  onPickFromGallery: () => void;
  onSave: () => void;
  onShowPasswordModal: () => void;
  onHidePasswordModal: () => void;
  onCurrentPasswordChange: (password: string) => void;
  onNewPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (password: string) => void;
  onChangePassword: () => void;
  onLogout: () => void;
}

export default function SettingsView({
  name,
  age,
  bio,
  city,
  selectedSports,
  image,
  showImageOptions,
  showPasswordModal,
  currentPassword,
  newPassword,
  confirmPassword,
  onNameChange,
  onAgeChange,
  onCityChange,
  onBioChange,
  onToggleSport,
  onShowImageOptions,
  onHideImageOptions,
  onPickFromCamera,
  onPickFromGallery,
  onSave,
  onShowPasswordModal,
  onHidePasswordModal,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onChangePassword,
  onLogout,
}: SettingsViewProps) {
  const navigation = useNavigation();
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <MaterialCommunityIcons name="arrow-left" size={24} color="#FF6B35" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.profileTop}>
          <TouchableOpacity onPress={onShowImageOptions} style={styles.profileImageWrapper}>
            {image ? (
              <Image source={{ uri: image }} style={styles.profileImageTop} />
            ) : (
              <MaterialCommunityIcons name="account-circle" size={120} color="#FF6B35" />
            )}
            <View style={styles.editIconContainer}>
              <MaterialCommunityIcons name="pencil" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>
        <Text style={styles.sectionLabel}>
          <MaterialCommunityIcons name="account" size={18} color={colors.text} /> Name
        </Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={onNameChange}
          placeholder="Enter your name"
          placeholderTextColor="#ccc"
        />

        <Text style={styles.label}>City</Text>
        <TextInput
          style={styles.input}
          value={city}
          onChangeText={onCityChange}
          placeholder="Enter your city"
        />

        <Text style={styles.sectionLabel}>
          <MaterialCommunityIcons name="calendar" size={18} color={colors.text} /> Age
        </Text>
        <TextInput
          style={styles.input}
          value={age != null ? age.toString() : ''}
          onChangeText={text => onAgeChange(text === '' ? null : Number(text))}
          placeholder="Enter your age"
          keyboardType="numeric"
        />

        <Text style={styles.sectionLabel}>Your Sports</Text>
        <View style={styles.sportsContainer}>
          {availableSports.map(sport => (
            <TouchableOpacity
              key={sport}
              style={[
                styles.sportChip,
                selectedSports.includes(sport) && styles.sportChipSelected
              ]}
              onPress={() => onToggleSport(sport)}
            >
              <Text style={[
                styles.sportChipText,
                selectedSports.includes(sport) && styles.sportChipTextSelected
              ]}>
                {sport}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>
          <MaterialCommunityIcons name="message-text" size={18} color={colors.text} /> Bio
        </Text>
        <TextInput
          style={[styles.input, styles.bioInput]}
          value={bio}
          onChangeText={onBioChange}
          placeholder="Tell something about yourself..."
          placeholderTextColor="#ccc"
          multiline
        />

        <LinearGradient
          colors={gradients.authBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.saveButton}
        >
          <TouchableOpacity onPress={onSave} style={[styles.buttonInner, styles.buttonRow]}>
            <MaterialCommunityIcons name="content-save" size={20} color="#fff" style={styles.buttonIconLeft} />
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </LinearGradient>

        <LinearGradient
          colors={gradients.authBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.changePasswordButton}
        >
          <TouchableOpacity 
            style={[styles.buttonInner, styles.buttonRow]}
            onPress={onShowPasswordModal}
          >
            <MaterialCommunityIcons name="lock-reset" size={20} color="#fff" style={styles.buttonIconLeft} />
            <Text style={styles.changePasswordButtonText}>Change Password</Text>
          </TouchableOpacity>
        </LinearGradient>

        <LinearGradient
          colors={['#d32f2f', '#c62828']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.logoutButton}
        >
          <TouchableOpacity onPress={onLogout} style={[styles.buttonInner, styles.buttonRow]}>
            <MaterialCommunityIcons name="logout" size={20} color="#fff" style={styles.buttonIconLeft} />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
      <Modal
        visible={showImageOptions}
        transparent
        animationType="fade"
        onRequestClose={onHideImageOptions}
      >
        <TouchableWithoutFeedback onPress={onHideImageOptions}>
          <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback>
          <View style={styles.imageOptionsContainer}>
            <TouchableOpacity 
              style={styles.imageOption}
              onPress={onPickFromCamera}
            >
              <View style={styles.imageOptionContent}>
                <MaterialCommunityIcons name="camera" size={20} color="#333" style={styles.imageOptionIcon} />
                <Text style={styles.imageOptionText}>Take Photo</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.imageOption}
              onPress={onPickFromGallery}
            >
              <View style={styles.imageOptionContent}>
                <MaterialCommunityIcons name="image" size={20} color="#333" style={styles.imageOptionIcon} />
                <Text style={styles.imageOptionText}>Choose from Gallery</Text>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        visible={showPasswordModal}
        transparent
        animationType="slide"
        onRequestClose={onHidePasswordModal}
      >
        <TouchableWithoutFeedback onPress={onHidePasswordModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.passwordModalContent}>
                <Text style={styles.passwordModalTitle}>Change Password</Text>

                <TextInput
                  style={styles.input}
                  value={currentPassword}
                  onChangeText={onCurrentPasswordChange}
                  placeholder="Current Password"
                  secureTextEntry
                  placeholderTextColor="#ccc"
                />

                <TextInput
                  style={[styles.input, styles.passwordInput]} 
                  value={newPassword}
                  onChangeText={onNewPasswordChange}
                  placeholder="New Password"
                  secureTextEntry
                  placeholderTextColor="#ccc"
                />

                <TextInput
                  style={[styles.input, styles.passwordInput]} 
                  value={confirmPassword}
                  onChangeText={onConfirmPasswordChange}
                  placeholder="Confirm New Password"
                  secureTextEntry
                  placeholderTextColor="#ccc"
                />

                <LinearGradient
                  colors={gradients.authBackground}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.saveButton}
                >
                  <TouchableOpacity onPress={onChangePassword} style={styles.buttonInner}>
                    <Text style={styles.saveButtonText}>Update Password</Text>
                  </TouchableOpacity>
                </LinearGradient>

                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={onHidePasswordModal}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  profileTop: {
    alignItems: 'center',
    paddingBottom: 3,
  },
  profileImageWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImageTop: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#FF6B35',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF6B35',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIconLeft: {
    marginRight: 8,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 1,
    paddingBottom: 10,
  },
  sectionLabel: {
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
    marginTop: 15,
    marginBottom: 5,
  },
  label: { 
    fontWeight: 'bold', 
    marginTop: 16, 
    marginBottom: 6 
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 14,
    backgroundColor: '#fafafa',
    fontSize: 16,
    color: '#333',
  },
  passwordInput: {
    marginTop: 7,
  },
  bioInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  sportsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
    marginTop: 10,
  },
  sportChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sportChipSelected: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  sportChipText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  sportChipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  saveButton: {
    borderRadius: 12,
    marginTop: 20,
    overflow: 'hidden',
  },
  changePasswordButton: {
    borderRadius: 12,
    marginTop: 10,
    overflow: 'hidden', 
  },
  changePasswordButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  logoutButton: {
    borderRadius: 12,
    marginTop: 10,
    overflow: 'hidden',
    marginBottom: 8,
  },
  buttonInner: {
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageOptionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    width: '80%',
    maxWidth: 300,
  },
  imageOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  imageOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageOptionIcon: {
    marginRight: 12,
  },
  imageOptionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  passwordModalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 22,
    maxHeight: '80%',
    paddingBottom: 13,
  },
  passwordModalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 22,
    color: '#000',
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 6,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF6B35',
  },
});