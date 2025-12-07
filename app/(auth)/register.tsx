import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../../components/CustomButton';
import InputField from '../../components/InputField';
import { useRouter } from 'expo-router';
import { useAuth } from '../../constants/context/AuthContext';
import { useTheme } from '../../constants/ThemeContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register } = useAuth();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const handleRegister = async () => {
    // Validation
    if (!name || !email || !password || !studentId) {
      Alert.alert('Required Fields', 'Please fill in all required fields including Student Index Number.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match. Please try again.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters long.');
      return;
    }

    if (studentId.trim().length === 0) {
      Alert.alert('Student ID Required', 'Please enter your Student Index Number.');
      return;
    }

    setLoading(true);
    try {
      const success = await register(name, email, password, studentId.trim());
      if (success) {
        // Reset form
        setName('');
        setEmail('');
        setStudentId('');
        setPassword('');
        setConfirmPassword('');
        setLoading(false);
        
        // Show success message first
        Alert.alert(
          'Registration Successful',
          'Your account has been created! Please login to continue.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate to login screen
                router.replace('/login');
              }
            }
          ],
          { cancelable: false }
        );
      } else {
        setLoading(false);
        Alert.alert('Registration Failed', 'An account with this email already exists. Please login instead.');
      }
    } catch (error: any) {
      setLoading(false);
      console.error('Registration error:', error);
      let errorMessage = 'An error occurred during registration. Please try again.';
      
      if (error?.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please login instead.';
      } else if (error?.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error?.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use a stronger password.';
      } else if (error?.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Registration Failed', errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.secondary, colors.primary]}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <Ionicons name="arrow-back" size={24} color={colors.white} />
              </TouchableOpacity>
              <View style={styles.iconContainer}>
                <Ionicons name="person-add" size={48} color={colors.white} />
              </View>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join our community</Text>
            </View>

            <View style={styles.form}>
              <InputField
                label="Full Name"
                placeholder="Enter your full name"
                value={name}
                onChangeText={setName}
              />
              <InputField
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <InputField
                label="Student Index Number *"
                placeholder="Enter your student index number"
                value={studentId}
                onChangeText={setStudentId}
                keyboardType="default"
                autoCapitalize="none"
              />
              <InputField
                label="Password"
                placeholder="Create a password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <InputField
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />

              <CustomButton
                title="Sign Up"
                onPress={handleRegister}
                loading={loading}
                disabled={!name || !email || !password || !studentId || password !== confirmPassword}
              />

              <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/login')}>
                  <Text style={styles.footerLink}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    padding: 8,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.white + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.white + 'CC',
    fontWeight: '500',
  },
  form: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: colors.textLight,
  },
  footerLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
});
