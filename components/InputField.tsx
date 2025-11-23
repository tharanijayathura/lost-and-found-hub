import { TextInput } from 'react-native';
import Colors from '../constants/Colors';

export default function InputField({ value, onChangeText, placeholder, secureTextEntry }: any) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      style={{
        borderWidth: 1,
        borderColor: Colors.gray,
        padding: 12,
        borderRadius: 10,
        marginBottom: 12,
      }}
    />
  );
}
