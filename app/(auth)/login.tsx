import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import CustomButton from '../../components/CustomButton';
import InputField from '../../components/InputField';
import { useAuth } from '../../constants/context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    login(email, password);
    router.replace('/home');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Login</Text>
      <InputField placeholder="Email" value={email} onChangeText={setEmail} />
      <InputField placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <CustomButton title="Login" onPress={handleLogin} />
      <CustomButton title="Go to Register" onPress={() => router.push('/register')} />
    </View>
  );
}
