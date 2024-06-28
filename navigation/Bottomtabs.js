import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, View, StyleSheet, Animated, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/App/Home';
import Record from '../screens/App/Records';
import Supply from '../screens/App/Supply';
import AddClients from '../screens/App/Clients';
import Transactions from '../screens/App/Transactions';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import ProductSupply from '../screens/App/Productsupply';
import StockRecords from '../screens/App/StockRecords';
import Clients from '../screens/App/AddClient';
import ExistingClientTransaction from '../screens/App/ExistingClientTransaction';

import { useNavigateToScreen } from '../hooks/useNavigateToScreen';

const Tab = createBottomTabNavigator();

const AppTabs = () => {
  const navigation = useNavigation();
  const navToProfile = () => {
    navigation.navigate('profile');
  };
  const navToNotification = () => {
    navigation.navigate('profile');
  };
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let label;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
            label = 'Home';
          } else if (route.name === 'Record') {
            iconName = focused ? 'document-text' : 'document-text-outline';
            label = 'Records';
          } else if (route.name === 'Supply') {
            iconName = focused ? 'cube' : 'cube-outline';
            label = 'Supply';
          } else if (route.name === 'Client') {
            iconName = focused ? 'people' : 'people-outline';
            label = 'Clients';
          } else if (route.name === 'Transactions') {
            iconName = focused ? 'swap-horizontal' : 'swap-horizontal-outline';
            label = 'Transactions';
          }

          return (
            <View style={{ alignItems: 'center' }}>
              <Ionicons name={iconName} size={size} color={color} />
              <Text style={{ color, fontSize: 12 }}>{label}</Text>
            </View>
          );
        },
        tabBarActiveTintColor: 'dodgerblue',
        tabBarInactiveTintColor: 'gray',
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          height: 70,
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: '#ffffff',
          paddingBottom: 10,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={Home}
        options={{
          headerTransparent: false,
          headerLeft: () => (
            <View style={{ marginLeft: 10 }}>
               <TouchableOpacity onPress={navToProfile} style={{ marginRight: 20, backgroundColor: "#F5F5F5", width: 50, height: 50, borderRadius: 30, justifyContent: "center", alignItems: "center" }}>
              <Ionicons name="person-outline" size={24} color="black" />
            </TouchableOpacity>
             
            </View>
          ),
          headerTitle: () => (
            <View style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: 'center', justifyContent: "center" }}>
              <Text style={{ color: "#c0c0c0" }}>
                Good Morning!
              </Text>
              <Text style={{ fontSize: 18 }}>
                C Muthu Krishnan
              </Text>
            </View>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={navToNotification} style={{ marginRight: 20, backgroundColor: "#F5F5F5", width: 50, height: 50, borderRadius: 7, justifyContent: "center", alignItems: "center" }}>
              <Ionicons name="notifications-outline" size={24} color="black" />
            </TouchableOpacity>
          ),
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#FCFCFC',
            height: 100,
          },
          headerTitleStyle: {
            fontSize: 15,
            color: '#333',
          },
          headerRightContainerStyle: {
            marginLeft: "2%"
          }
        }}
      />
    
      <Tab.Screen name="Supply" component={ProductSupply} />

      <Tab.Screen name="Record" component={StockRecords} />
     
      <Tab.Screen name="Client" component={AddClients} />
      <Tab.Screen name="Transactions" component={ExistingClientTransaction} />
     
    </Tab.Navigator>
  );
};
export default AppTabs;
