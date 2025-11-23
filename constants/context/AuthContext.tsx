import { createContext, useState, ReactNode, useContext } from 'react';

interface AuthContextProps {
  user: any;
  login: (email: string, password: string) => void;
  logout: () => void;
  updateProfile: (name: string, email: string) => void;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);

  const login = (email: string, password: string) => {
    setUser({ name: 'Student Name', email });
  };

  const logout = () => setUser(null);

  const updateProfile = (name: string, email: string) => setUser({ name, email });

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
