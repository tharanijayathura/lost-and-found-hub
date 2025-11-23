import { Slot } from 'expo-router';
import { AuthProvider } from '../constants/context/AuthContext';
import { ItemProvider } from '../constants/context/ItemContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ItemProvider>
        <Slot />
      </ItemProvider>
    </AuthProvider>
  );
}
