import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import CustomButton from '../../components/CustomButton';
import InputField from '../../components/InputField';
import { useItems } from '../../constants/context/ItemContext';

export default function AddItem() {
  const { addItem } = useItems();
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const router = useRouter();

  const handleAdd = () => {
    addItem({ title, location, date });
    router.back();
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#f5f5f5' }}>
      <InputField placeholder="Title" value={title} onChangeText={setTitle} />
      <InputField placeholder="Location" value={location} onChangeText={setLocation} />
      <InputField placeholder="Date" value={date} onChangeText={setDate} />
      <CustomButton title="Add Item" onPress={handleAdd} />
    </View>
  );
}
