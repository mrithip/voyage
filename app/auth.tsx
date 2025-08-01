import { useAuth } from '@/lib/auth-context';
import { useRouter } from "expo-router";
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Button, TextInput } from 'react-native-paper';

const AuthScreen = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>('');

  const router = useRouter();

  const {signIn,signUp} = useAuth();

  const handleAuth = async () => {
    if (!email || !password){
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 8){
      setError("Password must be at least 8 characters long.");
      return;
    }

    setError(null);

    if(isSignUp){
      const error = await signUp(email,password);
      if (error){
        setError(error);
        return;
      }
    }else{
      const error = await signIn(email,password);
      if (error){
        setError(error);
        return;
      }
    }

    router.replace("/");
  };
  
  const handleSwitchMode = () => {
    setEmail("");
    setPassword("");
    setIsSignUp((prev) => !prev);
  };

  const closeModal = () => setError(null);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>
          {isSignUp ? 'Create Account' : 'Welcome Back Voyager'}
        </Text>

        <TextInput
          style={styles.input}
          label="Email"
          placeholderTextColor="#888"
          placeholder='example@gmail.com'
          autoCapitalize="none"
          keyboardType="email-address"
          mode='outlined'
          value={email}
          contentStyle={{ color: '#111' }}
          theme={{
            colors: {
              primary: '#111',
              background: '#fff',
            },
          }}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          label="Password"
          placeholderTextColor="#888"
          placeholder='********'
          secureTextEntry
          autoCapitalize="none"
          mode='outlined'
          value={password}
          contentStyle={{ color: '#111' }}
          theme={{
            colors: {
              primary: '#111',
              background: '#fff',
            },
          }}
          onChangeText={setPassword}
        />
        <Button
          style={styles.buttonContainer}
          mode="contained"
          onPress={handleAuth}
        >
          <Text style={styles.buttonText}>{isSignUp ? 'Sign Up' : 'Login'}</Text>
        </Button>

        <TouchableOpacity onPress={handleSwitchMode}>
          <Text style={styles.switchText}>
            {isSignUp
              ? 'Already have an account? Login'
              : "Don't have an account? Sign Up"}
          </Text>
        </TouchableOpacity>
      </View>
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
    </KeyboardAvoidingView>
    
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: "bold",
    color: '#111',
    fontFamily: 'sansation-bold',
    textTransform: 'uppercase',
  },
  input: {
    marginHorizontal: 15,
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: 20,
    marginHorizontal: 90,
    padding: 6,
    borderRadius: 40,
    overflow: 'hidden',
    backgroundColor: '#111',
  },
  switchText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#111',
    textDecorationLine: 'underline',
  },
  buttonText:{
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
