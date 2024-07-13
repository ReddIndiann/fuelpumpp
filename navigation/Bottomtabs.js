import React, { useState, useEffect, useCallback } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import Home from '../screens/App/Home';
import RecordList from '../screens/App/RecordList';
import StockProductList from '../screens/App/StockProductList';
import Customers from '../screens/App/Customer';

const Tab = createBottomTabNavigator();

const AppTabs = () => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const [location, setLocation] = useState('');
  const [greeting, setGreeting] = useState('');

  const fetchUserData = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        setUserName(user.Name);
        setLocation(user.location);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
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

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let label;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
            label = 'Home';
          } else if (route.name === 'RecordList') {
            iconName = focused ? 'document-text' : 'document-text-outline';
            label = 'Records';
          } else if (route.name === 'StockProductList') {
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
        component={HomeScreen}
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
              <Text style={{ color: "black", fontSize: 15 }}>
                {greeting}!
              </Text>
              <Text style={{ fontSize: 20 }}>
                {userName}
              </Text>
              <Text style={{ fontSize: 16 }}>
              {location}
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
            backgroundColor: '#E0E0E0',
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
      
      <Tab.Screen name="StockProductList" component={StockProductListScreen} />

      <Tab.Screen name="RecordList" component={RecordListScreen} />
     
      <Tab.Screen 
        name="Customers" 
        component={CustomersScreen} 
        options={{ headerShown: false }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate('Customers');
          },
        })}
      />
      
    </Tab.Navigator>
  );
};

const HomeScreen = () => {
  useFocusEffect(
    useCallback(() => {
      console.log('Home Screen is focused');
      return () => {
        console.log('Home Screen is unfocused');
      };
    }, [])
  );
  return <Home />;
};

const StockProductListScreen = () => {
  useFocusEffect(
    useCallback(() => {
      console.log('StockProductList Screen is focused');
      return () => {
        console.log('StockProductList Screen is unfocused');
      };
    }, [])
  );
  return <StockProductList />;
};

const RecordListScreen = () => {
  useFocusEffect(
    useCallback(() => {
      console.log('RecordList Screen is focused');
      return () => {
        console.log('RecordList Screen is unfocused');
      };
    }, [])
  );
  return <RecordList />;
};

const CustomersScreen = () => {
  useFocusEffect(
    useCallback(() => {
      console.log('Customers Screen is focused');
      return () => {
        console.log('Customers Screen is unfocused');
      };
    }, [])
  );
  return <Customers />;
};

export default AppTabs;
