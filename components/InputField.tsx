import { TextInput, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../constants/ThemeContext';

interface InputFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  label?: string;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  editable?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export default function InputField({ 
  value, 
  onChangeText, 
  placeholder, 
  secureTextEntry,
  label,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
  editable = true,
  autoCapitalize = 'sentences'
}: InputFieldProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.gray}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        numberOfLines={numberOfLines}
        keyboardType={keyboardType}
        editable={editable}
        autoCapitalize={autoCapitalize}
        style={[
          styles.input,
          multiline && styles.multilineInput,
          !editable && styles.inputDisabled
        ]}
      />
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.card,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputDisabled: {
    backgroundColor: colors.grayLight,
    opacity: 0.6,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
});
