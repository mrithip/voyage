import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const TabsLayout = () => {
    const Header = (title: string) => (
        <Text style={styles.headerText}>
            {title}
        </Text>
    );

    return (
        
        <Tabs
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#3b82f6',
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 1,
                    borderBottomColor: '#f0f0f0',
                },
                headerTitleAlign: "center",
                tabBarStyle: {
                    backgroundColor: '#ffffff',
                    borderTopWidth: 1,
                    borderTopColor: '#f0f0f0',
                    height: 60,
                    paddingBottom: 0,
                },
                tabBarActiveTintColor: "#3b82f6",
                tabBarInactiveTintColor: "#64748b",
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                    marginBottom: 5,
                },
                tabBarItemStyle: {
                    paddingVertical: 5,
                },
            }} 
        >
            {/* <StatusBar style="dark" /> */}
            <Tabs.Screen 
                name="index" 
                options={{
                    headerTitle: () => Header("My Voyage"),
                    title: "Explore",
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialIcons 
                            name="travel-explore" 
                            size={26} 
                            color={color} 
                            style={focused ? styles.activeIcon : {}}
                        />
                    )
                }} 
            />
            <Tabs.Screen 
                name="add" 
                options={{
                    headerTitle: () => Header("New Voyage"),
                    title: "Add",
                    tabBarIcon: ({ color, focused }) => (
                        <View style={styles.addButton}>
                            <MaterialIcons 
                                name="add" 
                                size={28} 
                                color="#ffffff" 
                            />
                        </View>
                    ),
                    tabBarLabel: () => null,
                }} 
            />
            <Tabs.Screen 
                name="settings" 
                options={{
                    headerTitle: () => Header("Settings"),
                    title: "Settings",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons 
                            name="settings" 
                            size={24} 
                            color={color} 
                            style={focused ? styles.activeIcon : {}}
                        />
                    )
                }} 
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    headerText: {
        fontFamily: 'sansation-bold',
        fontSize: 22,
        color: '#1e293b',
        letterSpacing: 0.3,
    },
    activeIcon: {
        transform: [{ scale: 1.1 }],
    },
    addButton: {
        backgroundColor: '#3b82f6',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
});

export default TabsLayout;