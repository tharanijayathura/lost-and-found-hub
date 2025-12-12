import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomButton from '../../components/CustomButton';
import InputField from '../../components/InputField';
import { storage } from '../../config/firebase';
import { useAuth } from '../../constants/context/AuthContext';
import { useItems } from '../../constants/context/ItemContext';
import { useTheme } from '../../constants/ThemeContext';
import { handleError } from '../../utils/errorHandler';
import { compressImage } from '../../utils/imageUtils';
import { validateItemDescription, validateItemLocation, validateItemTitle } from '../../utils/validation';

const categories = ['Electronics', 'Personal Items', 'Clothing', 'Books', 'Accessories', 'Other'];

export default function AddItem() {
  const { addItem } = useItems();
  const { colors } = useTheme();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('');
  const [imageUri, setImageUri] = useState<string | undefined>();
  const [imageUrl, setImageUrl] = useState<string>('');
  const [useUrl, setUseUrl] = useState(false);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const styles = createStyles(colors);

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

  const uploadImage = async (uri: string): Promise<string | undefined> => {
    try {
      console.log('Starting image upload...', uri);
      
      // For React Native, we need to use a different approach
      // Convert the local file URI to a blob that Firebase can use
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }
      
      const blob = await response.blob();
      console.log('Blob created, size:', blob.size);
      
      const filename = `items/${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
      const storageRef = ref(storage, filename);
      
      console.log('Uploading to Firebase Storage...', filename);
      await uploadBytes(storageRef, blob);
      console.log('Upload complete, getting download URL...');
      
      const downloadURL = await getDownloadURL(storageRef);
      console.log('Download URL:', downloadURL);
      
      return downloadURL;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      console.error('Error details:', {
        code: error?.code,
        message: error?.message,
        stack: error?.stack
      });
      
      // More specific error messages
      if (error?.code === 'storage/unauthorized') {
        throw new Error('Storage permission denied. Please check Firebase Storage rules.');
      } else if (error?.code === 'storage/canceled') {
        throw new Error('Upload was canceled.');
      } else if (error?.code === 'storage/unknown') {
        throw new Error('Unknown storage error. Please check your internet connection.');
      }
      
      throw error;
    }
  };

  const handleAdd = async () => {
    // Check if user is authenticated
    if (!user) {
      Alert.alert('Authentication Required', 'Please log in to add items.');
      return;
    }

    console.log('User authenticated:', user.id, user.name);

    // Validate fields
    const titleValidation = validateItemTitle(title);
    const locationValidation = validateItemLocation(location);
    const descriptionValidation = validateItemDescription(description || '');

    if (!titleValidation.isValid) {
      Alert.alert('Validation Error', titleValidation.error);
      return;
    }

    if (!locationValidation.isValid) {
      Alert.alert('Validation Error', locationValidation.error);
      return;
    }

    if (!descriptionValidation.isValid) {
      Alert.alert('Validation Error', descriptionValidation.error);
      return;
    }

    setUploading(true);
    try {
      let finalImageUrl: string | undefined = undefined;

      if (useUrl) {
        // User provided image URL
        if (imageUrl.trim()) {
          // Validate URL format
          try {
            const url = new URL(imageUrl.trim());
            // Check if it's http or https
            if (url.protocol !== 'http:' && url.protocol !== 'https:') {
              throw new Error('URL must start with http:// or https://');
            }
            finalImageUrl = imageUrl.trim();
            console.log('Using image URL:', finalImageUrl);
          } catch (error: any) {
            Alert.alert('Invalid URL', error.message || 'Please enter a valid image URL (e.g., https://example.com/image.jpg)');
            setUploading(false);
            return;
          }
        } else {
          // No URL provided, that's okay - item can be added without image
          finalImageUrl = undefined;
        }
      } else if (imageUri) {
        // User selected image from device
        if (imageUri.startsWith('http')) {
          // Already a URL
          finalImageUrl = imageUri;
        } else {
          // Local file - try to upload to Firebase Storage
          try {
            console.log('Compressing image...');
            const compressedUri = await compressImage(imageUri);
            console.log('Image compressed, uploading...');
            
            const uploadedUrl = await uploadImage(compressedUri);
            if (uploadedUrl) {
              finalImageUrl = uploadedUrl;
              console.log('Image uploaded successfully:', uploadedUrl);
            } else {
              // Upload failed, ask user if they want to continue without image
              Alert.alert(
                'Image Upload Failed', 
                'Failed to upload image. You can add an image URL instead, or continue without an image.',
                [
                  {
                    text: 'Continue Without Image',
                    style: 'cancel',
                    onPress: () => {
                      finalImageUrl = undefined;
                    }
                  },
                  {
                    text: 'Cancel',
                    onPress: () => {
                      setUploading(false);
                      return;
                    }
                  }
                ]
              );
              if (!finalImageUrl) {
                setUploading(false);
                return;
              }
            }
          } catch (uploadError: any) {
            console.error('Image upload failed:', uploadError);
            Alert.alert(
              'Image Upload Failed', 
              'Firebase Storage is not available. You can:\n\n1. Use an image URL instead\n2. Continue without an image',
              [
                {
                  text: 'Use URL Instead',
                  onPress: () => {
                    setUseUrl(true);
                    setUploading(false);
                  }
                },
                {
                  text: 'Continue Without Image',
                  style: 'cancel',
                  onPress: () => {
                    finalImageUrl = undefined;
                  }
                },
                {
                  text: 'Cancel',
                  onPress: () => {
                    setUploading(false);
                    return;
                  }
                }
              ]
            );
            setUploading(false);
            return;
          }
        }
      }

      console.log('Adding item to Firestore...', {
        title: title.trim(),
        location: location.trim(),
        date,
        category: category || undefined,
        imageUri: finalImageUrl,
        hasImage: !!finalImageUrl
      });

      // Add item to Firestore
      await addItem({ 
        title: title.trim(), 
        description: description.trim(), 
        location: location.trim(), 
        date, 
        category: category || undefined, 
        imageUri: finalImageUrl,
        status: 'pending'
      });

      console.log('Item added successfully!');
      setUploading(false);

      // Navigate to home screen immediately
      router.replace('/home');
      
      // Show success message after a short delay to ensure navigation happens
      setTimeout(() => {
        Alert.alert('Success', 'Item added successfully!');
      }, 300);
    } catch (error: any) {
      console.error('Error adding item:', error);
      setUploading(false);
      const errorMessage = handleError(error, 'AddItem');
      console.error('Error message:', errorMessage);
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Add Lost Item</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <Ionicons name="close" size={28} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.imageSection}>
          <View style={styles.imageOptionTabs}>
            <TouchableOpacity
              onPress={() => {
                setUseUrl(false);
                setImageUrl('');
              }}
              style={[styles.tab, !useUrl && styles.tabActive]}
            >
              <Ionicons name="image-outline" size={20} color={!useUrl ? colors.white : colors.text} />
              <Text style={[styles.tabText, !useUrl && styles.tabTextActive]}>From Device</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setUseUrl(true);
                setImageUri(undefined);
              }}
              style={[styles.tab, useUrl && styles.tabActive]}
            >
              <Ionicons name="link-outline" size={20} color={useUrl ? colors.white : colors.text} />
              <Text style={[styles.tabText, useUrl && styles.tabTextActive]}>Image URL</Text>
            </TouchableOpacity>
          </View>

          {!useUrl ? (
            <TouchableOpacity onPress={pickImage} style={styles.imagePicker} disabled={uploading}>
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
                editable={!uploading}
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
          editable={!uploading}
        />

        <InputField
          label="Description"
          placeholder="Describe the item in detail..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          editable={!uploading}
        />

        <InputField
          label="Location *"
          placeholder="e.g., Main Library - 2nd Floor"
          value={location}
          onChangeText={setLocation}
          editable={!uploading}
        />

        <View style={styles.categorySection}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => !uploading && setCategory(cat)}
                disabled={uploading}
                style={[
                  styles.categoryChip,
                  category === cat && styles.categoryChipActive,
                  uploading && styles.disabled
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
          editable={!uploading}
        />

        {uploading && (
          <View style={styles.uploadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.uploadingText}>Uploading image...</Text>
          </View>
        )}

        <CustomButton
          title={uploading ? "Adding..." : "Add Item"}
          onPress={handleAdd}
          disabled={!title || !location || uploading}
          loading={uploading}
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
    borderColor: colors.border,
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
  disabled: {
    opacity: 0.5,
  },
  uploadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  uploadingText: {
    marginTop: 10,
    fontSize: 14,
    color: colors.textLight,
  },
});
