import { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  onSnapshot,
  Timestamp,
  where,
  getDocs,
  getDoc
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from './AuthContext';

export interface Item {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  imageUri?: string;
  category?: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  status?: 'pending' | 'found';
  createdAt?: any;
}

interface ItemContextProps {
  items: Item[];
  favorites: string[];
  addItem: (item: Omit<Item, 'id' | 'createdAt' | 'userName' | 'userEmail'>) => Promise<void>;
  editItem: (item: Item) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  isFavorite: (id: string) => boolean;
  isOwner: (item: Item) => boolean;
  updateItemStatus: (id: string, status: 'pending' | 'found') => Promise<void>;
  getMyItems: () => Item[];
  isLoading: boolean;
}

const ItemContext = createContext<ItemContextProps>({} as ItemContextProps);

export const ItemProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load items from Firestore
  useEffect(() => {
    const itemsQuery = query(
      collection(db, 'items'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(itemsQuery, async (snapshot) => {
      const itemsData: Item[] = [];
      for (const docSnapshot of snapshot.docs) {
        const data = docSnapshot.data();
        let userName = data.userName;
        let userEmail = data.userEmail;
        
        // If user info not in item, fetch from users collection
        if (!userName && data.userId) {
          try {
            const userDoc = await getDoc(doc(db, 'users', data.userId));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              userName = userData.name;
              userEmail = userData.email;
            }
          } catch (error) {
            console.error('Error fetching user info:', error);
          }
        }
        
        itemsData.push({
          id: docSnapshot.id,
          ...data,
          date: data.date || '',
          userName: userName || undefined,
          userEmail: userEmail || undefined,
          status: data.status || 'pending',
          createdAt: data.createdAt,
        } as Item);
      }
      setItems(itemsData);
      setIsLoading(false);
    }, (error) => {
      console.error('Error loading items:', error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Load favorites from Firestore for current user
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }

    const favoritesQuery = query(
      collection(db, 'favorites'),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(favoritesQuery, (snapshot) => {
      const userFavorites: string[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.userId === user.id && data.itemId) {
          userFavorites.push(data.itemId);
        }
      });
      setFavorites(userFavorites);
    }, (error) => {
      console.error('Error loading favorites:', error);
    });

    return () => unsubscribe();
  }, [user]);

  const addItem = async (item: Omit<Item, 'id' | 'createdAt' | 'userName' | 'userEmail'>): Promise<void> => {
    if (!user) {
      throw new Error('User must be logged in to add items');
    }
    try {
      const itemData = {
        title: item.title,
        description: item.description || '',
        location: item.location,
        date: item.date,
        category: item.category || null,
        imageUri: item.imageUri || null,
        userId: user.id,
        userName: user.name || '',
        userEmail: user.email || '',
        status: item.status || 'pending',
        createdAt: Timestamp.now(),
      };
      
      console.log('Adding item to Firestore with data:', {
        ...itemData,
        createdAt: 'Timestamp.now()'
      });
      
      const docRef = await addDoc(collection(db, 'items'), itemData);
      console.log('Item added successfully with ID:', docRef.id);
    } catch (error: any) {
      console.error('Error adding item to Firestore:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      // Provide more specific error messages
      if (error.code === 'permission-denied') {
        throw new Error('Permission denied. Please check your Firestore security rules or ensure you are logged in.');
      } else if (error.code === 'unavailable') {
        throw new Error('Firestore is unavailable. Please check your internet connection.');
      } else if (error.message) {
        throw new Error(`Failed to add item: ${error.message}`);
      } else {
        throw new Error('Failed to add item. Please try again.');
      }
    }
  };

  const editItem = async (updated: Item): Promise<void> => {
    if (!user) {
      throw new Error('User must be logged in to edit items');
    }
    // Check if user owns the item
    if (updated.userId !== user.id) {
      throw new Error('You can only edit your own items');
    }
    try {
      const { id, createdAt, userId, userName, userEmail, ...itemData } = updated;
      await updateDoc(doc(db, 'items', id), itemData);
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  };

  const deleteItem = async (id: string): Promise<void> => {
    if (!user) {
      throw new Error('User must be logged in to delete items');
    }
    // Find the item to check ownership
    const item = items.find(i => i.id === id);
    if (!item) {
      throw new Error('Item not found');
    }
    if (item.userId !== user.id) {
      throw new Error('You can only delete your own items');
    }
    try {
      await deleteDoc(doc(db, 'items', id));
      // Also delete any favorites for this item
      const favoritesQuery = query(
        collection(db, 'favorites'),
        where('itemId', '==', id)
      );
      const snapshot = await getDocs(favoritesQuery);
      snapshot.forEach(async (favDoc) => {
        await deleteDoc(favDoc.ref);
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  };

  const toggleFavorite = async (id: string): Promise<void> => {
    if (!user) return;

    try {
      const { getDocs, where } = await import('firebase/firestore');
      const favoritesQuery = query(
        collection(db, 'favorites'),
        where('userId', '==', user.id),
        where('itemId', '==', id)
      );
      const snapshot = await getDocs(favoritesQuery);
      
      if (!snapshot.empty) {
        // Remove favorite
        snapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
      } else {
        // Add favorite
        await addDoc(collection(db, 'favorites'), {
          userId: user.id,
          itemId: id,
          createdAt: Timestamp.now(),
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const isFavorite = (id: string) => favorites.includes(id);

  const isOwner = (item: Item): boolean => {
    return user?.id === item.userId;
  };

  const updateItemStatus = async (id: string, status: 'pending' | 'found'): Promise<void> => {
    if (!user) {
      throw new Error('User must be logged in');
    }
    const item = items.find(i => i.id === id);
    if (!item || item.userId !== user.id) {
      throw new Error('You can only update your own items');
    }
    try {
      await updateDoc(doc(db, 'items', id), { status });
    } catch (error) {
      console.error('Error updating item status:', error);
      throw error;
    }
  };

  const getMyItems = (): Item[] => {
    if (!user) return [];
    return items.filter(item => item.userId === user.id);
  };

  return (
    <ItemContext.Provider value={{ 
      items, 
      favorites, 
      addItem, 
      editItem, 
      deleteItem, 
      toggleFavorite, 
      isFavorite,
      isOwner,
      updateItemStatus,
      getMyItems,
      isLoading 
    }}>
      {children}
    </ItemContext.Provider>
  );
};

export const useItems = () => useContext(ItemContext);
