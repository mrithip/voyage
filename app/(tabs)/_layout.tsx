import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';

const TabsLayout = () => {
    const Header = (title: string) => (
    <Text style={{
        fontFamily: 'sansation-bold',
        fontSize: 25,
        color: '#111',
        textAlign: 'center'
        }}>
        {title}
    </Text>
  );

  return (
    <Tabs
        screenOptions={{
            headerStyle:{backgroundColor:"#f5f5f5"},
            headerShadowVisible:false,
            headerTitleAlign:"center",
            tabBarStyle:{
                backgroundColor:"#f5f5f5",
                borderTopWidth:0,
                elevation:0,
                shadowOpacity:0,
            },
            tabBarActiveTintColor:"#f5f5f5",
            tabBarActiveBackgroundColor:"#111",
            tabBarInactiveTintColor:"#111",
        }} >
        <Tabs.Screen name="index" options={{
            headerTitle: () => Header("My Voyage"),
            title:"My voyage",
            tabBarIcon:({color}) => (
                <MaterialIcons name="travel-explore" size={24} color={color} />
            )
        }} />
        <Tabs.Screen name="add" options={{
            headerTitle: () => Header("New Voyage"),
            title:"New Voyage",
            tabBarIcon:({color})=>(
                <MaterialIcons name="add-circle" size={24} color={color} />
            )
        }} />
        <Tabs.Screen name="settings" options={{
            headerTitle: () => Header("Settings"),
            title:"Settings",
            tabBarIcon:({color})=>(
                <Ionicons name="settings" size={24} color={color} />
            )
        }} />

    </Tabs>
  )
}

export default TabsLayout
