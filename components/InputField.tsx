import { TextInput, View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

interface InputFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  label?: string;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
}

export default function InputField({ 
  value, 
  onChangeText, 
  placeholder, 
  secureTextEntry,
  label,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default'
}: InputFieldProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.gray}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        numberOfLines={numberOfLines}
        keyboardType={keyboardType}
        style={[
          styles.input,
          multiline && styles.multilineInput
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.grayLight,
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.white,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
});
