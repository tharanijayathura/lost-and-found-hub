// Firebase Configuration
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Platform } from 'react-native';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHCVYW78Y9ZW-QHSp6OjwW85mjJi0-yLI",
  authDomain: "lost-and-found-hub-25a52.firebaseapp.com",
  projectId: "lost-and-found-hub-25a52",
  storageBucket: "lost-and-found-hub-25a52.firebasestorage.app",
  messagingSenderId: "331630424860",
  appId: "1:331630424860:web:26e6aa1117f9a7364f80d9",
  measurementId: "G-0PCHDQ6TSN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
// Use AsyncStorage persistence on native to avoid runtime warnings
export const auth = Platform.OS === 'web'
  ? getAuth(app)
  : initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });

// Initialize Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;

