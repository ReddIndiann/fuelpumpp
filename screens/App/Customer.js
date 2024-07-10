import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
  FlatList,
  StatusBar,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const Customer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('user');
        const user = JSON.parse(savedUser);
        const userId = user?.id;

        if (!userId) {
          throw new Error('User ID not found');
        }

        const response = await axios.post(
          'https://gcnm.wigal.com.gh/getCustomers',
          {
            agent_id: userId,
          },
          {
            headers: {
              'API-KEY': 'muJFx9F3E5ptBExkz8Fqroa1D79gv9Nv',
            },
          }
        );
        setClients(response.data.data || []);
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleSearch = (text) => {
    setSearchQuery(text);
  };
  const filteredClients = clients.filter((client) =>
    (client.name && client.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (client.phoneNumber && client.phoneNumber.includes(searchQuery))
  );

  const renderClient = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('existingclienttransaction', { client: item })}
    >
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>
          {item.name && item.name.length > 0 ? item.name[0].toUpperCase() : '#'}
        </Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardName}>{item.name || 'Unnamed Client'}</Text>
        <Text style={styles.cardPhone}>{item.phonenumber || 'No phone number'}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#007B5D" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007B5D" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f4f3f3" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Existing Customers</Text>
          <TouchableOpacity style={styles.addClientButton} onPress={() => navigation.navigate('addcustomers')}>
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#a0a0a0" style={styles.searchIcon} />
          <TextInput
            placeholder="Search by name or number"
            value={searchQuery}
            onChangeText={handleSearch}
            style={styles.searchInput}
            placeholderTextColor="#a0a0a0"
          />
        </View>
        <FlatList
          data={filteredClients}
          renderItem={renderClient}
          keyExtractor={(item, index) => index.toString()}
          style={styles.flatList}
          contentContainerStyle={styles.flatListContent}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f3f3',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addClientButton: {
    backgroundColor: '#007B5D',
    padding: 10,
    borderRadius: 50,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 10,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    paddingHorizontal: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007B5D',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardContent: {
    flex: 1,
  },
  cardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cardPhone: {
    fontSize: 14,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f3f3',
  },
});

export default Customer;