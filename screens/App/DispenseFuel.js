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
  Alert,
} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DispenseFuel = () => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const route = useRoute();
  const { client } = route.params; // Retrieve client data from route parameters

  const [searchQuery, setSearchQuery] = useState('');
  const [password, setPassword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage] = useState(5);
  const [productType, setProductType] = useState('');
  const [productPrice, setProductPrice] = useState(''); // State to store product price
  const [agentId, setAgentId] = useState(null);

  useEffect(() => {
    const fetchAgentId = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('user');
        const user = JSON.parse(savedUser);
        setAgentId(user?.id); // Adjust this based on your user object structure
      } catch (error) {
        console.error('Failed to fetch agent ID:', error);
      }
    };

    fetchAgentId();
  }, []);

  const fetchProductPrice = async (productId) => {
    if (!agentId) {
      Alert.alert('Error', 'Agent ID not found.');
      return;
    }

    const payload = {
      agent_id: '2',
      product_id: productId
    };

    try {
      const response = await axios.post('https://gcnm.wigal.com.gh/getproductprice', payload, {
        headers: {
          'API-KEY': 'muJFx9F3E5ptBExkz8Fqroa1D79gv9Nv','Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.price) {
        setProductPrice(response.data.price);
      } else {
        console.error('Invalid response from server:', response.data);
        Alert.alert('Error', 'Failed to fetch product price.');
      }
    } catch (error) {
      console.error('Failed to fetch product price:', error);
      Alert.alert('Error', 'Failed to fetch product price.');
    }
  };

  const handleProductTypeSelect = (index, value) => {
    setProductType(value);
    // Assuming product IDs are mapped to product types, e.g., "Product 1" -> 47
    const productId = value === 'Product 1' ? '47' : '48'; // Adjust as necessary
    fetchProductPrice(productId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <Text style={styles.title1}>Dispense Fuel</Text>
          
          {/* Client Information Card */}
          <View style={styles.clientCard}>
            <View style={styles.clientCardHeader}>
              <Icon name="person" size={40} color="#fff" style={styles.clientIcon} />
              <View>
                <Text style={styles.clientName}>{client.name}</Text>
                <Text style={styles.clientPhone}>{client.phonenumber}</Text>
                <Text style={styles.clientAmount}>$35,078</Text>
              </View>
            </View>
          </View>

          <Text style={styles.title}>Dispense Fuel</Text>
         
          <Text style={styles.label}>Select Product Type</Text>
          
          <View style={styles.inputContainer}>
            <ModalDropdown
              options={['47', 'Product 2']}
              style={styles.dropdown}
              textStyle={styles.dropdownText}
              dropdownStyle={styles.dropdownMenu}
              onSelect={handleProductTypeSelect}
              defaultValue="Select your product type"
            />
            <TouchableOpacity>
              <Icon size={24} color="#a0a0a0" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.label}>Display Price Per Litre</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Price per litre"
              value={productPrice} // Use fetched price
              editable={false}
              style={[styles.inputt, styles.readOnlyInput, { flex: 1, borderColor: '#FFFFFF' }]}
              placeholderTextColor="#a0a0a0"
              keyboardType='numeric'
            />
            <TouchableOpacity>
              <Icon name='' size={24} color="#a0a0a0" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.label}>Qty (Litres)</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Enter quantity"
              value={password}
              onChangeText={(text) => setPassword(text)}
              style={[styles.inputt, { flex: 1, borderColor: '#FFFFFF' }]}
              keyboardType='numeric'
              placeholderTextColor="#a0a0a0"
            />
            <TouchableOpacity>
              <Icon name='' size={24} color="#a0a0a0" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.label}>Amount (GHS)</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Amount"
              value="52.50" // Set the default value as needed
              editable={false}
              style={[styles.inputt, styles.readOnlyInput, { flex: 1, borderColor: '#FFFFFF' }]}
              placeholderTextColor="#a0a0a0"
              keyboardType='numeric'
            />
            <TouchableOpacity>
              <Icon name='' size={24} color="#a0a0a0" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button]}>
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

export default DispenseFuel;

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
  title1: {
    fontSize: 25,
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
    backgroundColor: '#1890FF',
    justifyContent: 'center',
    borderRadius: 10,
    marginRight: 20,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a0a0a0',
    borderColor: '#a0a0a0',
  },
  signInText: {
    color: '#FFFFFF',
    fontSize: 17,
  },
  signUpText: {
    fontSize: 17,
    color: "#DC2626",
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
    paddingHorizontal: 30,
    paddingVertical: 40,
    marginRight: 15,
  },
  clientName: {
    fontSize: 25,
    fontWeight: '300',
  },
  clientPhone: {
    fontSize: 18,
    fontWeight: "bold",
  },
  clientAmount: {
    fontSize: 25,
    fontWeight: "bold",
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
    paddingVertical: 25,
    borderRadius: 20,
    marginBottom: 10,
    marginRight: 5,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 30,
    marginVertical: 20,
  },
  actionButtonYellow: {
    flex: 1,
    backgroundColor: '#FFC107',
    paddingHorizontal: 10,
    paddingVertical: 25,
    borderRadius: 20,
    marginBottom: 10,
    marginRight: 5,
    alignItems: 'center',
  },
  actionButtonOrange: {
    flex: 1,
    backgroundColor: '#FF9800',
    paddingHorizontal: 10,
    paddingVertical: 25,
    borderRadius: 20,
    marginBottom: 10,
    marginRight: 5,
    alignItems: 'center',
  },
  actionButtonRed: {
    flex: 1,
    backgroundColor: '#FF0000',
    paddingHorizontal: 10,
    paddingVertical: 25,
    borderRadius: 20,
    marginBottom: 10,
    marginRight: 5,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 10,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#d0d0d0',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d0d0d0',
    marginBottom: 20,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 50,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    height: 50,
  },
  inputt: {
    flex: 1,
    fontSize: 16,
  },
  readOnlyInput: {
    backgroundColor: '#f0f0f0',
  },
  label: {
    fontSize: 16,
    fontWeight: '300',
    marginBottom: 5,
  },
  dropdown: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 5,
    paddingHorizontal: 10,
    justifyContent: 'center',
    height: 50,
  },
  dropdownText: {
    fontSize: 16,
    color: 'black',
  },
  dropdownMenu: {
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 5,
    marginTop: 8,
  },
});
