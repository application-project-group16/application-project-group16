import { Alert } from 'react-native';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { doc, updateDoc } from '../../firebase/Config';
import { db } from '../../firebase/Config';
import RegisterView from './RegisterView';

const FINLAND_CITIES = [
  'Helsinki', 'Espoo', 'Tampere', 'Vantaa', 'Turku', 'Oulu', 'Kuopio',
  'Jyväskylä', 'Lahti', 'Pori', 'Kouvola', 'Joensuu', 'Lappeenranta',
  'Hämeenlinna', 'Vaasa', 'Seinäjoki', 'Rovaniemi', 'Mikkeli', 'Savonlinna'
];

export default function RegisterViewModel() {
  const navigation = useNavigation<any>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const { register, user } = useAuth();
  const [error, setError] = useState('');
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const handleRegister = async () => {
    try {
      setError('');
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (!name || !email || !password) {
        setError('Fill all required fields.');
        return;
      }
      await register(name, email, password);
      setModalVisible(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleProfile = async () => {
    const ageNum = parseInt(age);
    if (!age || !gender || !location || selectedSports.length === 0) {
      Alert.alert('Fill in all required profile fields and choose at least one sport.');
      return;
    }
    if (ageNum < 18 || ageNum > 70) {
      Alert.alert('Age must be between 18 and 70.');
      return;
    }
    try {
      if (user?.uid) {
        await updateDoc(doc(db, 'users', user.uid), {
          age: ageNum,
          gender: gender,
          location: location,
          bio: bio,
          sports: selectedSports,
        });
        Alert.alert('Profile updated!');
        setModalVisible(false);
        navigation.navigate('Home');
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
    <RegisterView
      name={name}
      email={email}
      age={age}
      password={password}
      confirmPassword={confirmPassword}
      gender={gender}
      location={location}
      bio={bio}
      selectedSports={selectedSports}
      modalVisible={modalVisible}
      error={error}
      finnlandCities={FINLAND_CITIES}
      onNameChange={setName}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onConfirmPasswordChange={setConfirmPassword}
      onAgeChange={setAge}
      onGenderChange={(option) => {
        setGender(option);
        setShowGenderDropdown(false);
      }}
      onLocationChange={(city) => {
        setLocation(city);
        setShowLocationDropdown(false);
      }}
      onBioChange={setBio}
      onToggleSport={toggleSport}
      onRegister={handleRegister}
      onNavigateToLogin={() => navigation.navigate('Login')}
      onCompleteProfile={handleProfile}
      showGenderDropdown={showGenderDropdown}
      showLocationDropdown={showLocationDropdown}
      onToggleGenderDropdown={() => setShowGenderDropdown(!showGenderDropdown)}
      onToggleLocationDropdown={() => setShowLocationDropdown(!showLocationDropdown)}
    />
  );
}