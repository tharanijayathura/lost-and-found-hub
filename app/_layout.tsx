import { Slot } from 'expo-router';
import { AuthProvider } from '../constants/context/AuthContext';
import { ItemProvider } from '../constants/context/ItemContext';
import { ThemeProvider } from '../constants/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ItemProvider>
          <Slot />
        </ItemProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
