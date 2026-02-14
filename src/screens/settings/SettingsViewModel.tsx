import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth } from '../../firebase/Config';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/Config';
import SettingsView from './SettingsView';
import { useAuth } from '../../context/AuthContext';
import { FINLAND_CITIES } from '../../Models/User';

const CLOUDINARY_CLOUD_NAME = 'dkud50kcl';
const CLOUDINARY_UPLOAD_PRESET = 'e9kg78jq';
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export default function SettingsViewModel() {
  const { logout, user } = useAuth();
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | null>(null);
  const [gender, setGender] = useState('');
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [cityQuery, setCityQuery] = useState('');
  const filteredCities = FINLAND_CITIES.filter(city =>
    city.toLowerCase().includes(cityQuery.trim().toLowerCase())
  );
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const user = getAuth().currentUser;
      if (!user) return;

      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          const data = snap.data();

          setName(data.name ?? '');
          setAge(typeof data.age === 'number' ? data.age : null);
          setCity(data.city ?? '');
          setBio(data.bio ?? '');
          setSelectedSports(Array.isArray(data.sports) ? data.sports : []);
          setImage(data.image ?? null);
        }
      } catch (e) {
        console.error('Failed to load profile', e);
      }
    };

    loadProfile();
  }, []);

  const toggleSport = (sport: string) => {
    if (selectedSports.includes(sport)) {
      setSelectedSports(selectedSports.filter(s => s !== sport));
    } else {
      setSelectedSports([...selectedSports, sport]);
    }
  };

  const uploadToCloudinary = async (uri: string): Promise<string> => {
    const formData = new FormData();

    formData.append('file', {
      uri,
      type: 'image/jpeg',
      name: 'profile.jpg',
    } as any);

    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!data.secure_url) {
      throw new Error('Upload failed');
    }

    return data.secure_url;
  };
  
  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0].uri) {
      try {
        const url = await uploadToCloudinary(result.assets[0].uri);
        setImage(url);
        setShowImageOptions(false);
      } catch {
        Alert.alert('Error', 'Image upload failed');
      }
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
      quality: 0.5,
    });

    if (!result.canceled) {
      try {
        const url = await uploadToCloudinary(result.assets[0].uri);
        setImage(url);
        setShowImageOptions(false);
      } catch {
        Alert.alert('Error', 'Image upload failed');
      }
    }
  };

  const handleSave = async () => {
    const user = getAuth().currentUser;
    if (!user) {
      Alert.alert('Not logged in');
      return;
    }

    try {
      await setDoc(doc(db, 'users', user.uid), {
        name, age, gender, city, bio, sports: selectedSports, image, updatedAt: new Date(),
      },
      { merge: true }
    );

      Alert.alert('Saved!', `Name: ${name}\nAge: ${age}\nGender: ${gender}\nCity: ${city}\nBio: ${bio}\nSports: ${selectedSports.join(', ')}`);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Saving failed');
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters.');
      return;
    }

    try {
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.email) {
        Alert.alert('Error', 'Unable to get current user.');
        return;
      }

      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);

      await updatePassword(currentUser, newPassword);

      Alert.alert('Success', 'Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordModal(false);
    } catch (error: any) {
      if (error.code === 'auth/wrong-password') {
        Alert.alert('Error', 'Current password is incorrect.');
      } else {
        Alert.alert('Error', error.message);
      }
    }
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


  const onToggleGenderDropdown = () => {
    setShowGenderDropdown(!showGenderDropdown);
  };

  const onGenderChange = (gender: string) => {
    setGender(gender);
  };

  return (
    <SettingsView
      name={name}
      age={age}
      city={city}
      cityQuery={cityQuery}
      onCityQueryChange={setCityQuery}
      bio={bio}
      selectedSports={selectedSports}
      image={image}
      gender={gender}
      showImageOptions={showImageOptions}
      showPasswordModal={showPasswordModal}
      currentPassword={currentPassword}
      newPassword={newPassword}
      confirmPassword={confirmPassword}
      onNameChange={setName}
      onAgeChange={setAge}
      onCityChange={(city) => {
        setCity(city);
        setShowCityDropdown(false);
      }}
      onBioChange={setBio}
      onToggleSport={toggleSport}
      onShowImageOptions={() => setShowImageOptions(true)}
      onHideImageOptions={() => setShowImageOptions(false)}
      onPickFromCamera={pickFromCamera}
      onPickFromGallery={pickFromGallery}
      onSave={handleSave}
      onShowPasswordModal={() => setShowPasswordModal(true)}
      onHidePasswordModal={() => {
        setShowPasswordModal(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }}
      onCurrentPasswordChange={setCurrentPassword}
      onNewPasswordChange={setNewPassword}
      onConfirmPasswordChange={setConfirmPassword}
      onChangePassword={handleChangePassword}
      onLogout={handleLogout}
      showCityDropdown={showCityDropdown}
      onToggleCityDropdown={() => setShowCityDropdown(!showCityDropdown)}
      finlandCities={filteredCities}
      showGenderDropdown={showGenderDropdown}
      onToggleGenderDropdown={onToggleGenderDropdown}
      onGenderChange={onGenderChange}
    />
  );
}