import { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  studentId?: string;
  profileImageUri?: string;
  password?: string; // For mock purposes only
}

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

const USERS_STORAGE_KEY = '@lost_and_found_users';
const CURRENT_USER_KEY = '@lost_and_found_current_user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load current user on mount
  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const userJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
      if (userJson) {
        const userData = JSON.parse(userJson);
        // Remove password from user object before setting
        const { password, ...userWithoutPassword } = userData;
        setUser(userWithoutPassword);
      }
    } catch (error) {
      console.error('Error loading current user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStoredUsers = async (): Promise<User[]> => {
    try {
      const usersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      console.error('Error getting stored users:', error);
      return [];
    }
  };

  const saveUsers = async (users: User[]) => {
    try {
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const users = await getStoredUsers();
      const foundUser = users.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (foundUser) {
        // Remove password before storing current user
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
        return true;
      }

      // If no user found, return false
      return false;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const users = await getStoredUsers();
      
      // Check if user already exists
      const existingUser = users.find(
        u => u.email.toLowerCase() === email.toLowerCase()
      );

      if (existingUser) {
        return false; // User already exists
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email: email.toLowerCase(),
        password, // Store password for mock authentication
        phone: '',
        studentId: '',
        profileImageUri: undefined
      };

      // Add to users array
      users.push(newUser);
      await saveUsers(users);

      // Automatically log in the new user
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));

      return true;
    } catch (error) {
      console.error('Error during registration:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      
      // Update in AsyncStorage
      try {
        await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
        
        // Also update in users list
        const users = await getStoredUsers();
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
          users[userIndex] = { ...users[userIndex], ...updates };
          await saveUsers(users);
        }
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
