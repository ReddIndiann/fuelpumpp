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
  import Icon from 'react-native-vector-icons/MaterialIcons';
  import RNPickerSelect from 'react-native-picker-select';
  const clients = [
    { name: 'Airi Satou', phoneNumber: '0204027337' },
    { name: 'Ashton Cox', phoneNumber: '0204027337' },
    { name: 'Bradley Greer', phoneNumber: '0204027337' },
    { name: 'Brielle Williamson', phoneNumber: '0204027337' },
    { name: 'Cedric Kelly', phoneNumber: '0204027337' },
    { name: 'Dai Rios', phoneNumber: '0204027337' },
    // Add more clients as needed
  ];
  
  const AddFunds = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [password, setPassword] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [clientsPerPage] = useState(5);
    const { width } = useWindowDimensions();
    const isTablet = width >= 768;
  
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
            <Text style={styles.title}>Add Funds</Text>
            
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
  
            <Text style={styles.title}>Add Funds</Text>
           
            <Text style={styles.label}>Enter Amount</Text>
            
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="enter amount"
               
                onChangeText={(text) => setPassword(text)}
                style={[styles.inputt, { flex: 1, borderColor: '#FFFFFF' }]}
                
                placeholderTextColor="#a0a0a0"
              />
  
            </View>
            <Text style={styles.label}>Select Payment Method</Text>
            
            <View style={styles.inputContainer}>
            <RNPickerSelect
              onValueChange={(value) => setProductType(value)}
              items={[
                { label: 'Product 1', value: 'product1' },
                { label: 'Product 2', value: 'product2' },
              ]}
              style={pickerSelectStyles}
              placeholder={{ label: 'Select your product type', value: null }}
            />
            <TouchableOpacity>
              <Icon size={24} color="#a0a0a0" />
            </TouchableOpacity>
          </View>
          
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button]}
           
             
              >
                <Text style={styles.signInText}>Dispense</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button1]}
                onPress={() => navigateToScreen('onBoard')}
              >
                <Text style={styles.signUpText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  };
  
  export default AddFunds;
  
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
      fontSize: 18,
      fontWeight: '300',
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
    button: {
      width: 330,
      height: 50,
     
      backgroundColor: '#FAAD14',
     
      justifyContent: 'center',
      borderRadius: 10,
      marginRight: 20,
      alignItems: 'center',
    },
    buttonDisabled: {
      backgroundColor: '#a0a0a0',
      borderColor: '#a0a0a0',
    },  signInText: {
      color: '#FFFFFF',
      fontSize: 17,
    },
    signUpText: {
      fontSize: 17,
      color:"#DC2626"
    },
    button1: {
      width: 330,
      height: 50,
      borderColor: '#DC2626',
      justifyContent: 'center',
      marginTop: 10,
      borderRadius: 10,
      borderWidth: 1,
      alignItems: 'center',
      backgroundColor: '#F0F2F5',
    },
    clientIcon: {
      backgroundColor: '#4680FF',
      borderRadius: 20,
   paddingHorizontal:30,
   paddingVertical:40,
      marginRight: 15,
    },
    clientName: {
      fontSize: 25,
      fontWeight: '300',
    },
    clientPhone: {
      fontSize: 18,
      fontWeight:"bold",
    },
    clientAmount: {
      fontSize: 25,
      fontWeight:"bold",
      marginTop: 5,
    },
    actionsContainer: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    actionButtonBlue: {
      flex: 1,
      backgroundColor: '#007B5D',
      paddingHorizontal: 10,
      paddingVertical:25,
      borderRadius: 20,
      marginBottom:10,
      marginRight: 5,
      alignItems: 'center',
    
    },
    actionButtonYellow: {
      flex: 1,
      backgroundColor: '#FFC107',
      paddingHorizontal: 10,
      paddingVertical:25,
      borderRadius: 20,
      marginBottom:10,
      marginRight: 5,
      alignItems: 'center',
    },
    actionButtonOrange: {
      flex: 1,
      backgroundColor: '#FF9800',
      paddingHorizontal: 10,
      paddingVertical:25,
      borderRadius: 20,
      marginBottom:10,
      marginRight: 5,
      alignItems: 'center',
    },
    actionButtonRed: {
      flex: 1,
      backgroundColor: '#F44336',
      paddingHorizontal: 10,
      paddingVertical:25,
      borderRadius: 20,
      marginBottom:10,
      alignItems: 'center',
    },
    actionButtonText: {
      color: '#fff',
      fontSize: 14,
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
    pageinfo: {
        fontSize: 20,
        alignSelf: 'flex-start',
        marginLeft: 20,
      }, inputContainer: {
          width: '100%',
          height: 50,
          borderRadius: 10,
          fontSize: 18,
          paddingLeft: 15,
          marginVertical: 10,
          borderWidth: 1,
          borderColor: '#a0a0a0',
        },
      input: {
        width: '90%',
        height: 50,
        borderRadius: 10,
        fontSize: 18,
        paddingLeft: 15,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#a0a0a0',
      },
      inputt: {
        width: '90%',
        height: 45,
        borderRadius: 10,
        fontSize: 18,
        paddingLeft: 15,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#a0a0a0',
      },
      passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 50,
        borderRadius: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#a0a0a0',
        paddingHorizontal: 1,
      },
      buttonContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginVertical: 20,
        marginTop: 150,
      },
  });
  
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 18,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'white',
    borderColor: '#fff',
  },
  inputAndroid: {
    fontSize: 18,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'white',
    borderColor: '#fff',
  },
});
