import { useAuth } from '@/lib/auth-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
    <LinearGradient
      colors={['#f8fafc', '#e2e8f0']}
      style={styles.gradientContainer}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          {/* Logo/Header Section */}
          <View style={styles.header}>
            <MaterialCommunityIcons 
              name="airplane" 
              size={60} 
              color="#3b82f6" 
            />
            <Text style={styles.title}>
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </Text>
            <Text style={styles.subtitle}>
              {isSignUp ? 'Start your journey with us' : 'Continue your adventure'}
            </Text>
          </View>

          {/* Form Inputs */}
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              label="Email"
              placeholder="example@gmail.com"
              left={<TextInput.Icon icon="email" color="#94a3b8" />}
              mode="outlined"
              autoCapitalize= "none"
              value={email}
              contentStyle={{ color: '#111' }}
              theme={{
                colors: {
                  primary: '#3b82f6',
                  background: '#ffffff',
                  placeholder: '#94a3b8',
                  text: '#1e293b',
                },
                roundness: 12,
              }}
              onChangeText={setEmail}
            />

            <TextInput
              style={styles.input}
              label="Password"
              placeholder="********"
              secureTextEntry
              left={<TextInput.Icon icon="lock" color="#94a3b8" />}
              mode="outlined"
              autoCapitalize= "none"
              value={password}
              contentStyle={{ color: '#111' }}
              theme={{
                colors: {
                  primary: '#3b82f6',
                  background: '#ffffff',
                  placeholder: '#94a3b8',
                  text: '#1e293b',
                },
                roundness: 12,
              }}
              onChangeText={setPassword}
            />

            <LinearGradient
              colors={['#3b82f6', '#2563eb']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Button
                mode="contained"
                onPress={handleAuth}
                style={styles.button}
                labelStyle={styles.buttonText}
                contentStyle={{ height: 50 }}
              >
                {isSignUp ? 'Sign Up' : 'Login'}
              </Button>
            </LinearGradient>
          </View>

          {/* Switch Mode */}
          <TouchableOpacity 
            onPress={handleSwitchMode}
            style={styles.switchContainer}
          >
            <Text style={styles.switchText}>
              {isSignUp
                ? 'Already have an account? '
                : "Don't have an account? "}
              <Text style={styles.switchHighlight}>
                {isSignUp ? 'Login' : 'Sign Up'}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Error Modal */}
        <Modal
          visible={!!error}
          transparent
          animationType="fade"
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <MaterialCommunityIcons 
                name="alert-circle" 
                size={40} 
                color="#ef4444" 
                style={styles.modalIcon}
              />
              <Text style={styles.modalTitle}>Oops!</Text>
              <Text style={styles.modalMessage}>{error}</Text>
              <TouchableOpacity 
                onPress={closeModal} 
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Got It</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 32,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 16,
    fontFamily: 'sansation-bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 8,
  },
  formContainer: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 20,
    backgroundColor: '#ffffff',
  },
  buttonGradient: {
    borderRadius: 12,
    marginTop: 16,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  button: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  switchContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  switchText: {
    color: '#64748b',
    fontSize: 14,
  },
  switchHighlight: {
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    padding: 24,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },
  modalIcon: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1e293b',
  },
  modalMessage: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  modalButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});