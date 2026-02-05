import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/Config';
import SettingsView from './SettingsView';

const CLOUDINARY_CLOUD_NAME = 'dkud50kcl';
const CLOUDINARY_UPLOAD_PRESET = 'e9kg78jq';
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export default function SettingsViewModel() {
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | null>(null);
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [showImageOptions, setShowImageOptions] = useState(false);

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
        name, age, city, bio, sports: selectedSports, image, updatedAt: new Date(),
      },
      { merge: true }
    );

      Alert.alert('Saved!', `Name: ${name}\nAge: ${age}\nCity: ${city}\nBio: ${bio}\nSports: ${selectedSports.join(', ')}`);
    } catch {
      Alert.alert('Error', 'Saving failed');
    }
  };

  return (
    <SettingsView
      name={name}
      age={age}
      city={city}
      bio={bio}
      selectedSports={selectedSports}
      image={image}
      showImageOptions={showImageOptions}
      onNameChange={setName}
      onAgeChange={setAge}
      onCityChange={setCity}
      onBioChange={setBio}
      onToggleSport={toggleSport}
      onShowImageOptions={() => setShowImageOptions(true)}
      onHideImageOptions={() => setShowImageOptions(false)}
      onPickFromCamera={pickFromCamera}
      onPickFromGallery={pickFromGallery}
      onSave={handleSave}
    />
  );
}