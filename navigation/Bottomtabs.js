import React, { useContext, useState, useEffect } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/App/Home';
import Record from '../screens/App/Records';
import Supply from '../screens/App/Supply';
import Customers from '../screens/App/Customer';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import ProductSupply from '../screens/App/Productsupply';
import StockRecords from '../screens/App/StockRecords';
import Clients from '../screens/App/AddCustomers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import AuthContext from '../hooks/useAuthContext';
const Tab = createBottomTabNavigator();

const AppTabs = () => {
  const { logout } = useContext(AuthContext); // Assuming AuthContext provides logout functionality
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // Fetch user information from AsyncStorage or context
    const fetchUserData = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('user');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          setUserName(user.Name); // Assuming user object has a 'name' property
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    // Update greeting based on current time
    const getCurrentGreeting = () => {
      const currentHour = new Date().getHours();
      if (currentHour < 12) {
        setGreeting('Good Morning');
      } else if (currentHour < 18) {
        setGreeting('Good Afternoon');
      } else {
        setGreeting('Good Evening');
      }
    };

    getCurrentGreeting();
  }, []);

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
          } else if (route.name === 'Customers') {
            iconName = focused ? 'people' : 'people-outline';
            label = 'Customers';
          }

          return (
            <View style={{ alignItems: 'center' }}>
              <Ionicons name={iconName} size={size} color={color} />
              <Text style={{ color, fontSize: 12 }}>{label}</Text>
            </View>
          );
        },
        tabBarActiveTintColor: '#007B5D',
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
              <TouchableOpacity onPress={() => navigation.navigate('profile')} style={{ marginRight: 20, backgroundColor: "#F5F5F5", width: 50, height: 50, borderRadius: 30, justifyContent: "center", alignItems: "center" }}>
                <Ionicons name="person-outline" size={24} color="black" />
              </TouchableOpacity>
            </View>
          ),
          headerTitle: () => (
            <View style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: 'center', justifyContent: "center" }}>
              <Text style={{ color: "black",fontSize: 15  }}>
                {greeting}!
              </Text>
              <Text style={{ fontSize: 20 }}>
                {userName}
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
     
      <Tab.Screen name="Customers" component={Customers} options={{ headerShown: false }} />
      
    </Tab.Navigator>
  );
};

export default AppTabs;
