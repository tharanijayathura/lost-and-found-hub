import { useRouter } from 'expo-router';
import { FlatList, View } from 'react-native';
import ItemCard from '../../components/ItemCard';
import { useItems } from '../../constants/context/ItemContext';

export default function Home() {
  const { items } = useItems();
  const router = useRouter();

  return (
    <View style={{ flex: 1, padding: 15, backgroundColor: '#f5f5f5' }}>
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ItemCard item={item} onPress={() => router.push({ pathname: '/item-details', params: { item: JSON.stringify(item) } })} />
        )}
      />
    </View>
  );
}
