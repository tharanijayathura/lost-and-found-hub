import { createContext, useState, ReactNode, useContext } from 'react';
import uuid from 'react-native-uuid';

interface Item {
  id: string;
  title: string;
  location: string;
  date: string;
}

interface ItemContextProps {
  items: Item[];
  addItem: (item: Omit<Item, 'id'>) => void;
  editItem: (item: Item) => void;
  deleteItem: (id: string) => void;
}

const ItemContext = createContext<ItemContextProps>({} as ItemContextProps);

export const ItemProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Item[]>([
    { id: '1', title: 'Lost iPhone', location: 'Library', date: '2025-11-23' },
    { id: '2', title: 'Lost Laptop', location: 'Cafeteria', date: '2025-11-22' },
  ]);

  const addItem = (item: Omit<Item, 'id'>) => {
    setItems(prev => [{ id: uuid.v4().toString(), ...item }, ...prev]);
  };

  const editItem = (updated: Item) => {
    setItems(prev => prev.map(i => i.id === updated.id ? updated : i));
  };

  const deleteItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

  return (
    <ItemContext.Provider value={{ items, addItem, editItem, deleteItem }}>
      {children}
    </ItemContext.Provider>
  );
};

export const useItems = () => useContext(ItemContext);
