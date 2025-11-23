import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import CustomButton from '../../components/CustomButton';
import InputField from '../../components/InputField';
import { useItems } from '../../constants/context/ItemContext';

export default function EditItem({ navigation }: any) {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { item }: any = typeof params.item === 'string' ? JSON.parse(params.item) : params.item;
  const { editItem } = useItems();

  const [title, setTitle] = useState(item.title);
  const [location, setLocation] = useState(item.location);
  const [date, setDate] = useState(item.date);

  const handleEdit = () => {
    editItem({ id: item.id, title, location, date });
    router.back();
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#f5f5f5' }}>
      <InputField placeholder="Title" value={title} onChangeText={setTitle} />
      <InputField placeholder="Location" value={location} onChangeText={setLocation} />
      <InputField placeholder="Date" value={date} onChangeText={setDate} />
      <CustomButton title="Save Changes" onPress={handleEdit} />
    </View>
  );
}
