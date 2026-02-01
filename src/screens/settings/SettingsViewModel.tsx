import React, { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import SettingsView from './SettingsView';
import { useAuth } from '../../context/AuthContext';

export default function SettingsViewModel() {
  const { logout } = useAuth();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showImageOptions, setShowImageOptions] = useState(false);

  const toggleSport = (sport: string) => {
    if (selectedSports.includes(sport)) {
      setSelectedSports(selectedSports.filter(s => s !== sport));
    } else {
      setSelectedSports([...selectedSports, sport]);
    }
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      setShowImageOptions(false);
    }
  };

  const pickFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Camera permission is required to take a photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      setShowImageOptions(false);
    }
  };

  const handleSave = () => {
    // TODO: Implement database call to save profile with image
    Alert.alert('Saved!', `Name: ${name}\nAge: ${age}\nBio: ${bio}\nSports: ${selectedSports.join(', ')}`);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <SettingsView
      name={name}
      age={age}
      bio={bio}
      selectedSports={selectedSports}
      profileImage={profileImage}
      showImageOptions={showImageOptions}
      onNameChange={setName}
      onAgeChange={setAge}
      onBioChange={setBio}
      onToggleSport={toggleSport}
      onShowImageOptions={() => setShowImageOptions(true)}
      onHideImageOptions={() => setShowImageOptions(false)}
      onPickFromCamera={pickFromCamera}
      onPickFromGallery={pickFromGallery}
      onSave={handleSave}
      onLogout={handleLogout}
    />
  );
}