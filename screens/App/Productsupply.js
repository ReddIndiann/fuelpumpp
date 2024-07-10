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

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleVehicleArrivalDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || vehicleArrivalDate;
    setShowVehicleArrivalDatePicker(Platform.OS === 'ios');
    setVehicleArrivalDate(currentDate);
    console.log('Selected Vehicle Arrival Date:', formatDate(currentDate));
  };

  const handleDeliveryDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || deliveryDate;
    setShowDeliveryDatePicker(Platform.OS === 'ios');
    setDeliveryDate(currentDate);
    console.log('Selected Delivery Date:', formatDate(currentDate));
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
    // Validate all fields are filled
    if (!agentId || !selectedProductId || !quantityDelivered || !vehicleNumber || !driverName || !driverNumber) {
      Alert.alert('Error', 'Please fill all form inputs before saving.');
      return;
    }
  
    try {
      const response = await axios.post(
        'https://gcnm.wigal.com.gh/productsupply',
        {
          agent_id: agentId,
          product_id: selectedProductId,
          arrival_date: formatDate(vehicleArrivalDate),
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
        { text: 'OK', onPress: () => navigation.navigate('StockProductList') }
      ]);
    } catch (error) {
      console.error('Error saving product supply:', error);
      Alert.alert('Error', 'Failed to save product supply');
    }
  };
  
console.log(selectedProductId)
return (
  <SafeAreaView style={styles.container}>
    
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
       <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Product Supply</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Select Product Type</Text>
          <Select
            style={styles.select}
            selectedIndex={selectedProductType}
            onSelect={index => {
              setSelectedProductType(index);
              const selectedProduct = products[index.row];
              setSelectedProductId(selectedProduct.id);
            }}
            value={products[selectedProductType.row]?.product_name || 'Select your product type'}
          >
            {products.map((product, index) => (
              <SelectItem key={index} title={product.product_name} />
            ))}
          </Select>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Date of Vehicle Arrival</Text>
          <TouchableOpacity onPress={() => setShowVehicleArrivalDatePicker(true)} style={styles.datePickerButton}>
            <Text style={styles.datePickerText}>
              {vehicleArrivalDate.toLocaleDateString()}
            </Text>
            <Icon name="calendar-today" size={24} color="#007B5D" />
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

        <View style={styles.formGroup}>
          <Text style={styles.label}>Delivery Date</Text>
          <TouchableOpacity onPress={() => setShowDeliveryDatePicker(true)} style={styles.datePickerButton}>
            <Text style={styles.datePickerText}>
              {deliveryDate.toLocaleDateString()}
            </Text>
            <Icon name="calendar-today" size={24} color="#007B5D" />
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

        <View style={styles.formGroup}>
          <Text style={styles.label}>Quantity Delivered</Text>
          <TextInput
            placeholder="Enter quantity"
            value={quantityDelivered}
            onChangeText={(text) => setQuantityDelivered(text)}
            style={styles.input}
            placeholderTextColor="#a0a0a0"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Vehicle Number</Text>
          <TextInput
            placeholder="Enter number"
            value={vehicleNumber}
            onChangeText={(text) => setVehicleNumber(text)}
            style={styles.input}
            placeholderTextColor="#a0a0a0"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Driver Name</Text>
          <TextInput
            placeholder="Enter name"
            value={driverName}
            onChangeText={(text) => setDriverName(text)}
            style={styles.input}
            placeholderTextColor="#a0a0a0"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Driver Number</Text>
          <TextInput
            placeholder="Enter number"
            value={driverNumber}
            onChangeText={(text) => setDriverNumber(text)}
            style={styles.input}
            placeholderTextColor="#a0a0a0"
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007B5D',
  },
  addButton: {
    backgroundColor: '#007B5D',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
scrollContainer: {
  flexGrow: 1,
  padding: 20,
},
title: {
  fontSize: 28,
  fontWeight: 'bold',
  color: '#007B5D',
  marginBottom: 20,
},
formGroup: {
  marginBottom: 20,
},
label: {
  fontSize: 16,
  fontWeight: '600',
  color: '#333',
  marginBottom: 8,
},
select: {
  backgroundColor: '#fff',
  borderRadius: 8,
  borderColor: '#ddd',
},
datePickerButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#fff',
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#ddd',
  paddingHorizontal: 12,
  paddingVertical: 12,
},
datePickerText: {
  fontSize: 16,
  color: '#333',
},
input: {
  backgroundColor: '#fff',
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#ddd',
  paddingHorizontal: 12,
  paddingVertical: 12,
  fontSize: 16,
},
button: {
  backgroundColor: '#007B5D',
  borderRadius: 8,
  paddingVertical: 14,
  alignItems: 'center',
  marginTop: "10%",
  marginBottom:"40%"
},
buttonText: {
  color: '#fff',
  fontSize: 18,
  fontWeight: '600',
},
});

export default ProductSupply;