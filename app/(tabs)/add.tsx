import { DATABASE_ID, databases, LOGS_COLLECTION_ID } from '@/lib/appwrite';
import { useAuth } from '@/lib/auth-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
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
    
     router.push({
      pathname: '/',
      params: { refresh: Date.now().toString() }
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
  const inputTheme = {
  colors: {
    primary: '#4361ee',
    background: '#fff',
    placeholder: '#adb5bd',
    text: '#000000', // Black text
  },
  roundness: 10,
};

return (
  <LinearGradient 
    colors={['#f8fafc', '#e2e8f0']}
    style={{flex: 1}}
  >
    <ScrollView contentContainerStyle={styles.container}>
      {/* Image Picker */}
      <TouchableOpacity 
        style={styles.imageWrapper} 
        onPress={pickImage}
        activeOpacity={0.8}
      >
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={{alignItems: 'center'}}>
            <Ionicons name="image-outline" size={60} color="#adb5bd" />
            <Text style={{color: '#6c757d', marginTop: 10}}>Tap to add an image</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.removeButton, {backgroundColor: '#3a86ff'}]} 
          onPress={pickImage}
          activeOpacity={0.8}
        >
          <MaterialIcons name="add-photo-alternate" size={20} color="#fff" />
          <Text style={styles.removeText}>Change Image</Text>
        </TouchableOpacity>

        {image && (
          <TouchableOpacity 
            style={[styles.removeButton, {backgroundColor: '#ef233c'}]} 
            onPress={removeImage}
            activeOpacity={0.8}
          >
            <Feather name="trash-2" size={20} color="white" />
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Form Inputs */}
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        label="Title"
        mode='outlined'
        left={<TextInput.Icon icon="format-title" color="#6c757d" />}
        contentStyle={{ color: '#111' }}
        theme={inputTheme}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Place"
        value={place}
        label="Place"
        mode='outlined'
        left={<TextInput.Icon icon="map-marker" color="#6c757d" />}
        contentStyle={{ color: '#111' }}
        theme={inputTheme}
        onChangeText={setPlace}
      />

      <TextInput
        style={styles.input}
        placeholder="Date (e.g., 2025-07-31)"
        value={date}
        label="Date"
        mode='outlined'
        left={<TextInput.Icon icon="calendar" color="#6c757d" />}
        contentStyle={{ color: '#111' }}
        theme={inputTheme}
        onChangeText={setDate}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Notes"
        multiline
        numberOfLines={4}
        value={notes}
        label="Notes"
        mode='outlined'
        left={<TextInput.Icon icon="note-text" color="#6c757d" />}
        contentStyle={{ color: '#111' }}
        theme={inputTheme}
        onChangeText={setNotes}
      />

      {/* Submit Button */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          { 
            backgroundColor: isFormComplete ? '#4361ee' : '#adb5bd',
            shadowColor: isFormComplete ? '#4361ee' : '#adb5bd',
          },
        ]}
        onPress={handleSubmit}
        disabled={!isFormComplete}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={isFormComplete ? ['#4895ef', '#4361ee'] : ['#ced4da', '#adb5bd']}
          style={{
            paddingVertical: 15,
            paddingHorizontal: 50,
            borderRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.submitText}>
            {isFormComplete ? 'Create Memory' : 'Complete All Fields'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Error Modal */}
      <Modal
        visible={!!error}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <MaterialIcons name="error-outline" size={50} color="#ef233c" style={{marginBottom: 15}} />
            <Text style={styles.modalTitle}>Oops!</Text>
            <Text style={styles.modalMessage}>{error}</Text>
            <TouchableOpacity 
              onPress={closeModal} 
              style={styles.modalButton}
              activeOpacity={0.8}
            >
              <Text style={styles.modalButtonText}>Got It</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  </LinearGradient>
);
};
export default Add;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // backgroundColor: '#ade2d5ff',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 50,
  },
  imageWrapper: {
    width: '100%',
    height: 220,
    maxWidth: 380,
    backgroundColor: '#e9ecef',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#dee2e6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    alignItems: 'center',
    width: '100%',
    maxWidth: 380,
    marginBottom: 10,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4361ee',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  removeText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 15,
  },
  input: {
    width: '100%',
    maxWidth: 380,
    marginTop: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#dee2e6',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: 30,
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    padding: 25,
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#212529',
  },
  modalMessage: {
    fontSize: 16,
    color: '#495057',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  modalButton: {
    backgroundColor: '#4361ee',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});