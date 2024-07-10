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
import axios from 'axios';

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
  const [productId, setProductId] = useState('');
  const [pricePerLitre, setPricePerLitre] = useState('');
  const [amount, setAmount] = useState('');
  const [agentId, setAgentId] = useState(null);
  const [inputType, setInputType] = useState(''); // New state for tracking input type
  let SI = null; // Initialize SI outside of useEffect

  useEffect(() => {
    console.log('Client ID:', client.id); // Log the client ID

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
          'https://gcnm.wigal.com.gh/verifycustomer',
          { customerphonenumber: client.phonenumber },
          {
            headers: {
              'API-KEY': 'muJFx9F3E5ptBExkz8Fqroa1D79gv9Nv',
            },
          }
        );
        if (response.status === 200 && response.data.statuscode === '00') {
          setBalance(response.data.data.balance); // Update balance state
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
        setProductId(selectedProduct.id); // Set product ID
        console.log('Selected Product ID:', selectedProduct.id); // Log the product ID
        SI = selectedProduct.id; // Set SI here
        console.log('SI:', SI);
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
    if (!productType || !quantity || !amount || !pricePerLitre) {
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
          customer_id: client.id,
          product_id: productId, // Use the selected product ID
          price: pricePerLitre,
          quantity,
          amount,
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
  

  const InputField = ({ label, value, onChangeText, placeholder, editable = true, keyboardType = 'default' }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, !editable && styles.readOnlyInput]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        editable={editable}
        keyboardType={keyboardType}
        placeholderTextColor="#a0a0a0"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Dispense Fuel</Text>
          
          <View style={styles.clientCard}>
            <View style={styles.clientIconContainer}>
              <Icon name="person" size={40} color="#fff" />
            </View>
            <View style={styles.clientInfo}>
              <Text style={styles.clientName}>{client.name}</Text>
              <Text style={styles.clientPhone}>{client.phonenumber}</Text>
              <Text style={styles.clientAmount}>GH₵ {balance}</Text>
            </View>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.formLabel}>Select Product Type</Text>
            <Select
              selectedIndex={new IndexPath(0)}
              onSelect={index => setProductType(products[index.row].product_name)}
              value={productType || 'Select your product type'}
              style={styles.select}
            >
              {products.map((product, index) => (
                <SelectItem key={index} title={product.product_name} />
              ))}
            </Select>

            <InputField
              label="Price Per Litre"
              value={pricePerLitre}
              editable={false}
              placeholder="Price per litre"
              keyboardType="numeric"
            />

            <InputField
              label="Quantity (Litres)"
              value={quantity}
              onChangeText={(text) => {
                setInputType('quantity');
                setQuantity(text);
              }}
              placeholder="Enter quantity"
              keyboardType="numeric"
            />

            <InputField
              label="Amount (GHS)"
              value={amount}
              onChangeText={(text) => {
                setInputType('amount');
                setAmount(text);
              }}
              placeholder="Amount"
              keyboardType="numeric"
            />

            <TouchableOpacity style={styles.button} onPress={handleDispenseFuel}>
              <Text style={styles.buttonText}>Dispense Fuel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
    textAlign: 'center',
  },
  clientCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clientIconContainer: {
    backgroundColor: '#3498db',
    borderRadius: 50,
    padding: 15,
    marginRight: 15,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  clientPhone: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
  },
  clientAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
    marginTop: 10,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  select: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dcdde1',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  readOnlyInput: {
    backgroundColor: '#f0f0f0',
    color: '#a0a0a0',
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DispenseFuel;