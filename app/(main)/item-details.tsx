import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import Colors from '../../constants/Colors';

export default function ItemDetails() {
  const params = useLocalSearchParams();
  const { item }: any = typeof params.item === 'string' ? JSON.parse(params.item) : params.item;

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#f5f5f5' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: Colors.text }}>{item.title}</Text>
      <Text style={{ fontSize: 18, color: Colors.gray, marginVertical: 10 }}>Location: {item.location}</Text>
      <Text style={{ fontSize: 18, color: Colors.gray }}>Date: {item.date}</Text>
    </View>
  );
}
