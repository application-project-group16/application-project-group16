import { Alert } from 'react-native';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { doc, updateDoc } from '../../firebase/Config';
import { db } from '../../firebase/Config';
import RegisterView from './RegisterView';
import { FINLAND_CITIES } from '../../Models/User';


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
  const [cityQuery, setCityQuery] = useState('');
  const filteredCities = FINLAND_CITIES.filter(city =>
    city.toLowerCase().includes(cityQuery.trim().toLowerCase())
  );
  const handleRegister = async () => {
    const ageNum = parseInt(age);
    try {
      setError('');
      if (!name || !email || !age|| !password || !gender || !location) {
        setError('Fill all required fields.');
        return;
      }
      if (ageNum < 18 || ageNum > 70) {
        Alert.alert('Age must be between 18 and 70.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (selectedSports.length === 0) {
        Alert.alert('Choose at least one sport.');
        return;
      }
      await register(name, email, ageNum, gender, location, password, bio);
      setModalVisible(true);
    } catch (err: any) {
      setError(err.message);
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
      finlandCities={filteredCities}
      cityQuery={cityQuery}
      onCityQueryChange={setCityQuery}
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
      showGenderDropdown={showGenderDropdown}
      showLocationDropdown={showLocationDropdown}
      onToggleGenderDropdown={() => setShowGenderDropdown(!showGenderDropdown)}
      onToggleLocationDropdown={() => setShowLocationDropdown(!showLocationDropdown)}
    />
  );
}