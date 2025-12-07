import { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile as updateFirebaseProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';

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
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, studentId: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // User is signed in, get their profile from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              id: firebaseUser.uid,
              name: userData.name || firebaseUser.displayName || '',
              email: firebaseUser.email || '',
              phone: userData.phone || '',
              studentId: userData.studentId || '',
              profileImageUri: userData.profileImageUri || firebaseUser.photoURL || undefined,
            } as User);
          } else {
            // User exists in Auth but not in Firestore, create profile
            const userData: any = {
              name: firebaseUser.displayName || '',
              email: firebaseUser.email || '',
              phone: '',
              studentId: '',
            };
            
            // Only include profileImageUri if it exists
            if (firebaseUser.photoURL) {
              userData.profileImageUri = firebaseUser.photoURL;
            }
            
            await setDoc(doc(db, 'users', firebaseUser.uid), userData);
            
            setUser({
              id: firebaseUser.uid,
              ...userData,
            } as User);
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
          setUser(null);
        }
      } else {
        // User is signed out
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, studentId: string): Promise<boolean> => {
    // Validate studentId
    if (!studentId || studentId.trim().length === 0) {
      throw new Error('Student Index Number is required');
    }

    // Validate name
    if (!name || name.trim().length === 0) {
      throw new Error('Name is required');
    }

    // Validate email
    if (!email || email.trim().length === 0) {
      throw new Error('Email is required');
    }

    // Validate password
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const firebaseUser = userCredential.user;

      // Update display name
      await updateFirebaseProfile(firebaseUser, { displayName: name.trim() });

      // Create user profile in Firestore with studentId
      // Note: Firestore doesn't accept undefined values, so we omit optional fields
      const newUser: Omit<User, 'id'> & { id?: string } = {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: '',
        studentId: studentId.trim(),
        // Don't include profileImageUri if it's undefined
      };

      // Remove undefined values before saving
      const userData: any = {};
      Object.keys(newUser).forEach(key => {
        if (newUser[key as keyof typeof newUser] !== undefined) {
          userData[key] = newUser[key as keyof typeof newUser];
        }
      });

      await setDoc(doc(db, 'users', firebaseUser.uid), userData);

      // Don't auto-login, user should login manually
      // Sign out immediately - the auth state listener will handle the state change
      await signOut(auth);
      
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      // Re-throw error so register.tsx can handle it properly
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    if (user && auth.currentUser) {
      try {
        // Remove undefined values before updating Firestore
        const firestoreUpdates: any = {};
        Object.keys(updates).forEach(key => {
          const value = updates[key as keyof User];
          // Only include defined values (not undefined)
          if (value !== undefined && key !== 'id') {
            firestoreUpdates[key] = value;
          }
        });
        
        // Update in Firestore
        if (Object.keys(firestoreUpdates).length > 0) {
          await updateDoc(doc(db, 'users', user.id), firestoreUpdates);
        }

        // Update local state
        setUser({ ...user, ...updates });

        // Update Firebase Auth profile if name or photo changed
        if (updates.name || updates.profileImageUri !== undefined) {
          const profileUpdates: { displayName?: string; photoURL?: string | null } = {};
          if (updates.name) {
            profileUpdates.displayName = updates.name;
          }
          if (updates.profileImageUri !== undefined) {
            profileUpdates.photoURL = updates.profileImageUri || null;
          }
          await updateFirebaseProfile(auth.currentUser, profileUpdates);
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error: any) {
      console.error('Error sending password reset:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
