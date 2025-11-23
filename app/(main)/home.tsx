import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import ItemCard from '../../components/ItemCard';
import { useItems } from '../../constants/context/ItemContext';
import { useAuth } from '../../constants/context/AuthContext';
import { useTheme } from '../../constants/ThemeContext';

export default function Home() {
  const { items, toggleFavorite, isFavorite } = useItems();
  const { user } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const styles = createStyles(colors);

  const filteredItems = showFavoritesOnly
    ? items.filter(item => isFavorite(item.id))
    : items;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Welcome back!</Text>
            <Text style={styles.userName}>{user?.name || 'Student'}</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/profile')}
            style={styles.profileButton}
          >
            <Ionicons name="person-circle" size={40} color={colors.white} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Lost Items</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => setShowFavoritesOnly(!showFavoritesOnly)}
              style={[
                styles.filterButton,
                showFavoritesOnly && styles.filterButtonActive
              ]}
            >
              <Ionicons
                name={showFavoritesOnly ? "heart" : "heart-outline"}
                size={20}
                color={showFavoritesOnly ? colors.white : colors.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/add-item')}
              style={styles.addButton}
            >
              <Ionicons name="add-circle" size={28} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {filteredItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons 
              name={showFavoritesOnly ? "heart-outline" : "search-outline"} 
              size={64} 
              color={colors.gray} 
            />
            <Text style={styles.emptyText}>
              {showFavoritesOnly ? 'No favorite items yet' : 'No lost items yet'}
            </Text>
            <Text style={styles.emptySubtext}>
              {showFavoritesOnly 
                ? 'Tap the heart icon on items to add them to favorites'
                : 'Tap the + button to add your first item'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredItems}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <ItemCard
                item={item}
                isFavorite={isFavorite(item.id)}
                onPress={() => router.push({
                  pathname: '/item-details',
                  params: { itemId: item.id }
                })}
                onFavoritePress={() => toggleFavorite(item.id)}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: colors.white + 'CC',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
  },
  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.white + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  addButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
