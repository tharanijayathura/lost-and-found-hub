import { Stack } from 'expo-router';
import { useTheme } from '../../constants/ThemeContext';

export default function MainLayout() {
  const { colors } = useTheme();
  
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="home" />
      <Stack.Screen name="add-item" />
      <Stack.Screen name="edit-item" />
      <Stack.Screen name="item-details" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}

