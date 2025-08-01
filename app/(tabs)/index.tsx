import { DATABASE_ID, databases, LOGS_COLLECTION_ID } from '@/lib/appwrite';
import { useAuth } from '@/lib/auth-context';
import { Logs } from '@/types/database.type';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Query } from 'react-native-appwrite';

// index.tsx
export default function Index() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<(Logs & { imageError?: boolean })[]>([]);

  useEffect(() => {
    if (user) fetchLogs();
  }, [user, (router as any).params?.refresh]);

  const fetchLogs = async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        LOGS_COLLECTION_ID,
        [Query.equal("userid", user?.$id ?? "")]
      );

      setLogs(response.documents as unknown as (Logs & { imageError?: boolean })[]);
    } catch (error) {
      console.error("Error fetching logs: ", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {logs.map((log, index) => (
        <View key={index} style={styles.card}>
          {log.imageBase64 && !log.imageError && (
            <Image 
              source={{ uri: log.imageBase64 }}
              style={styles.image}
              resizeMode="cover"
              onError={() => {
                setLogs(prevLogs => 
                  prevLogs.map((prevLog, prevIndex) => 
                    prevIndex === index ? { ...prevLog, imageError: true } : prevLog
                  )
                );
              }}
            />
          )}
          {log.imageBase64 && log.imageError && (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <Text style={styles.placeholderText}>Image failed to load</Text>
            </View>
          )}
          <Text style={styles.title}>{log.title}</Text>
          <Text>{log.place}</Text>
          <Text>{log.date}</Text>
          <Text>{log.notes}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: 'sansation-bold',
    marginBottom: 6,
  },
  imagePlaceholder: {
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666',
    fontSize: 14,
  },
});
