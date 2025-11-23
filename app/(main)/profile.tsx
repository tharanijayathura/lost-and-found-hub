import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import CustomButton from '../../components/CustomButton';
import InputField from '../../components/InputField';
import { useAuth } from '../../constants/context/AuthContext';

export default function Profile() {
  const { user, logout, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const router = useRouter();

  const handleSave = () => updateProfile(name, email);
  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#f5f5f5' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Profile</Text>
      <InputField value={name} onChangeText={setName} placeholder="Name" />
      <InputField value={email} onChangeText={setEmail} placeholder="Email" />
      <CustomButton title="Save" onPress={handleSave} />
      <CustomButton title="Logout" onPress={handleLogout} />
    </View>
  );
}
