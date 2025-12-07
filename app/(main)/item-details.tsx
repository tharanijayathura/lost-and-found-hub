import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../../components/CustomButton';
import { useItems } from '../../constants/context/ItemContext';
import { useAuth } from '../../constants/context/AuthContext';
import { useTheme } from '../../constants/ThemeContext';
import * as Linking from 'expo-linking';

export default function ItemDetails() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { items, deleteItem, isOwner, updateItemStatus } = useItems();
  const { user } = useAuth();
  const { colors } = useTheme();
  const itemId = params.itemId as string;
  
  const item = items.find(i => i.id === itemId);
  const styles = createStyles(colors);
  const isItemOwner = item ? isOwner(item) : false;

  const handleDelete = async () => {
    if (!item) return;
    
    if (!isItemOwner) {
      Alert.alert('Permission Denied', 'You can only delete your own items.');
      return;
    }

    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteItem(item.id);
              router.back();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete item');
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    if (!item) return;
    
    if (!isItemOwner) {
      Alert.alert('Permission Denied', 'You can only edit your own items.');
      return;
    }

    router.push({
      pathname: '/edit-item',
      params: { itemId: item.id }
    });
  };

  const handleMarkAsFound = async () => {
    if (!item) return;
    
    if (!isItemOwner) {
      Alert.alert('Permission Denied', 'You can only mark your own items as found.');
      return;
    }

    Alert.alert(
      'Mark as Found',
      'Are you sure you found this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Found',
          onPress: async () => {
            try {
              await updateItemStatus(item.id, 'found');
              Alert.alert('Success', 'Item marked as found!');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to update status');
            }
          },
        },
      ]
    );
  };

  const handleContact = () => {
    if (!item?.userEmail) {
      Alert.alert('No Contact Info', 'Contact information not available for this item.');
      return;
    }

    Alert.alert(
      'Contact Item Owner',
      `Would you like to contact ${item.userName || 'the owner'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Email',
          onPress: () => {
            Linking.openURL(`mailto:${item.userEmail}?subject=Regarding: ${item.title}`);
          },
        },
      ]
    );
  };

  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.gray} />
          <Text style={styles.errorText}>Item not found</Text>
          <CustomButton title="Go Back" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {item.imageUri && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.imageUri }}
              style={styles.image}
              contentFit="cover"
            />
            <LinearGradient
              colors={['transparent', colors.background]}
              style={styles.imageGradient}
            />
          </View>
        )}

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.titleSection}>
              <Text style={styles.title}>{item.title}</Text>
              {item.category && (
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{item.category}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="location" size={20} color={colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>{item.location}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="calendar" size={20} color={colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Date Lost</Text>
                <Text style={styles.infoValue}>{item.date}</Text>
              </View>
            </View>

            {item.userName && (
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Ionicons name="person" size={20} color={colors.primary} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Posted By</Text>
                  <Text style={styles.infoValue}>{item.userName}</Text>
                </View>
              </View>
            )}

            {item.status && (
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Ionicons 
                    name={item.status === 'found' ? "checkmark-circle" : "time"} 
                    size={20} 
                    color={item.status === 'found' ? colors.success : colors.warning} 
                  />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Status</Text>
                  <View style={[
                    styles.statusBadge,
                    item.status === 'found' && styles.statusBadgeFound
                  ]}>
                    <Text style={[
                      styles.statusText,
                      item.status === 'found' && styles.statusTextFound
                    ]}>
                      {item.status === 'found' ? 'Found' : 'Pending'}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          {item.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.descriptionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{item.description}</Text>
            </View>
          )}

          <View style={styles.actions}>
            {isItemOwner ? (
              <>
                {item.status !== 'found' && (
                  <CustomButton
                    title="Mark as Found"
                    onPress={handleMarkAsFound}
                    variant="secondary"
                  />
                )}
                <CustomButton
                  title="Edit Item"
                  onPress={handleEdit}
                  variant="outline"
                />
                <CustomButton
                  title="Delete Item"
                  onPress={handleDelete}
                  variant="danger"
                />
              </>
            ) : (
              <CustomButton
                title="Contact Owner"
                onPress={handleContact}
                variant="primary"
              />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  content: {
    padding: 20,
    marginTop: -20,
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  header: {
    marginBottom: 24,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    marginRight: 12,
  },
  categoryBadge: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    textTransform: 'uppercase',
  },
  infoSection: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 4,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  descriptionSection: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    color: colors.textLight,
    lineHeight: 24,
  },
  actions: {
    gap: 12,
    marginBottom: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: colors.textLight,
    marginTop: 16,
    marginBottom: 24,
  },
  statusBadge: {
    backgroundColor: colors.warning + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusBadgeFound: {
    backgroundColor: colors.success + '20',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.warning,
  },
  statusTextFound: {
    color: colors.success,
  },
});
