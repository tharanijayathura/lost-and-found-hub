import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../constants/context/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { useTheme } from '../constants/ThemeContext';

export default function Index() {
  const { user, isLoading } = useAuth();
  const { colors } = useTheme();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for the router to be ready
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Show loading while checking authentication or router is not ready
  if (!isReady || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Redirect based on authentication status
  if (user) {
    return <Redirect href="/home" />;
  }

  return <Redirect href="/login" />;
}
