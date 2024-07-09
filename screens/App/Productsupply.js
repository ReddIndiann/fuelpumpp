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
import DateTimePicker from '@react-native-community/datetimepicker';
import { ApplicationProvider, Layout, Select, SelectItem, IndexPath } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const ProductSupply = () => {
  const [vehicleArrivalDate, setVehicleArrivalDate] = useState(new Date());
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [quantityDelivered, setQuantityDelivered] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverNumber, setDriverNumber] = useState('');
  const [showVehicleArrivalDatePicker, setShowVehicleArrivalDatePicker] = useState(false);
  const [showDeliveryDatePicker, setShowDeliveryDatePicker] = useState(false);
  const [selectedProductType, setSelectedProductType] = useState(new IndexPath(0));
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [agentId, setAgentId] = useState(null);
  const [products, setProducts] = useState([]);
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchAgentId = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('user');
        const user = JSON.parse(savedUser);
        setAgentId(user?.id); // Adjust this based on your user object structure
        if (user?.id) {
          fetchProducts(user.id);
        }
      } catch (error) {
        console.error('Failed to fetch agent ID:', error);
      }
    };

    fetchAgentId();
  }, []);

  const handleVehicleArrivalDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || vehicleArrivalDate;
    setShowVehicleArrivalDatePicker(Platform.OS === 'ios');
    setVehicleArrivalDate(currentDate);
  };

  const handleDeliveryDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || deliveryDate;
    setShowDeliveryDatePicker(Platform.OS === 'ios');
    setDeliveryDate(currentDate);
  };

  const fetchProducts = async (agentId) => {
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
        console.log('Fetched products:', data.data); // Log the fetched products
      } else {
        console.error('Failed to fetch products:', data.message);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(
        'https://gcnm.wigal.com.gh/fetchProductsupplylist',
        {
          agent_id: agentId,
          product_id: selectedProductId,
          arrival_date: vehicleArrivalDate.toLocaleDateString(),
          delivered_quantity: quantityDelivered,
          vehicle_number: vehicleNumber,
          driver_name: driverName,
          driver_number: driverNumber,
        },
        {
          headers: {
            'API-KEY': 'muJFx9F3E5ptBExkz8Fqroa1D79gv9Nv',
          }
        }
      );
      console.log('Product supply saved successfully:', response.data);
      Alert.alert('Success', 'Product supply saved successfully', [
        { text: 'OK', onPress: () => navigation.navigate('stockProductList') }
      ]);
    } catch (error) {
      console.error('Error saving product supply:', error);
      Alert.alert('Error', 'Failed to save product supply');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Product Supply</Text>
          <Text style={styles.pageinfo}>
            Lorem ipsum dolor sit amet,
          </Text>

          <Text style={styles.label}>Select Product Type</Text>
          <Select
            size='large'
            selectedIndex={selectedProductType}
            onSelect={index => {
              setSelectedProductType(index);
              const selectedProduct = products[index.row];
              setSelectedProductId(selectedProduct.id); // Set the selected product ID
              console.log(`Selected Product - ID: ${selectedProduct.id}, Name: ${selectedProduct.product_name}`);
            }}
            value={products[selectedProductType.row]?.product_name || 'Select your product type'}
            style={styles.select}
          >
            {products.map((product, index) => (
              <SelectItem key={index} title={product.product_name} />
            ))}
          </Select>

          <Text style={styles.label}>Select Date of Vehicle Arrival</Text>
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => setShowVehicleArrivalDatePicker(true)} style={styles.datePickerButton}>
              <Text style={styles.datePickerText}>
                {vehicleArrivalDate.toLocaleDateString()}
              </Text>
              <Icon name="calendar-today" size={24} color="#a0a0a0" />
            </TouchableOpacity>
          </View>

          {showVehicleArrivalDatePicker && (
            <DateTimePicker
              value={vehicleArrivalDate}
              mode="date"
              display="default"
              onChange={handleVehicleArrivalDateChange}
              minimumDate={new Date()}
            />
          )}

          <Text style={styles.label}>Select Delivery Date</Text>
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => setShowDeliveryDatePicker(true)} style={styles.datePickerButton}>
              <Text style={styles.datePickerText}>
                {deliveryDate.toLocaleDateString()}
              </Text>
              <Icon name="calendar-today" size={24} color="#a0a0a0" />
            </TouchableOpacity>
          </View>

          {showDeliveryDatePicker && (
            <DateTimePicker
              value={deliveryDate}
              mode="date"
              display="default"
              onChange={handleDeliveryDateChange}
              minimumDate={new Date()}
            />
          )}

          <Text style={styles.label}>Enter Quantity Delivered</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter quantity"
              value={quantityDelivered}
              onChangeText={(text) => setQuantityDelivered(text)}
              style={styles.input}
              placeholderTextColor="#a0a0a0"
              keyboardType="numeric"
            />
          </View>

          <Text style={styles.label}>Enter Vehicle Number</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter number"
              value={vehicleNumber}
              onChangeText={(text) => setVehicleNumber(text)}
              style={styles.input}
              placeholderTextColor="#a0a0a0"
            />
          </View>

          <Text style={styles.label}>Enter Driver Name</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter name"
              value={driverName}
              onChangeText={(text) => setDriverName(text)}
              style={styles.input}
              placeholderTextColor="#a0a0a0"
            />
          </View>

          <Text style={styles.label}>Enter Driver Number</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter number"
              value={driverNumber}
              onChangeText={(text) => setDriverNumber(text)}
              style={styles.input}
              placeholderTextColor="#a0a0a0"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, isTablet && styles.tabletButton]}
              onPress={handleSave}
            >
              <Text style={styles.signInText}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default ProductSupply;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  label: {
    color: '#000000',
    fontSize: 20,
    alignSelf: "flex-start",
    marginLeft: "6%",
  },
  pageinfo: {
    fontSize: 20,
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: '100%',
    fontSize: 18,
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  datePickerText: {
    fontSize: 18,
    color: '#000',
  },
  inputContainer: {
    width: '90%',
    height: 50,
    borderRadius: 10,
    fontSize: 18,
    paddingLeft: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#a0a0a0',
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    marginVertical: 20,
  },
  button: {
    width: 320,
    height: 50,
    borderColor: '#02B2DD',
    backgroundColor: '#007B5D',
    borderWidth: 1,
    justifyContent: 'center',
    marginBottom: 60,
    borderRadius: 10,
   
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
  dropdownWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  select: {
    width: '95%',
    borderWidth: 0,
    paddingLeft: 15,
    marginRight:"5%",
    backgroundColor: 'transparent',
    height:'6%',
  
  },
  dropdownText: {
    fontSize: 18,
    color: '#000',
  },
  dropdownOptionText: {
    fontSize: 18,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  dropdownContainer: {
    width: '80%',
    marginTop: 10,
    borderRadius: 10,
  },
});
