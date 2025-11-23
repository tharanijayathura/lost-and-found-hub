import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';

export default function AddItem() {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');

  const handleAdd = () => {
    console.log({ title, location, date });
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Add Lost Item</Text>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={{ borderWidth: 1, padding: 10, marginBottom: 15, borderRadius: 8 }} />
      <TextInput placeholder="Location" value={location} onChangeText={setLocation} style={{ borderWidth: 1, padding: 10, marginBottom: 15, borderRadius: 8 }} />
      <TextInput placeholder="Date" value={date} onChangeText={setDate} style={{ borderWidth: 1, padding: 10, marginBottom: 15, borderRadius: 8 }} />
      <TouchableOpacity onPress={handleAdd} style={{ backgroundColor: '#6200ee', padding: 15, borderRadius: 8 }}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>Add Item</Text>
      </TouchableOpacity>
    </View>
  );
}
