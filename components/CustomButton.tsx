import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  loading?: boolean;
  disabled?: boolean;
}

export default function CustomButton({ 
  title, 
  onPress, 
  variant = 'primary',
  loading = false,
  disabled = false 
}: CustomButtonProps) {
  const isOutline = variant === 'outline';
  const isDanger = variant === 'danger';
  
  if (isOutline) {
    return (
      <TouchableOpacity
        style={[styles.button, styles.outlineButton, disabled && styles.disabled]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator color={Colors.primary} />
        ) : (
          <Text style={[styles.text, styles.outlineText]}>{title}</Text>
        )}
      </TouchableOpacity>
    );
  }

  const gradientColors: [string, string] = isDanger 
    ? [Colors.error, '#dc2626']
    : variant === 'secondary'
    ? [Colors.secondary, '#7c3aed']
    : [Colors.primary, Colors.primaryDark];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={disabled && styles.disabled}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.button, disabled && styles.disabled]}
      >
        {loading ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <Text style={styles.text}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  text: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  outlineText: {
    color: Colors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
});
