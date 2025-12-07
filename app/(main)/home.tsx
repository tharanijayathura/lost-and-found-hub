import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator, TextInput, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import ItemCard from '../../components/ItemCard';
import { useItems } from '../../constants/context/ItemContext';
import { useAuth } from '../../constants/context/AuthContext';
import { useTheme } from '../../constants/ThemeContext';

export default function Home() {
  const { items, toggleFavorite, isFavorite, isLoading, getMyItems } = useItems();
  const { user } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showMyItemsOnly, setShowMyItemsOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const styles = createStyles(colors);

  const categories = ['Electronics', 'Personal Items', 'Clothing', 'Books', 'Accessories', 'Other'];

  // Filter items based on current filters
  const filteredItems = items.filter(item => {
    // Filter by favorites
    if (showFavoritesOnly && !isFavorite(item.id)) return false;
    
    // Filter by my items
    if (showMyItemsOnly && item.userId !== user?.id) return false;
    
    // Filter by category
    if (selectedCategory && item.category !== selectedCategory) return false;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = item.title.toLowerCase().includes(query);
      const matchesDescription = item.description?.toLowerCase().includes(query);
      const matchesLocation = item.location.toLowerCase().includes(query);
      if (!matchesTitle && !matchesDescription && !matchesLocation) return false;
    }
    
    // Filter out found items (optional - you can remove this if you want to show found items)
    if (item.status === 'found') return false;
    
    return true;
  });

  const onRefresh = async () => {
    setRefreshing(true);
    // Firestore will automatically update via real-time listener
    setTimeout(() => setRefreshing(false), 1000);
  };

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
              onPress={() => setShowMyItemsOnly(!showMyItemsOnly)}
              style={[
                styles.filterButton,
                showMyItemsOnly && styles.filterButtonActive
              ]}
            >
              <Ionicons
                name="list"
                size={20}
                color={showMyItemsOnly ? colors.white : colors.primary}
              />
            </TouchableOpacity>
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

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search items..."
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color={colors.textLight} />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Filter */}
        {selectedCategory && (
          <View style={styles.categoryFilterContainer}>
            <TouchableOpacity
              onPress={() => setSelectedCategory(null)}
              style={styles.categoryFilterChip}
            >
              <Text style={styles.categoryFilterText}>{selectedCategory}</Text>
              <Ionicons name="close" size={16} color={colors.text} style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
        )}

        {/* Category Pills */}
        <View style={styles.categoriesContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={(cat) => cat}
            renderItem={({ item: cat }) => (
              <TouchableOpacity
                onPress={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                style={[
                  styles.categoryPill,
                  selectedCategory === cat && styles.categoryPillActive
                ]}
              >
                <Text style={[
                  styles.categoryPillText,
                  selectedCategory === cat && styles.categoryPillTextActive
                ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {isLoading ? (
          <View style={styles.emptyState}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.emptyText}>Loading items...</Text>
          </View>
        ) : filteredItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons 
              name={showFavoritesOnly ? "heart-outline" : showMyItemsOnly ? "list-outline" : "search-outline"} 
              size={64} 
              color={colors.gray} 
            />
            <Text style={styles.emptyText}>
              {showFavoritesOnly 
                ? 'No favorite items yet' 
                : showMyItemsOnly 
                ? 'You haven\'t posted any items yet'
                : searchQuery 
                ? 'No items found'
                : 'No lost items yet'}
            </Text>
            <Text style={styles.emptySubtext}>
              {showFavoritesOnly 
                ? 'Tap the heart icon on items to add them to favorites'
                : showMyItemsOnly
                ? 'Tap the + button to add your first item'
                : searchQuery
                ? 'Try a different search term'
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
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary}
              />
            }
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 12,
  },
  clearButton: {
    padding: 4,
  },
  categoryFilterContainer: {
    marginBottom: 12,
  },
  categoryFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  categoryFilterText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesList: {
    paddingRight: 20,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.grayLight,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryPillActive: {
    backgroundColor: colors.primary + '15',
    borderColor: colors.primary,
  },
  categoryPillText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  categoryPillTextActive: {
    color: colors.primary,
    fontWeight: '600',
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
