import { View, Text, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';

export default function ItemCard({ item, onPress }: { item: any; onPress?: () => void }) {
  return (
    <TouchableOpacity
      style={{
        padding: 15,
        borderWidth: 1,
        borderColor: Colors.gray,
        borderRadius: 12,
        marginBottom: 12,
        backgroundColor: Colors.white,
      }}
      onPress={onPress}
    >
      <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.text }}>{item.title}</Text>
      <Text style={{ color: Colors.gray }}>{item.location}</Text>
      <Text style={{ color: Colors.gray }}>{item.date}</Text>
    </TouchableOpacity>
  );
}
