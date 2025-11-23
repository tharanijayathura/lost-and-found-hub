import { createContext, useState, ReactNode, useContext } from 'react';
import uuid from 'react-native-uuid';

export interface Item {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  imageUri?: string;
  category?: string;
}

interface ItemContextProps {
  items: Item[];
  favorites: string[];
  addItem: (item: Omit<Item, 'id'>) => void;
  editItem: (item: Item) => void;
  deleteItem: (id: string) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const ItemContext = createContext<ItemContextProps>({} as ItemContextProps);

export const ItemProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [items, setItems] = useState<Item[]>([
    { 
      id: '1', 
      title: 'Lost iPhone 14 Pro', 
      description: 'Black iPhone 14 Pro with a blue case. Last seen in the library near the study area. Please contact if found.',
      location: 'Main Library - 2nd Floor', 
      date: '2025-01-15',
      category: 'Electronics',
      imageUri: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400'
    },
    { 
      id: '2', 
      title: 'Lost MacBook Pro', 
      description: 'Silver MacBook Pro 13" with stickers on the cover. Contains important project files.',
      location: 'Student Center - Cafeteria', 
      date: '2025-01-14',
      category: 'Electronics',
      imageUri: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400'
    },
    { 
      id: '3', 
      title: 'Lost Backpack', 
      description: 'Red Nike backpack with university logo. Contains textbooks and notebooks.',
      location: 'Science Building - Room 201', 
      date: '2025-01-13',
      category: 'Personal Items',
      imageUri: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'
    },
  ]);

  const addItem = (item: Omit<Item, 'id'>) => {
    setItems(prev => [{ id: uuid.v4().toString(), ...item }, ...prev]);
  };

  const editItem = (updated: Item) => {
    setItems(prev => prev.map(i => i.id === updated.id ? updated : i));
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    setFavorites(prev => prev.filter(favId => favId !== id));
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );
  };

  const isFavorite = (id: string) => favorites.includes(id);

  return (
    <ItemContext.Provider value={{ items, favorites, addItem, editItem, deleteItem, toggleFavorite, isFavorite }}>
      {children}
    </ItemContext.Provider>
  );
};

export const useItems = () => useContext(ItemContext);
