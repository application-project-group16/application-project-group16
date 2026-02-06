import { Alert } from 'react-native';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { doc, updateDoc } from '../../firebase/Config';
import { db } from '../../firebase/Config';
import RegisterView from './RegisterView';

export default function RegisterViewModel() {
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
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      setError('');
      if (password !== secondPassword) {
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
    if (!age || !gender || selectedSports.length === 0) {
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
      password={password}
      secondPassword={secondPassword}
      age={age}
      gender={gender}
      selectedSports={selectedSports}
      modalVisible={modalVisible}
      error={error}
      onNameChange={setName}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSecondPasswordChange={setSecondPassword}
      onAgeChange={setAge}
      onGenderChange={setGender}
      onToggleSport={toggleSport}
      onRegister={handleRegister}
      onNavigateToLogin={() => navigation.navigate('Login')}
      onCompleteProfile={handleProfile}
    />
  );
}