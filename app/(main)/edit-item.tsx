import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../../components/CustomButton';
import InputField from '../../components/InputField';
import { useItems } from '../../constants/context/ItemContext';
import { Item } from '../../constants/context/ItemContext';
import { useAuth } from '../../constants/context/AuthContext';
import { useTheme } from '../../constants/ThemeContext';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../config/firebase';

const categories = ['Electronics', 'Personal Items', 'Clothing', 'Books', 'Accessories', 'Other'];

export default function EditItem() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { items, editItem, isOwner } = useItems();
  const { user } = useAuth();
  const { colors } = useTheme();
  const itemId = params.itemId as string;
  
  const item = items.find(i => i.id === itemId);
  const styles = createStyles(colors);
  
  const [title, setTitle] = useState(item?.title || '');
  const [description, setDescription] = useState(item?.description || '');
  const [location, setLocation] = useState(item?.location || '');
  const [date, setDate] = useState(item?.date || '');
  const [category, setCategory] = useState(item?.category || '');
  const [imageUri, setImageUri] = useState<string | undefined>(item?.imageUri);
  const [imageUrl, setImageUrl] = useState<string>(item?.imageUri?.startsWith('http') ? item.imageUri : '');
  const [useUrl, setUseUrl] = useState(item?.imageUri?.startsWith('http') || false);

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setDescription(item.description || '');
      setLocation(item.location);
      setDate(item.date);
      setCategory(item.category || '');
      setImageUri(item.imageUri);
      if (item.imageUri?.startsWith('http')) {
        setImageUrl(item.imageUri);
        setUseUrl(true);
      } else {
        setImageUrl('');
        setUseUrl(false);
      }
    }
  }, [item]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to add images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  useEffect(() => {
    if (item && !isOwner(item)) {
      Alert.alert('Permission Denied', 'You can only edit your own items.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }
  }, [item]);

  const uploadImage = async (uri: string): Promise<string | undefined> => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = `items/${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
      const storageRef = ref(storage, filename);
      
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image. Please try again.');
      return undefined;
    }
  };

  const handleEdit = async () => {
    if (!title || !location) {
      Alert.alert('Required Fields', 'Please fill in title and location.');
      return;
    }

    if (!item) return;

    if (!isOwner(item)) {
      Alert.alert('Permission Denied', 'You can only edit your own items.');
      return;
    }

    try {
      let finalImageUrl: string | undefined = undefined;

      if (useUrl) {
        // User provided image URL
        if (imageUrl.trim()) {
          try {
            new URL(imageUrl.trim());
            finalImageUrl = imageUrl.trim();
          } catch {
            Alert.alert('Invalid URL', 'Please enter a valid image URL (e.g., https://example.com/image.jpg)');
            return;
          }
        }
      } else if (imageUri) {
        // User selected image from device
        if (imageUri.startsWith('http')) {
          // Already a URL
          finalImageUrl = imageUri;
        } else if (imageUri !== item.imageUri) {
          // New local file - try to upload
          try {
            const uploadedUrl = await uploadImage(imageUri);
            if (uploadedUrl) {
              finalImageUrl = uploadedUrl;
            } else {
              Alert.alert(
                'Image Upload Failed',
                'Failed to upload image. You can use an image URL instead.',
                [
                  {
                    text: 'Use URL Instead',
                    onPress: () => {
                      setUseUrl(true);
                    }
                  },
                  {
                    text: 'Keep Current Image',
                    style: 'cancel',
                    onPress: () => {
                      finalImageUrl = item.imageUri;
                    }
                  }
                ]
              );
              return;
            }
          } catch (uploadError: any) {
            Alert.alert(
              'Image Upload Failed',
              'Firebase Storage is not available. Please use an image URL instead.',
              [
                {
                  text: 'Use URL Instead',
                  onPress: () => {
                    setUseUrl(true);
                  }
                },
                {
                  text: 'Keep Current Image',
                  style: 'cancel',
                  onPress: () => {
                    finalImageUrl = item.imageUri;
                  }
                }
              ]
            );
            return;
          }
        } else {
          // Same image, keep it
          finalImageUrl = item.imageUri;
        }
      } else {
        // No image
        finalImageUrl = undefined;
      }

      const updatedItem: Item = {
        ...item,
        title,
        description,
        location,
        date,
        category: category || undefined,
        imageUri: finalImageUrl,
      };

      await editItem(updatedItem);
      Alert.alert('Success', 'Item updated successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update item. Please try again.');
    }
  };

  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Item not found</Text>
          <CustomButton title="Go Back" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  if (!isOwner(item)) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="lock-closed" size={64} color={colors.error} />
          <Text style={styles.errorText}>You can only edit your own items</Text>
          <CustomButton title="Go Back" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Edit Item</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <Ionicons name="close" size={28} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.imageSection}>
          <View style={styles.imageOptionTabs}>
            <TouchableOpacity
              onPress={() => {
                setUseUrl(false);
                if (item?.imageUri && !item.imageUri.startsWith('http')) {
                  setImageUri(item.imageUri);
                }
              }}
              style={[styles.tab, !useUrl && styles.tabActive]}
            >
              <Ionicons name="image-outline" size={20} color={!useUrl ? colors.white : colors.text} />
              <Text style={[styles.tabText, !useUrl && styles.tabTextActive]}>From Device</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setUseUrl(true);
                if (item?.imageUri?.startsWith('http')) {
                  setImageUrl(item.imageUri);
                }
              }}
              style={[styles.tab, useUrl && styles.tabActive]}
            >
              <Ionicons name="link-outline" size={20} color={useUrl ? colors.white : colors.text} />
              <Text style={[styles.tabText, useUrl && styles.tabTextActive]}>Image URL</Text>
            </TouchableOpacity>
          </View>

          {!useUrl ? (
            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.image} contentFit="cover" />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="camera-outline" size={48} color={colors.gray} />
                  <Text style={styles.imagePlaceholderText}>Tap to add photo</Text>
                </View>
              )}
              <View style={styles.imageOverlay}>
                <Ionicons name="camera" size={24} color={colors.white} />
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.urlInputContainer}>
              <InputField
                label="Image URL"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChangeText={setImageUrl}
                keyboardType="url"
                autoCapitalize="none"
              />
              {imageUrl && (
                <View style={styles.urlPreview}>
                  <Image 
                    source={{ uri: imageUrl }} 
                    style={styles.urlPreviewImage} 
                    contentFit="cover"
                    onError={() => {
                      // Image failed to load, but that's okay
                    }}
                  />
                  <Text style={styles.urlPreviewText}>Preview</Text>
                </View>
              )}
            </View>
          )}
        </View>

        <InputField
          label="Item Title *"
          placeholder="e.g., Lost iPhone 14 Pro"
          value={title}
          onChangeText={setTitle}
        />

        <InputField
          label="Description"
          placeholder="Describe the item in detail..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        <InputField
          label="Location *"
          placeholder="e.g., Main Library - 2nd Floor"
          value={location}
          onChangeText={setLocation}
        />

        <View style={styles.categorySection}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setCategory(cat)}
                style={[
                  styles.categoryChip,
                  category === cat && styles.categoryChipActive
                ]}
              >
                <Text style={[
                  styles.categoryChipText,
                  category === cat && styles.categoryChipTextActive
                ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <InputField
          label="Date Lost"
          placeholder="YYYY-MM-DD"
          value={date}
          onChangeText={setDate}
        />

        <CustomButton
          title="Save Changes"
          onPress={handleEdit}
          disabled={!title || !location}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  imagePicker: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
    backgroundColor: colors.grayLight,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.grayLight,
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.gray,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: colors.primary,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  categorySection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.grayLight,
    borderWidth: 1.5,
    borderColor: colors.grayLight,
  },
  categoryChipActive: {
    backgroundColor: colors.primary + '15',
    borderColor: colors.primary,
  },
  categoryChipText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: colors.primary,
    fontWeight: '600',
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
    marginBottom: 20,
  },
  imageSection: {
    marginBottom: 24,
  },
  imageOptionTabs: {
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: colors.grayLight,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  tabTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  urlInputContainer: {
    marginBottom: 0,
  },
  urlPreview: {
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  urlPreviewImage: {
    width: '100%',
    height: 200,
    backgroundColor: colors.grayLight,
  },
  urlPreviewText: {
    padding: 8,
    textAlign: 'center',
    fontSize: 12,
    color: colors.textLight,
    backgroundColor: colors.grayLight,
  },
});
