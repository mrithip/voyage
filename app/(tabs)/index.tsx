import { DATABASE_ID, databases, LOGS_COLLECTION_ID } from '@/lib/appwrite';
import { useAuth } from '@/lib/auth-context';
import { Logs } from '@/types/database.type';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Query } from 'react-native-appwrite';

// Color palette
const COLORS = {
  primary: '#4361ee',
  secondary: '#3a0ca3',
  accent: '#f72585',
  success: '#4cc9f0',
  warning: '#f8961e',
  danger: '#ef233c',
  light: '#f8f9fa',
  dark: '#212529',
  text: '#2b2d42',
  muted: '#6c757d',
  cardGradients: [
    ['#ff9a9e', '#fad0c4'] as [string, string],
    ['#a1c4fd', '#c2e9fb'] as [string, string],
    ['#ffecd2', '#fcb69f'] as [string, string],
    ['#84fab0', '#8fd3f4'] as [string, string],
    ['#a6c1ee', '#fbc2eb'] as [string, string]
  ]
};

export default function Index() {
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const [logs, setLogs] = useState<(Logs & { imageError?: boolean })[]>([]);

  useEffect(() => {
    if (user) fetchLogs();
  }, [user, params.refresh]);

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

  const handleDelete = async (logId: string) => {
    Alert.alert(
      "Delete Log",
      "Are you sure you want to delete this log?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: async () => {
            try {
              await databases.deleteDocument(
                DATABASE_ID,
                LOGS_COLLECTION_ID,
                logId
              );
              setLogs(prevLogs => prevLogs.filter(log => log.$id !== logId));
            } catch (error) {
              Alert.alert("Error", "Failed to delete log. Please try again.");
            }
          } 
        }
      ]
    );
  };

  const getRandomCardColor = () => {
    return COLORS.cardGradients[Math.floor(Math.random() * COLORS.cardGradients.length)];
  };
   if (logs.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <LinearGradient
          colors={['#f3f4f6', '#e5e7eb']}
          style={styles.emptyGradient}
        >
          <MaterialIcons name="photo-album" size={80} color="#9ca3af" />
          <Text style={styles.emptyTitle}>No Memories Yet</Text>
          <Text style={styles.emptyText}>
            You haven't created any travel memories yet.
          </Text>
          <Text style={styles.emptyText}>
            Start documenting your adventures!
          </Text>
          
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => router.push('/add')}
          >
            <MaterialIcons name="add" size={24} color="white" />
            <Text style={styles.createButtonText}>Create First Memory</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }
  return (
    <LinearGradient
      colors={['#e2e2e2', '#c9d6ff']}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {logs.map((log, index) => {
          const cardColors = getRandomCardColor();
          return (
            <View key={index} style={styles.cardContainer}>
              <LinearGradient
                colors={cardColors}
                style={styles.card}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {/* Image Section */}
                {log.imageBase64 && !log.imageError && (
                  <View style={styles.imageContainer}>
                    <Image 
                      source={{ uri: log.imageBase64 }}
                      style={styles.image}
                      resizeMode="cover"
                    />
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => handleDelete(log.$id)}
                    >
                      <Feather name="trash-2" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                )}
                
                {/* Content Section */}
                <View style={styles.content}>
                  <View style={styles.header}>
                    <Text style={styles.title}>{log.title}</Text>
                    <View style={styles.location}>
                      <MaterialIcons name="location-on" size={18} color={COLORS.danger} />
                      <Text style={styles.place}>{log.place}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.details}>
                    <View style={styles.detailItem}>
                      <MaterialIcons name="date-range" size={18} color={COLORS.primary} />
                      <Text style={styles.detailText}>{log.date}</Text>
                    </View>
                  </View>
                  
                  {log.notes && (
                    <View style={styles.notesContainer}>
                      <Text style={styles.notesLabel}>
                        <MaterialIcons name="notes" size={16} color={COLORS.warning} /> Notes:
                      </Text>
                      <Text style={styles.notes}>{log.notes}</Text>
                    </View>
                  )}
                </View>
              </LinearGradient>
            </View>
          );
        })}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    padding: 15,
    paddingBottom: 30,
  },
  cardContainer: {
    marginBottom: 25,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 250,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  deleteButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(239, 35, 60, 0.9)',
    padding: 10,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 15,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 8,
    fontFamily: 'sansation-bold',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    marginTop:5,

  },
  place: {
    fontSize: 20,
    color: COLORS.dark,
    marginLeft: 8,
    fontWeight: '800',
  },
  details: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 25,
  },
  detailText: {
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 8,
    fontWeight: '500',
  },
  notesContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.3)',
    paddingTop: 10,
    marginTop: 10,
  },
  notesLabel: {
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    fontSize: 16,
  },
  notes: {
    color: COLORS.text,
    lineHeight: 22,
    fontSize: 18,
    marginLeft:18
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  emptyGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 5,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginTop: 30,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  createButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 10,
  },
});