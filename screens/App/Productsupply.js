import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Dropdown = ({ label, data, onSelect }) => {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);

  const toggleDropdown = () => {
    setVisible(!visible);
  };

  const onItemPress = (item) => {
    setSelected(item);
    onSelect(item);
    setVisible(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => onItemPress(item)}>
      <Text>{item.product_name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.dropdownContainer}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.dropdownButton} onPress={toggleDropdown}>
        <Text style={styles.dropdownButtonText}>
          {(selected && selected.product_name) || "Select your product type"}
        </Text>
        <Icon name={visible ? "arrow-drop-up" : "arrow-drop-down"} size={24} color="#007B5D" />
      </TouchableOpacity>
      <Modal visible={visible} transparent animationType="none">
        <TouchableOpacity 
          style={styles.overlay}
          onPress={() => setVisible(false)}
        >
          <View style={styles.dropdown}>
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const ProductSupply = () => {
  const [arrivalDate, setArrivalDate] = useState(new Date());
  const [showArrivalDatePicker, setShowArrivalDatePicker] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [deliveredQuantity, setDeliveredQuantity] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverNumber, setDriverNumber] = useState('');
  const [agentId, setAgentId] = useState(null);
  const [products, setProducts] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchAgentId = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('user');
        const user = JSON.parse(savedUser);
        setAgentId(user?.id);
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

  const handleArrivalDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || arrivalDate;
    setShowArrivalDatePicker(false);
    setArrivalDate(currentDate);
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setSelectedProductId(product.id);
  };

  const handleSubmit = () => {
    if (!agentId || !selectedProductId || !deliveredQuantity || !vehicleNumber || !driverName || !driverNumber) {
      Alert.alert('Error', 'Please fill all form inputs before proceeding.');
      return;
    }
  
    const payload = {
      agent_id: agentId,
      product_id: selectedProductId,
      arrival_date: formatDate(arrivalDate),
      delivered_quantity: deliveredQuantity,
      vehicle_number: vehicleNumber,
      driver_name: driverName,
      driver_number: driverNumber
    };
  
    axios.post('https://gcnm.wigal.com.gh/productsupply', payload, {
      headers: {
        'API-KEY': 'muJFx9F3E5ptBExkz8Fqroa1D79gv9Nv',
      }
    })
    .then(response => {
      console.log(response.data);
      Alert.alert('Success', 'Product supply record saved successfully', [
        { text: 'OK', onPress: () => navigation.navigate('StockProductList') }
      ]);
    })
    .catch(error => {
      console.error(error);
      Alert.alert('Error', 'Failed to save product supply record');
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Product Supply</Text>
          
          <Dropdown
            label="Select Product Type"
            data={products}
            onSelect={handleProductSelect}
          />

          <View style={styles.formGroup}>
            <Text style={styles.label}>Arrival Date</Text>
            <TouchableOpacity onPress={() => setShowArrivalDatePicker(true)} style={styles.datePickerButton}>
              <Text style={styles.datePickerText}>
                {arrivalDate.toLocaleDateString()}
              </Text>
              <Icon name="calendar-today" size={24} color="#007B5D" />
            </TouchableOpacity>
          </View>
          {showArrivalDatePicker && (
            <DateTimePicker
              value={arrivalDate}
              mode="date"
              display="default"
              onChange={handleArrivalDateChange}
            />
          )}

          <View style={styles.formGroup}>
            <Text style={styles.label}>Delivered Quantity</Text>
            <TextInput
              placeholder="Enter quantity"
              value={deliveredQuantity}
              onChangeText={setDeliveredQuantity}
              style={styles.input}
              keyboardType='numeric'
              placeholderTextColor="#a0a0a0"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Vehicle Number</Text>
            <TextInput
              placeholder="Enter vehicle number"
              value={vehicleNumber}
              onChangeText={setVehicleNumber}
              style={styles.input}
              placeholderTextColor="#a0a0a0"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Driver Name</Text>
            <TextInput
              placeholder="Enter driver name"
              value={driverName}
              onChangeText={setDriverName}
              style={styles.input}
              placeholderTextColor="#a0a0a0"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Driver Number</Text>
            <TextInput
              placeholder="Enter driver number"
              value={driverNumber}
              onChangeText={setDriverNumber}
              style={styles.input}
              keyboardType='phone-pad'
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
  dropdownContainer: {
    marginBottom: 20,
  },
  dropdownButton: {
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
  dropdownButtonText: {
    fontSize: 16,
    color: '#333',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    width: '80%',
    maxHeight: 300,
  },
  item: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default ProductSupply;