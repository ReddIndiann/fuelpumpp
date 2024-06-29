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

const AddClients = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.post('https://gcnm.wigal.com.gh/getCustomers', {
          agent_id: "2",
        });
        console.log('API response:', response.data);
        setClients(response.data.data || []);
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleSearch = (text) => {
    console.log('Search query:', text);
    setSearchQuery(text);
  };

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phoneNumber.includes(searchQuery)
  );

  console.log('Filtered clients:', filteredClients);

  const renderClient = ({ item }) => (
    <TouchableOpacity
      style={styles.tableRow}
      onPress={() => {
        console.log('Navigating to ExistingClientTransaction with client:', item);
        navigation.navigate('existingclienttransaction', { client: item });
      }}
    >
      <Text style={styles.tableRowText}>{item.name}</Text>
      <Text style={styles.tableRowText}>{item.phoneNumber}</Text>
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
          <Text style={styles.title}>Clients</Text>
          <Text style={styles.pageInfo}>
            Lorem ipsum dolor sit amet,
          </Text>
          <View style={styles.headerContainer}>
            <Text style={styles.label}>Existing Clients</Text>
            <TouchableOpacity style={styles.addClientButton} onPress={() => navigation.navigate('addclient')}>
              <Text style={styles.addClientButtonText}>Add New Client</Text>
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
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddClients;

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
    fontSize: 20,
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
    borderWidth: 1,
    borderColor: '#a0a0a0',
    borderRadius: 10,
    overflow: 'hidden',
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
  tableRow: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tableRowText: {
    flex: 1,
    fontSize: 16,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  paginationButton: {
    marginHorizontal: 5,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  activePaginationButton: {
    backgroundColor: '#007B5D',
  },
  paginationButtonText: {
    fontSize: 16,
  },
  activePaginationButtonText: {
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatList: {
    flexGrow: 0,
  },
});
