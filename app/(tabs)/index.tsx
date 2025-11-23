import { View, FlatList, Text } from 'react-native';
import ItemCard from '../../components/ItemCard';

export default function Home() {
  const data = [
    { id: '1', title: 'Lost iPhone', location: 'Library', date: '2025-11-23' },
    { id: '2', title: 'Lost Laptop', location: 'Cafeteria', date: '2025-11-22' },
  ];

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ItemCard item={item} />}
      />
    </View>
  );
}
