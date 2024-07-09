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
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApplicationProvider, Layout, Select, SelectItem, IndexPath } from '@ui-kitten/components';

const DispenseFuel = () => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const route = useRoute();
  const navigation = useNavigation();
  const { client } = route.params; // Retrieve client data from route parameters
  const [balance, setBalance] = useState('0'); // Initial balance state

  const [searchQuery, setSearchQuery] = useState('');
  const [quantity, setQuantity] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage] = useState(5);
  const [products, setProducts] = useState([]);
  const [productType, setProductType] = useState('');
  const [pricePerLitre, setPricePerLitre] = useState('');
  const [amount, setAmount] = useState('');
  const [agentId, setAgentId] = useState(null);
  const [inputType, setInputType] = useState(''); // New state for tracking input type

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

    const fetchBalance = async () => {
      try {
        const response = await axios.post(
          'https://gcnm.wigal.com.gh/getcustomerbalance',
          { customer_id: client.customerId },
          {
            headers: {
              'API-KEY': 'muJFx9F3E5ptBExkz8Fqroa1D79gv9Nv',
            },
          }
        );
        if (response.status === 200 && response.data.statuscode === '00') {
          setBalance(response.data.data.total_amount); // Update balance state
        } else {
          setBalance('0'); // Show 0 if customer has no account
        }
      } catch (error) {
        setBalance('0'); // Show 0 in case of an error
      }
    };

    fetchAgentId();
    fetchBalance();
  }, [client.customerId]);

  useEffect(() => {
    if (agentId) {
      fetchProducts();
    }
  }, [agentId]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://gcnm.wigal.com.gh/clientproducts', {
        method: 'POST',
        headers: {
          'API-KEY': 'muJFx9F3E5ptBExkz8Fqroa1D79gv9Nv',
        },
        body: JSON.stringify({
          agent_id: agentId,
        }),
      });

      const data = await response.json();
      if (data.statuscode === '00') {
        setProducts(data.data);
      } else {
        console.error('Failed to fetch products:', data.message);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    if (productType) {
      const selectedProduct = products.find(product => product.product_name === productType);
      if (selectedProduct) {
        setPricePerLitre(selectedProduct.price);
      }
    }
  }, [productType, products]);

  useEffect(() => {
    calculateAmount();
  }, [quantity, amount, pricePerLitre]);

  const calculateAmount = () => {
    if (inputType === 'quantity' && quantity && pricePerLitre) {
      const calculatedAmount = (parseFloat(quantity) * parseFloat(pricePerLitre)).toFixed(2);
      setAmount(calculatedAmount);
    } else if (inputType === 'amount' && amount && pricePerLitre) {
      const calculatedQuantity = (parseFloat(amount) / parseFloat(pricePerLitre)).toFixed(2);
      setQuantity(calculatedQuantity);
    }
  };

  const handleDispenseFuel = async () => {
    if (!quantity || !productType || !pricePerLitre || !amount) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch('https://gcnm.wigal.com.gh/customerdisbursement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent_id: agentId,
          customer_id: client.clientid,  
          product_id: '47', // Update this with the relevant product ID
          price: pricePerLitre,
          quantity,
          amount: '0',
        }),
      });

      const data = await response.json();
      if (data.statuscode === '00') {
        Alert.alert('Success', 'Fuel dispensed successfully.');
        navigation.navigate('Home'); // Adjust this to navigate to the appropriate screen
      } else {
        Alert.alert('Error', data.message || 'Failed to dispense fuel.');
      }
    } catch (error) {
      console.error('Error dispensing fuel:', error);
      Alert.alert('Error', 'An error occurred while dispensing fuel.');
    }
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
                <Text style={styles.clientAmount}>gh₵{balance}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.title}>Dispense Fuel</Text>
         
          <Text style={styles.label}>Select Product Type</Text>
          
          
            <Select
              selectedIndex={new IndexPath(0)}
              onSelect={index => setProductType(products[index.row].product_name)}
              value={productType || 'Select your product type'}
              style={styles.dropdown}
            >
              {products.map((product, index) => (
                <SelectItem key={index} title={product.product_name} />
              ))}
            </Select>
            <TouchableOpacity>
              <Icon size={24} color="#a0a0a0" />
            </TouchableOpacity>
     
          
          <Text style={styles.label}>Display Price Per Litre</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Price per litre"
              value={pricePerLitre}
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
              value={quantity}
              onChangeText={(text) => {
                setInputType('quantity');
                setQuantity(text);
              }}
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
              value={amount}
              onChangeText={(text) => {
                setInputType('amount');
                setAmount(text);
              }}
              editable={true}
              style={[styles.inputt, { flex: 1, borderColor: '#FFFFFF' }]}
              keyboardType='numeric'
              placeholderTextColor="#a0a0a0"
            />
            <TouchableOpacity>
              <Icon name='' size={24} color="#a0a0a0" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleDispenseFuel}>
            <Text style={styles.buttonText}>Dispense</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FD',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  title1: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  clientCard: {
    backgroundColor: '#d3d3d3',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  clientCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clientIcon: {
    marginRight: 16,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  clientPhone: {
    fontSize: 14,
    color: '#888',
  },
  clientAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#E5E5E5',
    paddingHorizontal: 8,
  },
  dropdown: {
    flex: 1,
    paddingVertical: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#E5E5E5',
    paddingHorizontal: 8,
  },
  inputt: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  readOnlyInput: {
    backgroundColor: '#f0f0f0',
    color: '#a0a0a0',
  },
  button: {
    backgroundColor: '#5d79ff',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DispenseFuel;
