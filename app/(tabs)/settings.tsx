import { DATABASE_ID, databases, LOGS_COLLECTION_ID } from '@/lib/appwrite';
import { useAuth } from '@/lib/auth-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Query } from "react-native-appwrite";
import { Button, Card, Divider } from 'react-native-paper';

const Settings = () => {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDeleteAllLogs = async () => {
    Alert.alert(
      "Delete All Logs",
      "Are you sure you want to permanently delete all your logs?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete All", 
          onPress: async () => {
            try {
              setDeleteLoading(true);
              // First get all logs for the user
              const response = await databases.listDocuments(
                DATABASE_ID,
                LOGS_COLLECTION_ID,
                [Query.equal("userid", user?.$id ?? "")]
              );
              
              // Delete each log
              const deletePromises = response.documents.map(doc => 
                databases.deleteDocument(DATABASE_ID, LOGS_COLLECTION_ID, doc.$id)
              );
              
              await Promise.all(deletePromises);
              Alert.alert("Success", "All your logs have been deleted");
                    router.push({
                      pathname: '/',
                      params: { refresh: Date.now().toString() }
                    });
            } catch (error) {
              console.error("Error deleting logs:", error);
              Alert.alert("Error", "Failed to delete logs. Please try again.");
            } finally {
              setDeleteLoading(false);
            }
          } 
        }
      ]
    );
  };

  const handleExportData = async () => {
    setLoading(true);
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        LOGS_COLLECTION_ID,
        [Query.equal("userid", user?.$id ?? "")]
      );
      
      // Convert to JSON string
      const dataStr = JSON.stringify(response.documents, null, 2);
      
      // In a real app, you would save this to a file or share it
      Alert.alert(
        "Export Successful", 
        "Your data has been prepared for export. In a real app, this would save to your device.",
        [{ text: "OK" }]
      );
      
      console.log("Export data:", dataStr); 
