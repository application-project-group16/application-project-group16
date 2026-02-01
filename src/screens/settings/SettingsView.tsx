import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, Modal, TouchableWithoutFeedback } from 'react-native';
import { AVAILABLE_SPORTS } from '../../Models/User'

const availableSports = AVAILABLE_SPORTS;

interface SettingsViewProps {
  name: string;
  age: string;
  bio: string;
  selectedSports: string[];
  profileImage: string | null;
  showImageOptions: boolean;
  onNameChange: (name: string) => void;
  onAgeChange: (age: string) => void;
  onBioChange: (bio: string) => void;
  onToggleSport: (sport: string) => void;
  onShowImageOptions: () => void;
  onHideImageOptions: () => void;
  onPickFromCamera: () => void;
  onPickFromGallery: () => void;
  onSave: () => void;
  onLogout: () => void;
}

export default function SettingsView({
  name,
  age,
  bio,
  selectedSports,
  profileImage,
  showImageOptions,
  onNameChange,
  onAgeChange,
  onBioChange,
  onToggleSport,
  onShowImageOptions,
  onHideImageOptions,
  onPickFromCamera,
  onPickFromGallery,
  onSave,
  onLogout,
}: SettingsViewProps) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileImageSection}>
        <View style={styles.profileImageContainer}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.placeholderText}>📷</Text>
            </View>
          )}
        </View>
        <TouchableOpacity 
          style={styles.editImageButton}
          onPress={onShowImageOptions}
        >
          <Text style={styles.editImageButtonText}>Edit Photo</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={onNameChange}
        placeholder="Enter your name"
      />

      <Text style={styles.label}>Age</Text>
      <TextInput
        style={styles.input}
        value={age}
        onChangeText={onAgeChange}
        placeholder="Enter your age"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Your Sports</Text>
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

      <Text style={styles.label}>Bio</Text>
      <TextInput
        style={[styles.input, styles.bioInput]}
        value={bio}
        onChangeText={onBioChange}
        placeholder="Tell something about yourself"
        multiline
      />

      <TouchableOpacity style={styles.saveButton} onPress={onSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
      
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
                  <Text style={styles.imageOptionText}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.imageOption}
                  onPress={onPickFromGallery}
                >
                  <Text style={styles.imageOptionText}>Choose from Gallery</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  profileImageSection: { alignItems: 'center', marginBottom: 24 },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: '#f0f0f0',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  placeholderText: {
    fontSize: 48,
  },
  editImageButton: {
    backgroundColor: '#ff9800',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  editImageButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
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
  imageOptionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
  label: { fontWeight: 'bold', marginTop: 16, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff'
  },
  bioInput: { minHeight: 80, textAlignVertical: 'top' },
  sportsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  sportChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#eee',
    marginRight: 8,
    marginBottom: 8,
  },
  sportChipSelected: {
    backgroundColor: '#ff9800',
  },
  sportChipText: {
    color: '#333',
  },
  sportChipTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#ff9800',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#d32f2f',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});