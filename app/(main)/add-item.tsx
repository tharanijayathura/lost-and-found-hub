import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../../components/CustomButton';
import InputField from '../../components/InputField';
import { useItems } from '../../constants/context/ItemContext';
import Colors from '../../constants/Colors';

const categories = ['Electronics', 'Personal Items', 'Clothing', 'Books', 'Accessories', 'Other'];

export default function AddItem() {
  const { addItem } = useItems();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('');
  const [imageUri, setImageUri] = useState<string | undefined>();
  const router = useRouter();

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

  const handleAdd = () => {
    if (!title || !location) {
      Alert.alert('Required Fields', 'Please fill in title and location.');
      return;
    }

    addItem({ title, description, location, date, category, imageUri });
    Alert.alert('Success', 'Item added successfully!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Add Lost Item</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <Ionicons name="close" size={28} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} contentFit="cover" />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera-outline" size={48} color={Colors.gray} />
              <Text style={styles.imagePlaceholderText}>Tap to add photo</Text>
            </View>
          )}
          <View style={styles.imageOverlay}>
            <Ionicons name="camera" size={24} color={Colors.white} />
          </View>
        </TouchableOpacity>

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
          title="Add Item"
          onPress={handleAdd}
          disabled={!title || !location}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    color: Colors.text,
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
    backgroundColor: Colors.grayLight,
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
    backgroundColor: Colors.grayLight,
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.gray,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: Colors.primary,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.shadow,
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
    color: Colors.text,
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
    backgroundColor: Colors.grayLight,
    borderWidth: 1.5,
    borderColor: Colors.grayLight,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary + '15',
    borderColor: Colors.primary,
  },
  categoryChipText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
});
