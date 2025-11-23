import { createContext, useState, ReactNode, useContext } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  studentId?: string;
  profileImageUri?: string;
}

interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => void;
  register: (name: string, email: string, password: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string) => {
    // Mock login - in real app, verify credentials
    setUser({ 
      id: '1',
      name: 'John Doe', 
      email,
      phone: '+1 234-567-8900',
      studentId: 'STU2024001',
      profileImageUri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200'
    });
  };

  const register = (name: string, email: string, password: string) => {
    // Mock registration
    setUser({ 
      id: Date.now().toString(),
      name, 
      email,
      phone: '',
      studentId: '',
      profileImageUri: undefined
    });
  };

  const logout = () => setUser(null);

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
