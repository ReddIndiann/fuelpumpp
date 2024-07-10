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
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { Select, SelectItem, IndexPath } from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StockRecords = () => {
  const [vehicleArrivalDate, setVehicleArrivalDate] = useState(new Date());
  const [dippingTime, setDippingTime] = useState(new Date());
  const [showDippingTimePicker, setShowDippingTimePicker] = useState(false);
  const [showVehicleArrivalDatePicker, setShowVehicleArrivalDatePicker] = useState(false);
  const [selectedProductType, setSelectedProductType] = useState(new IndexPath(0));
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [dippingQuantity, setDippingQuantity] = useState('');
  const [dispenserQuantity, setDispenserQuantity] = useState('');
  const [agentId, setAgentId] = useState(null);
  const [products, setProducts] = useState([]);
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

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
        // Log the fetched products' details
        data.data.forEach(product => {
          console.log(`Product ID: ${product.id}, Name: ${product.product_name}, Price: ${product.price}`);
        });
      } else {
        console.error('Failed to fetch products:', data.message);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleVehicleArrivalDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || vehicleArrivalDate;
    setShowVehicleArrivalDatePicker(false);
    setVehicleArrivalDate(currentDate);
    console.log('Selected Vehicle Arrival Date:', formatDate(currentDate));
  };

  const handleDippingTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || dippingTime;
    setShowDippingTimePicker(false);
    setDippingTime(currentTime);
    console.log('Selected Dipping Time:', currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  const handleSubmit = () => {
    // Validate all fields are filled
    if (!agentId || !selectedProductId || !dippingQuantity || !dispenserQuantity) {
      Alert.alert('Error', 'Please fill all form inputs before proceeding.');
      return;
    }
  
    const payload = {
      agent_id: agentId,
      location_id: "3",
      product_id: selectedProductId,
      record_date: formatDate(vehicleArrivalDate),
      dipping_time: dippingTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dipping_quantity: dippingQuantity,
      dispenser_qunatity: dispenserQuantity,
    };
  
    axios.post('https://gcnm.wigal.com.gh/stockrecords', payload, {
      headers: {
        'API-KEY': 'muJFx9F3E5ptBExkz8Fqroa1D79gv9Nv',
      }
    })
    .then(response => {
      console.log(response.data);
      Alert.alert('Success', 'Stock record saved successfully', [
        { text: 'OK', onPress: () => navigation.navigate('RecordList') }
      ]);
    })
    .catch(error => {
      console.error(error);
      Alert.alert('Error', 'Failed to save stock record');
    });
  };
  
console.log(selectedProductId)
return (
  <SafeAreaView style={styles.container}>
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Stock Records</Text>
        
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
          <Text style={styles.label}>Date of Record</Text>
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
            minimumDate={new Date()}
            onChange={handleVehicleArrivalDateChange}
          />
        )}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Time of Dipping</Text>
          <TouchableOpacity onPress={() => setShowDippingTimePicker(true)} style={styles.datePickerButton}>
            <Text style={styles.datePickerText}>
              {dippingTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            <Icon name="access-time" size={24} color="#007B5D" />
          </TouchableOpacity>
        </View>
        {showDippingTimePicker && (
          <DateTimePicker
            value={dippingTime}
            mode="time"
            display="default"
            onChange={handleDippingTimeChange}
          />
        )}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Dipping Quantity</Text>
          <TextInput
            placeholder="Enter quantity"
            value={dippingQuantity}
            onChangeText={(text) => setDippingQuantity(text)}
            style={styles.input}
            keyboardType='numeric'
            placeholderTextColor="#a0a0a0"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Dispenser Quantity</Text>
          <TextInput
            placeholder="Enter quantity"
            value={dispenserQuantity}
            onChangeText={(text) => setDispenserQuantity(text)}
            style={styles.input}
            keyboardType='numeric'
            placeholderTextColor="#a0a0a0"
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Submit</Text>
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
  marginTop: 20,
},
buttonText: {
  color: '#fff',
  fontSize: 18,
  fontWeight: '600',
},
});

export default StockRecords;