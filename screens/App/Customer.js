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
  Platform,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phoneNumber.includes(searchQuery)
  );

  const renderClient = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('existingclienttransaction', { client: item })}
    >
      <Text style={styles.cardText}>{item.name}</Text>
      <Text style={styles.cardText}>{item.phonenumber}</Text>
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
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      
          <Text style={styles.pageInfo}>

          </Text>
          <View style={styles.headerContainer}>
            <Text style={styles.label}>Existing Customers</Text>
            <TouchableOpacity style={styles.addClientButton} onPress={() => navigation.navigate('addcustomers')}>
              <Text style={styles.addClientButtonText}>Add New Customers</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            placeholder="Search by name or number"
            value={searchQuery}
            onChangeText={handleSearch}
            style={styles.searchInput}
            placeholderTextColor="#a0a0a0"
          />
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Name</Text>
              <Text style={styles.tableHeaderText}>Phone Number</Text>
            </View>
            <FlatList
              data={filteredClients}
              renderItem={renderClient}
              keyExtractor={(item, index) => index.toString()}
              style={styles.flatList}
              contentContainerStyle={styles.flatListContent}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Customer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 30,
    marginBottom: 10,
  },
  pageInfo: {
    fontSize: 20,
    marginBottom: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 17,
  },
  addClientButton: {
    backgroundColor: '#007B5D',
    padding: 10,
    borderRadius: 5,
  },
  addClientButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  searchInput: {
    height: 50,
    borderColor: '#a0a0a0',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 15,
    marginBottom: 20,
  },
  tableContainer: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 15,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardText: {
    flex: 1,
    fontSize: 16,
  },
  flatList: {
    flexGrow: 0,
  },
  flatListContent: {
    paddingBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
