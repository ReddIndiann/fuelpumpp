import React, { useState, useEffect, useCallback, useContext } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import AuthContext from '../hooks/useAuthContext';
import Home from '../screens/App/Home';
import RecordList from '../screens/App/RecordList';
import StockProductList from '../screens/App/StockProductList';
import Customers from '../screens/App/Customer';

const Tab = createBottomTabNavigator();

const AppTabs = () => {
  const { logout } = useContext(AuthContext);
  const navigation = useNavigation();
  const [userData, setUserData] = useState({ name: '', location: '' });
  const [greeting, setGreeting] = useState('');

  const fetchUserData = useCallback(async () => {
    try {
      const savedUser = await AsyncStorage.getItem('user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        setUserData({ name: user.Name, location: user.location });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, []);

  useEffect(() => {
    const getCurrentGreeting = () => {
      const currentHour = new Date().getHours();
      setGreeting(
        currentHour < 12 ? 'Good Morning' :
        currentHour < 18 ? 'Good Afternoon' : 'Good Evening'
      );
    };

    getCurrentGreeting();
    fetchUserData();
  }, [fetchUserData]);

  const handleLogout = async () => {
    try {
      const response = await axios.post('https://gcnm.wigal.com.gh/apilogout', {}, {
        headers: { 'API-KEY': 'muJFx9F3E5ptBExkz8Fqroa1D79gv9Nv' },
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

  const confirmLogout = () => {
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
    }, [fetchUserData])
  );

  const Header = () => (
    <LinearGradient
      colors={['#007B5D', '#00A86B']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.header}
    >
      <View style={styles.headerContent}>
        <TouchableOpacity onPress={() => navigation.navigate('profile')} style={styles.logoutButton}>
          <Ionicons name="person-outline" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.greetingText}>{greeting}!</Text>
          <Text style={styles.nameText}>{userData.name}</Text>
          <Text style={styles.locationText}>{userData.location}</Text>
        </View>
        <TouchableOpacity onPress={confirmLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  const screenOptions = ({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;
      if (route.name === 'Home') {
        iconName = focused ? 'home' : 'home-outline';
      } else if (route.name === 'RecordList') {
        iconName = focused ? 'document-text' : 'document-text-outline';
      } else if (route.name === 'StockProductList') {
        iconName = focused ? 'cube' : 'cube-outline';
      } else if (route.name === 'Customers') {
        iconName = focused ? 'people' : 'people-outline';
      }

      return (
        <View style={styles.tabIconContainer}>
          <Ionicons name={iconName} size={size} color={color} />
          <Text style={[styles.tabLabel, { color }]}>{route.name}</Text>
        </View>
      );
    },
    tabBarActiveTintColor: '#007B5D',
    tabBarInactiveTintColor: 'gray',
    tabBarStyle: styles.tabBar,
    tabBarShowLabel: false,
  });

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen 
        name="Home" 
        component={Home}
        options={{ header: Header }}
      />
      <Tab.Screen name="StockProductList" component={StockProductList} options={{ headerShown: false }} />
      <Tab.Screen name="RecordList" component={RecordList} options={{ headerShown: false }} />
      <Tab.Screen name="Customers" component={Customers} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 120,
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'white',
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  greetingText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  nameText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  locationText: {
    color: 'white',
    fontSize: 14,
  },
  logoutButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    position: 'absolute',
    height: 70,
    borderTopWidth: 0,
    elevation: 0,
    backgroundColor: '#ffffff',
    paddingBottom: 10,
  },
  tabIconContainer: {
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default AppTabs;
