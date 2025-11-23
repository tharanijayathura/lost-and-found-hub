import { Stack } from 'expo-router';
import Colors from '../../constants/Colors';

export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
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

