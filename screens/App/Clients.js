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
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigateToScreen } from '../../hooks/useNavigateToScreen';

const clients = [
  { name: 'Airi Satou', phoneNumber: '0204027337' },
  { name: 'Ashton Cox', phoneNumber: '0204027337' },
  { name: 'Bradley Greer', phoneNumber: '0204027337' },
  { name: 'Brielle Williamson', phoneNumber: '0204027337' },
  { name: 'Cedric Kelly', phoneNumber: '0204027337' },
  { name: 'Dai Rios', phoneNumber: '0204027337' },
  // Add more clients as needed
];

const AddClients = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage] = useState(6);
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const navigateToScreen = useNavigateToScreen();
  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phoneNumber.includes(searchQuery)
  );

  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Clients</Text>
          <Text style={styles.pageInfo}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
          </Text>
          <View style={styles.headerContainer}>
            <Text style={styles.label}>Existing Clients</Text>
            <TouchableOpacity style={styles.addClientButton}>
              <Text style={styles.addClientButtonText}  onPress={()=>navigateToScreen('addclient')}>Add New Client</Text>
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
            {currentClients.map((client, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableRowText}>{client.name}</Text>
                <Text style={styles.tableRowText}>{client.phoneNumber}</Text>
              </View>
            ))}
          </View>
          <View style={styles.paginationContainer}>
            {Array.from({ length: Math.ceil(filteredClients.length / clientsPerPage) }, (_, i) => i + 1).map((page) => (
              <TouchableOpacity
                key={page}
                style={[styles.paginationButton, currentPage === page && styles.activePaginationButton]}
                onPress={() => handlePageChange(page)}
              >
                <Text style={[styles.paginationButtonText, currentPage === page && styles.activePaginationButtonText]}>{page}</Text>
              </TouchableOpacity>
            ))}
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
    padding: 15, // Increase padding to increase height
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 15, // Increase padding to increase height
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
});





