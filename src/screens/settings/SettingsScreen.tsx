import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';

const availableSports = [
  'Football', 'Tennis', 'Badminton', 'Bowling', 'Running',
  'Cycling', 'Gym', 'Swimming', 'Basketball', 'Yoga', 'CrossFit', 'Climbing'
];

export default function SettingsScreen() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [selectedSports, setSelectedSports] = useState<string[]>([]);

  const toggleSport = (sport: string) => {
    if (selectedSports.includes(sport)) {
      setSelectedSports(selectedSports.filter(s => s !== sport));
    } else {
      setSelectedSports([...selectedSports, sport]);
    }
  };

  const handleSave = () => {
    // Replace with your save logic (e.g. update profile in Firebase)
    Alert.alert('Saved!', `Name: ${name}\nAge: ${age}\nBio: ${bio}\nSports: ${selectedSports.join(', ')}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
      />

      <Text style={styles.label}>Age</Text>
      <TextInput
        style={styles.input}
        value={age}
        onChangeText={setAge}
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
            onPress={() => toggleSport(sport)}
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
        onChangeText={setBio}
        placeholder="Tell something about yourself"
        multiline
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
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
});