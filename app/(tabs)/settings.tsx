import { useAuth } from '@/lib/auth-context';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-paper';

const Settings = () => {
  const { signOut } = useAuth();
  return (
    <Button
      style={styles.buttonContainer}
      mode="contained"
      onPress={signOut}
      icon={"logout"}
    >
      <Text style={styles.buttonText}>Logout</Text>
    </Button>
  )
};

export default Settings;

const styles = StyleSheet.create({
    buttonContainer: {
    marginTop: 20,
    marginHorizontal: 90,
    padding: 6,
    borderRadius: 40,
    overflow: 'hidden',
    backgroundColor: '#111',
  },
    buttonText:{
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
