import React, { useState, useEffect, useRef } from 'react';
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
  Modal,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const DispenseFuel = () => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const route = useRoute();
  const navigation = useNavigation();
  const { client } = route.params;
  const [balance, setBalance] = useState('0');

  const [quantity, setQuantity] = useState('');
  const [products, setProducts] = useState([]);
  const [productType, setProductType] = useState('');
  const [productId, setProductId] = useState('');
  const [pricePerLitre, setPricePerLitre] = useState('');
  const [amount, setAmount] = useState('');
  const [agentId, setAgentId] = useState(null);
  const [inputType, setInputType] = useState('');

  const scrollViewRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchAgentId = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('user');
        const user = JSON.parse(savedUser);
        setAgentId(user?.id);
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
          setBalance(response.data.data.balance);
        } else {
          setBalance('0');
        }
      } catch (error) {
        setBalance('0');
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
        setProductId(selectedProduct.id);
      }
    }
  }, [productType, products]);

  useEffect(() => {
    calculateAmount();
  }, [quantity, amount, pricePerLitre]);

  const calculateAmount = () => {
    if (inputType === 'quantity' && quantity && pricePerLitre) {
      const numericQuantity = parseFloat(quantity);
      if (numericQuantity > 0) {
        const calculatedAmount = (numericQuantity * parseFloat(pricePerLitre)).toFixed(2);
        setAmount(calculatedAmount);
      } else {
        setAmount('');
      }
    } else if (inputType === 'amount' && amount && pricePerLitre) {
      const numericAmount = parseFloat(amount);
      if (numericAmount > 0) {
        const calculatedQuantity = (numericAmount / parseFloat(pricePerLitre)).toFixed(2);
        setQuantity(calculatedQuantity);
      } else {
        setQuantity('');
      }
    }
  };

  const handleDispenseFuel = async () => {
    if (!quantity || !productType || !pricePerLitre || !amount) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const numericQuantity = parseFloat(quantity);
    const numericAmount = parseFloat(amount);

    if (numericQuantity <= 0 || numericAmount <= 0) {
      Alert.alert('Error', 'Quantity and amount must be greater than 0.');
      return;
    }

    const numericBalance = parseFloat(balance);

    if (numericAmount > numericBalance) {
      Alert.alert('Insufficient Balance', 'The amount exceeds the available balance.');
      return;
    }

    try {
      const response = await fetch('https://gcnm.wigal.com.gh/customerdisbursement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'API-KEY': 'muJFx9F3E5ptBExkz8Fqroa1D79gv9Nv',
        },
        body: JSON.stringify({
          agent_id: agentId,
          customer_id: client.id,
          product_id: productId,
          price: pricePerLitre,
          quantity: numericQuantity,
          amount: numericAmount,
        }),
      });

      const data = await response.json();
      if (data.statuscode === '00') {
        Alert.alert('Success', 'Fuel dispensed successfully.');
        navigation.navigate('DisburementList', { customerId: client.id });
      } else {
        Alert.alert('Error', data.message || 'Failed to dispense fuel.');
      }
    } catch (error) {
      console.error('Error dispensing fuel:', error);
      Alert.alert('Error', 'An error occurred while dispensing fuel.');
    }
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const selectProductType = (product) => {
    setProductType(product.product_name);
    setPricePerLitre(product.price);
    setProductId(product.id);
    closeModal();
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => selectProductType(item)}>
      <Text>{item.product_name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
        >
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
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={openModal}
            >
              <Text style={styles.dropdownButtonText}>
                {productType || 'Select your product type'}
              </Text>
              <Icon name={modalVisible ? 'arrow-drop-up' : 'arrow-drop-down'} size={24} color="#007B5D" />
            </TouchableOpacity>
            <Modal visible={modalVisible} transparent animationType="none">
              <TouchableOpacity
                style={styles.overlay}
                onPress={closeModal}
              >
                <View style={styles.dropdown}>
                  <FlatList
                    data={products}
                    renderItem={renderProductItem}
                    keyExtractor={(item) => item.id.toString()}
                  />
                </View>
              </TouchableOpacity>
            </Modal>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Price Per Litre</Text>
              <TextInput
                style={[styles.input, styles.readOnlyInput]}
                value={pricePerLitre}
                editable={false}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Quantity (Litres)</Text>
              <TextInput
                style={styles.input}
                value={quantity}
                onChangeText={(text) => {
                  setInputType('quantity');
                  setQuantity(text);
                }}
                placeholder="Enter quantity"
                keyboardType="numeric"
                placeholderTextColor="#a0a0a0"
                blurOnSubmit={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Amount (GHS)</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={(text) => {
                  setInputType('amount');
                  setAmount(text);
                }}
                placeholder="Amount"
                keyboardType="numeric"
                placeholderTextColor="#a0a0a0"
                blurOnSubmit={false}
              />
            </View>

            <TouchableOpacity 
              style={styles.button} 
              onPress={handleDispenseFuel}
              activeOpacity={0.8}
            >
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
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#dcdde1',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 8,
    padding: 10,
    maxHeight: '50%',
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#dcdde1',
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