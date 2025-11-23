import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView, Switch } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../../components/CustomButton';
import InputField from '../../components/InputField';
import { useAuth } from '../../constants/context/AuthContext';
import { useTheme } from '../../constants/ThemeContext';

export default function Profile() {
  const { user, logout, updateProfile } = useAuth();
  const { theme, themeMode, colors, setThemeMode, toggleTheme } = useTheme();
  const router = useRouter();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [studentId, setStudentId] = useState(user?.studentId || '');
  const [profileImageUri, setProfileImageUri] = useState<string | undefined>(user?.profileImageUri);
  const [isEditing, setIsEditing] = useState(false);

  // Update form fields when user data changes
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setStudentId(user.studentId || '');
      setProfileImageUri(user.profileImageUri);
    }
  }, [user]);

  const styles = createStyles(colors);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to change profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImageUri(result.assets[0].uri);
      updateProfile({ profileImageUri: result.assets[0].uri });
    }
  };

  const handleSave = () => {
    updateProfile({ name, email, phone, studentId, profileImageUri });
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Please login to view profile</Text>
          <CustomButton title="Go to Login" onPress={() => router.replace('/login')} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          style={styles.header}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
        </LinearGradient>

        <View style={styles.profileSection}>
          <TouchableOpacity onPress={isEditing ? pickImage : undefined} style={styles.profileImageContainer}>
            {profileImageUri ? (
              <Image
                source={{ uri: profileImageUri }}
                style={styles.profileImage}
                contentFit="cover"
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Ionicons name="person" size={48} color={colors.white} />
              </View>
            )}
            {isEditing && (
              <View style={styles.editImageOverlay}>
                <Ionicons name="camera" size={24} color={colors.white} />
              </View>
            )}
          </TouchableOpacity>
          
          <Text style={styles.profileName}>{name}</Text>
          <Text style={styles.profileEmail}>{email}</Text>

          <TouchableOpacity
            onPress={() => setIsEditing(!isEditing)}
            style={styles.editButton}
          >
            <Ionicons 
              name={isEditing ? "close" : "create-outline"} 
              size={20} 
              color={isEditing ? colors.error : colors.primary} 
            />
            <Text style={[
              styles.editButtonText,
              isEditing && styles.editButtonTextDanger
            ]}>
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formSection}>
          <InputField
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            editable={isEditing}
          />

          <InputField
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={isEditing}
          />

          <InputField
            label="Phone Number"
            placeholder="Enter your phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            editable={isEditing}
          />

          <InputField
            label="Student ID"
            placeholder="Enter your student ID"
            value={studentId}
            onChangeText={setStudentId}
            editable={isEditing}
          />

          {isEditing && (
            <CustomButton
              title="Save Changes"
              onPress={handleSave}
            />
          )}
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.settingsTitle}>Appearance</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="moon-outline" size={24} color={colors.text} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Dark Mode</Text>
                <Text style={styles.settingDescription}>
                  {themeMode === 'auto' 
                    ? 'Following system settings' 
                    : theme === 'dark' 
                    ? 'Dark mode enabled' 
                    : 'Light mode enabled'}
                </Text>
              </View>
            </View>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.grayLight, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
          <View style={styles.themeModeContainer}>
            <TouchableOpacity
              onPress={() => setThemeMode('light')}
              style={[
                styles.themeModeButton,
                themeMode === 'light' && styles.themeModeButtonActive
              ]}
            >
              <Ionicons 
                name="sunny" 
                size={20} 
                color={themeMode === 'light' ? colors.white : colors.text} 
              />
              <Text style={[
                styles.themeModeText,
                themeMode === 'light' && styles.themeModeTextActive
              ]}>
                Light
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setThemeMode('dark')}
              style={[
                styles.themeModeButton,
                themeMode === 'dark' && styles.themeModeButtonActive
              ]}
            >
              <Ionicons 
                name="moon" 
                size={20} 
                color={themeMode === 'dark' ? colors.white : colors.text} 
              />
              <Text style={[
                styles.themeModeText,
                themeMode === 'dark' && styles.themeModeTextActive
              ]}>
                Dark
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setThemeMode('auto')}
              style={[
                styles.themeModeButton,
                themeMode === 'auto' && styles.themeModeButtonActive
              ]}
            >
              <Ionicons 
                name="phone-portrait" 
                size={20} 
                color={themeMode === 'auto' ? colors.white : colors.text} 
              />
              <Text style={[
                styles.themeModeText,
                themeMode === 'auto' && styles.themeModeTextActive
              ]}>
                Auto
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.logoutSection}>
          <CustomButton
            title="Logout"
            onPress={handleLogout}
            variant="danger"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    marginBottom: 16,
    padding: 4,
    alignSelf: 'flex-start',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: colors.card,
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: colors.white,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.white,
  },
  editImageOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 20,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.grayLight,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 8,
  },
  editButtonTextDanger: {
    color: colors.error,
  },
  formSection: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingsSection: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: colors.textLight,
  },
  themeModeContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  themeModeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.grayLight,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  themeModeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  themeModeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 6,
  },
  themeModeTextActive: {
    color: colors.white,
  },
  logoutSection: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: colors.textLight,
    marginBottom: 24,
    textAlign: 'center',
  },
});
