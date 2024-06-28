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
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

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


const ExistingClientTransaction = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage] = useState(5);
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
          <Text style={styles.title}>Existing Client Transactions</Text>
          
          {/* Client Information Card */}
          <View style={styles.clientCard}>
            <View style={styles.clientCardHeader}>
              <Icon name="person" size={40} color="#fff" style={styles.clientIcon} />
              <View>
                <Text style={styles.clientName}>Brielle Williamson</Text>
                <Text style={styles.clientPhone}>0204027337</Text>
                <Text style={styles.clientAmount}>$35,078</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButtonBlue} onPress={()=>navigateToScreen('dispensefuel')} >
              <Icon name="local-gas-station" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>Dispense Fuel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButtonYellow}  onPress={()=>navigateToScreen('addfunds')}>
              <Icon name="attach-money" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>Add Funds</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButtonGreen}  onPress={()=>navigateToScreen('redrawfund')}>
              <Icon name="remove-circle" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>Withdraw Funds</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButtonRed}  onPress={()=>navigateToScreen('Main')}>
              <Icon name="close" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>Close Account</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Transactions</Text>
          <TextInput
            placeholder="Search"
            value={searchQuery}
            onChangeText={handleSearch}
            style={styles.searchInput}
            placeholderTextColor="#a0a0a0"
          />
          
          {/* Transactions Table */}
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Name</Text>
              <Text style={styles.tableHeaderText}>Amount</Text>
            </View>
            {currentClients.map((client, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableRowText}>{client.name}</Text>
                <Text style={styles.tableRowText}>{client.phoneNumber}</Text>
              </View>
            ))}
          </View>
          
          {/* Pagination */}
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

export default ExistingClientTransaction;

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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  clientCard: {
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 20,
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
  },
  clientCardHeader: {
    flexDirection: 'row',
    borderRadius: 20,
    alignItems: 'center',
  },
  clientIcon: {
    backgroundColor: '#4680FF',
    borderRadius: 20,
    paddingHorizontal: 30,
    paddingVertical: 40,
    marginRight: 15,
  },
  clientName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  clientPhone: {
    fontSize: 16,
    color: '#777',
  },
  clientAmount: {
    fontSize: 18,
    color: '#007B5D',
    marginTop: 5,
  },
  actionsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButtonBlue: {
    flexDirection: 'column',
    backgroundColor: '#4680FF',
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  actionButtonYellow: {
    flexDirection: 'column',
    backgroundColor: '#FFC107',
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  actionButtonGreen: {
    flexDirection: 'column',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  actionButtonRed: {
    flexDirection: 'column',
    backgroundColor: '#F44336',
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 5,
  },
  label: {
    fontSize: 20,
    marginBottom: 10,
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
});
