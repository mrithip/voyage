import { DATABASE_ID, databases, LOGS_COLLECTION_ID } from '@/lib/appwrite';
import { useAuth } from '@/lib/auth-context';
import { Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ID } from 'react-native-appwrite';
import { TextInput } from 'react-native-paper';

const Add = () => {
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [place, setPlace] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>("");
  const {user} = useAuth();
  const router = useRouter();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const isFormComplete = image && title && place && date && notes;

const handleSubmit = async () => {
  if (!user) return;
  try {
    let imageBase64 = '';

    if (image) {
      // Convert image to base64
      const response = await fetch(image);
      const blob = await response.blob();
      imageBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          // Remove the data URL prefix if present
          const result = reader.result as string;
          resolve(result.startsWith('data:') ? result : `data:image/jpeg;base64,${result}`);
        };
        reader.readAsDataURL(blob);
      });
    }

    await databases.createDocument(
      DATABASE_ID,
      LOGS_COLLECTION_ID,
      ID.unique(),
      {
        userid: user.$id,
        imageBase64, // Store the base64 string directly
        title,
        place,
        date,
        notes
      }
    );

    // Reset form
    setImage(null);
    setTitle('');
    setPlace('');
    setDate('');
    setNotes('');
    setError('');
    
    router.replace({
      pathname: '/', // Your index route
      params: { refresh: Date.now() } // Add timestamp to force refresh
    });
  } catch (error) {
    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError("There was an error creating the log.");
    }
  }
};
  const closeModal = () => setError(null);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.imageWrapper} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Ionicons name="image-outline" size={60} color="#aaa" />
        )}
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.removeButton} onPress={pickImage}>
          <Ionicons name="image-outline" size={20} color="#fff" />
          <Text style={styles.removeText}>Pick Image</Text>
        </TouchableOpacity>

        {image && (
          <TouchableOpacity style={styles.removeButton} onPress={removeImage}>
            <Feather name="trash-2" size={20} color="white" />
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>

       <TextInput
        style={styles.input}
        placeholder="Title"
        placeholderTextColor="#888"
        value={title}
        label="Title"
        mode='outlined'
        contentStyle={{ color: '#111' }}
        theme={{
          colors: {
            primary: '#000',
            background: '#fff',
          },
        }}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Place"
        placeholderTextColor="#888"
        value={place}
        label="Place"
        mode='outlined'
        contentStyle={{ color: '#111' }}
        theme={{
          colors: {
            primary: '#000',
            background: '#fff',
          },
        }}
        onChangeText={setPlace}
      />

      <TextInput
        style={styles.input}
        placeholder="Date (e.g., 2025-07-31)"
        placeholderTextColor="#888"
        value={date}
        label="Date"
        mode='outlined'
        contentStyle={{ color: '#111' }}
        theme={{
          colors: {
            primary: '#000',
            background: '#fff',
          },
        }}
        onChangeText={setDate}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Notes"
        placeholderTextColor="#888"
        multiline
        numberOfLines={4}
        value={notes}
        label="Notes"
        mode='outlined'
        contentStyle={{ color: '#111' }}
        theme={{
          colors: {
            primary: '#000',
            background: '#fff',
          },
        }}
        onChangeText={setNotes}
      />

      <TouchableOpacity
        style={[
          styles.submitButton,
          { backgroundColor: isFormComplete ? '#000' : '#ccc' },
        ]}
        onPress={handleSubmit}
        disabled={!isFormComplete}
      >
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
      <Modal
        visible={!!error}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Error</Text>
            <Text style={styles.modalMessage}>{error}</Text>
            <TouchableOpacity onPress={closeModal} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
     </ScrollView>

     
  );
};

export default Add;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 80,
  },
  imageWrapper: {
    width: '100%',
    height: 200,
    maxWidth: 380,
    backgroundColor: '#eee',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    maxWidth: 380,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 15,
  },
  removeText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  input: {
    width: '95%',
    maxWidth: 380,
    // backgroundColor: '#fff',
    // paddingVertical: 10,
    // paddingHorizontal: 15,
    // borderRadius: 10,
    borderColor: '#ccc',
    // borderWidth: 1,
    marginTop: 15,
    fontSize: 18,
    color: '#111',
    // marginHorizontal: 15,
    marginBottom: 5,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: 25,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 30,
    alignItems: 'center',
    elevation: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#111',
  },
  modalMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