// For debugging
    } catch (error) {
      console.error("Export failed:", error);
      Alert.alert("Error", "Failed to export data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

    const showPrivacyPolicy = () => {
    Alert.alert(
      "Privacy Policy",
      `Last Updated: ${new Date().toLocaleDateString()}\n\n` +
      "1. Information We Collect\n" +
      "We collect basic user information and app usage data to improve our services. This includes:\n" +
      "- Email address\n" +
      "- App activity logs\n" +
      "- Device information\n\n" +
      "2. How We Use Your Information\n" +
      "Your data helps us:\n" +
      "- Provide and maintain our service\n" +
      "- Improve user experience\n" +
      "- Communicate with you\n\n" +
      "3. Data Security\n" +
      "We implement industry-standard security measures to protect your information.\n\n" +
      "4. Third-Party Services\n" +
      "We use Appwrite for data storage and authentication. Review their privacy policies.\n\n" +
      "5. Your Rights\n" +
      "You may request access or deletion of your data through the app settings.",
      [{ text: "I Understand" }]
    );
  };

  const showTermsOfService = () => {
    Alert.alert(
      "Terms of Service",
      `Effective Date: ${new Date().toLocaleDateString()}\n\n` +
      "1. Acceptance of Terms\n" +
      "By using this app, you agree to these terms. If you disagree, please discontinue use.\n\n" +
      "2. User Responsibilities\n" +
      "You agree to:\n" +
      "- Use the app lawfully\n" +
      "- Not engage in harmful activities\n" +
      "- Maintain account security\n\n" +
      "3. Content Ownership\n" +
      "You retain rights to your data. We only store it to provide our services.\n\n" +
      "4. Limitation of Liability\n" +
      "We're not liable for:\n" +
      "- Service interruptions\n" +
      "- Data loss\n" +
      "- Third-party actions\n\n" +
      "5. Changes to Terms\n" +
      "We may update these terms periodically. Continued use constitutes acceptance.",
      [{ text: "I Agree" }]
    );
  };

  return (
  <LinearGradient
    colors={['#f8fafc', '#e2e8f0']}
    style={{ flex: 1 }}
  >
    <ScrollView  contentContainerStyle={styles.scrollContainer}
     showsVerticalScrollIndicator={false}
      bounces={true}
      >
      {/* User Profile Card with Gradient Border */}
      <LinearGradient
        colors={['#4361ee', '#3a0ca3']}
        style={styles.userGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.userCardInner}>
          <Card.Content>
            <View style={styles.userInfo}>
              <MaterialCommunityIcons 
                name="account-circle" 
                size={50} 
                color="#4361ee" 
              />
              <View>
                <Text style={{ 
                  fontSize: 16, 
                  color: '#6c757d',
                  marginBottom: 2,
                  marginLeft:15
                }}>Logged in as</Text>
                <Text style={styles.emailText}>{user?.email}</Text>
              </View>
            </View>
          </Card.Content>
        </View>
      </LinearGradient>

      <Divider style={styles.divider} />

      {/* Account Actions Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Account Actions</Text>
          
          <Button
            mode="contained"
            onPress={handleExportData}
            style={styles.button}
            icon="download"
            loading={loading}
            disabled={loading}
            labelStyle={{ fontWeight: '600', letterSpacing: 0.3 }}
            contentStyle={{ height: 48 }}
          >
            {loading ? 'Preparing Export...' : 'Export My Data'}
          </Button>

          <LinearGradient
            colors={['#ff4757', '#ff6b81']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.button, { borderRadius: 12 }]}
          >
            <Button
              mode="contained"
              onPress={handleDeleteAllLogs}
              style={{ backgroundColor: 'transparent' }}
              icon={deleteLoading ? undefined : "delete"}
              loading={deleteLoading}
              disabled={deleteLoading}
              labelStyle={{ color: '#fff', fontWeight: '600' }}
              contentStyle={{ height: 48 }}
            >
              {deleteLoading ? 'Deleting...' : 'Delete All Logs'}
            </Button>
          </LinearGradient>

          <Button
            mode="contained"
            onPress={signOut}
            style={[styles.button, styles.logoutButton]}
            icon="logout"
            labelStyle={{ fontWeight: '600' }}
            contentStyle={{ height: 48 }}
          >
            Sign Out
          </Button>
        </Card.Content>
      </Card>

      <Divider style={styles.divider} />

      {/* App Information Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>App Information</Text>
          
          <TouchableOpacity style={styles.infoRow} >
            <MaterialCommunityIcons name="information" size={24} color="#4361ee" />
            <Text style={styles.infoText}>Version 1.0.0</Text>
            <MaterialCommunityIcons 
              name="chevron-right" 
              size={24} 
              color="#adb5bd" 
              style={{ marginLeft: 'auto' }}
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.infoRow}  onPress={showPrivacyPolicy}>
            <MaterialCommunityIcons name="shield-account" size={24} color="#4361ee" />
            <Text style={styles.infoText}>Privacy Policy</Text>
            <MaterialCommunityIcons 
              name="chevron-right" 
              size={24} 
              color="#adb5bd" 
              style={{ marginLeft: 'auto' }}
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.infoRow, { borderBottomWidth: 0 }]}
          onPress={showTermsOfService}>
            <MaterialCommunityIcons name="file-document" size={24} color="#4361ee" />
            <Text style={styles.infoText}>Terms of Service</Text>
            <MaterialCommunityIcons 
              name="chevron-right" 
              size={24} 
              color="#adb5bd" 
              style={{ marginLeft: 'auto' }}
            />
          </TouchableOpacity>
        </Card.Content>
      </Card>
      <View style={{ height: 30 }} />
    </ScrollView>
  </LinearGradient>
);
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1, // This makes the ScrollView scrollable
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40, // Extra padding at bottom
  },
  container: {
    flex: 1,
    backgroundColor: '#8de9b6ff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    marginBottom: 25,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  emailText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#495057',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#212529',
    paddingHorizontal: 15,
  },
  button: {
    marginVertical: 10,
    borderRadius: 12,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  deleteButton: {
    backgroundColor: '#ff4757',
  },
  logoutButton: {
    backgroundColor: '#6c757d',
  },
  divider: {
    marginVertical: 25,
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  infoText: {
    marginLeft: 15,
    fontSize: 15,
    color: '#495057',
  },
  userGradient: {
    padding: 1,
    borderRadius: 16,
    marginBottom: 25,
  },
  userCardInner: {
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    padding: 0,
  },
});


export default Settings;