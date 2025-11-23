import { TouchableOpacity, Text } from 'react-native';
import Colors from '../constants/Colors';

export default function CustomButton({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: Colors.primary,
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
      }}
      onPress={onPress}
    >
      <Text style={{ color: Colors.white, textAlign: 'center', fontWeight: 'bold' }}>{title}</Text>
    </TouchableOpacity>
  );
}
