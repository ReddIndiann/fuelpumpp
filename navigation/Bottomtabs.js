import React, { useContext } from 'react';
import { TouchableOpacity, View, StyleSheet, Animated, Text, Alert } from 'react-native';
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
import AuthContext from '../hooks/useAuthContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();

const AppTabs = () => {
  const { logout } = useContext(AuthContext); // Use the logout function from context
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      const response = await axios.post('https://gcnm.wigal.com.gh/apilogout', {}, {
        headers: {
          'API-KEY': 'muJFx9F3E5ptBExkz8Fqroa1D79gv9Nv',
        },
      });

      if (response.status === 200) {
        await AsyncStorage.clear();
        logout();
        Alert.alert('Success', 'Logged out successfully!', [
          { text: 'OK', onPress: () => navigation.navigate('AuthStack') },
        ]);
      } else {
        Alert.alert('Error', 'Failed to log out. Please try again.');
      }
    } catch (error) {
      console.error('Error logging out:', error.response || error.message || error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  const navToNotification = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: handleLogout },
      ],
      { cancelable: false }
    );
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
              <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={{ marginRight: 20, backgroundColor: "#F5F5F5", width: 50, height: 50, borderRadius: 30, justifyContent: "center", alignItems: "center" }}>
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
              <Ionicons name="log-out-outline" size={24} color="black" />
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
      
    </Tab.Navigator>
  );
};

export default AppTabs;
