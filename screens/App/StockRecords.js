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
  Keyboard,
  ScrollView,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import ModalDropdown from 'react-native-modal-dropdown';
import { useNavigateToScreen } from '../../hooks/useNavigateToScreen';

const StockRecords = () => {
  const [email, setEmail] = useState('');
  const [vehicleArrivalDate, setVehicleArrivalDate] = useState(new Date());
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dippingTime, setDippingTime] = useState(new Date());
  const [showDippingTimePicker, setShowDippingTimePicker] = useState(false);
  const [showVehicleArrivalDatePicker, setShowVehicleArrivalDatePicker] = useState(false);
  const [productType, setProductType] = useState(null);
  const [dippingQuantity, setDippingQuantity] = useState('');
  const [dispenserQuantity, setDispenserQuantity] = useState('');
  const navigateToScreen = useNavigateToScreen();
  const { width } = useWindowDimensions();

  const isTablet = width >= 768;

  const handleVehicleArrivalDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || vehicleArrivalDate;
    setShowVehicleArrivalDatePicker(Platform.OS === 'ios');
    setVehicleArrivalDate(currentDate);
  };

  const handleDippingTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || dippingTime;
    setShowDippingTimePicker(Platform.OS === 'ios');
    setDippingTime(currentTime);
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardOpen(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardOpen(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleSubmit = () => {
    const payload = {
      client_id: "2",
      location_id: "3",
      customer_id: "3",
      product_id: productType,
      record_date: vehicleArrivalDate.toISOString().split('T')[0],
      dipping_time: dippingTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dipping_quantity: dippingQuantity,
      dispenser_qunatity: dispenserQuantity,
    };

    axios.post('https://gcnm.wigal.com.gh/stockrecords', payload)
      .then(response => {
        console.log(response.data);
        // Handle success response
      })
      .catch(error => {
        console.error(error);
        // Handle error response
      });
  };

 
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Stock Records</Text>
          <Text style={styles.pageinfo}>
            Lorem ipsum dolor sit amet
          </Text>
          <Text style={styles.label}>Select Product Type</Text>
          <View style={styles.inputContainer}>
            <ModalDropdown
              options={['Product 1', 'Product 2']}
              onSelect={(index, value) => setProductType(value)}
              dropdownTextStyle={styles.dropdownTextStyle}
              dropdownStyle={styles.dropdownStyle}
              textStyle={styles.dropdownText}
              defaultValue={'Select your product type'}
            />
          </View>

          <Text style={styles.label}>Select Date of Record</Text>
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
            />
          )}

          <Text style={styles.label}>Select Time of Dipping</Text>
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => setShowDippingTimePicker(true)} style={styles.datePickerButton}>
              <Text style={styles.datePickerText}>
                {dippingTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
              <Icon name="access-time" size={24} color="#a0a0a0" />
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

          <Text style={styles.label}>Enter Dipping Quantity</Text>
       
            <TextInput
              placeholder="Enter quantity"
              value={dippingQuantity}
              onChangeText={(text) => setDippingQuantity(text)}
              style={styles.input}
              keyboardType='numeric'
              placeholderTextColor="#a0a0a0"
            />
          

          <Text style={styles.label}>Enter Dispenser Quantity</Text>
        
            <TextInput
              placeholder="Enter quantity"
              value={dispenserQuantity}
              onChangeText={(text) => setDispenserQuantity(text)}
              style={styles.input}
              keyboardType='numeric'
              placeholderTextColor="#a0a0a0"
            />
          

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button,  isTablet && styles.tabletButton]}
          
              onPress={handleSubmit}
            >
              <Text style={styles.signInText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(!isModalVisible);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.modalIconContainer} onPress={() => setIsModalVisible(false)}>
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.modalMessage}>The password or the e-mail address is incorrect</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default StockRecords;

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
  inputContainer: {
    width: '90%',
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
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
  },
  buttonContainerKeyboardOpen: {
    marginTop: 10,
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
    marginRight: 20,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a0a0a0',
    borderColor: '#a0a0a0',
  },
  button1: {
    width: 300,
    height: 50,
    justifyContent: 'center',
    marginTop: 10,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
  },
  tabletButton: {
    width: 240,
    height: 80,
  },
  tabletButton1: {
    width: 240,
    height: 80,
    backgroundColor: '#02B2DD',
  },
  signInText: {
    color: '#FFFFFF',
    fontSize: 17,
  },
  signUpText: {
    fontSize: 17,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 300,
  },
  modalContainer: {
    width: '90%',
    marginRight: 10,
    backgroundColor: '#D32F2F',
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: "row",
    padding: 10,
  },
  modalIconContainer: {
    width: '15%',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#D32F2F',
    borderRadius: 5,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    color: '#fff',
    fontWeight: "bold",
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  datePickerText: {
    fontSize: 18,
    color: '#000',
  },
  dropdownTextStyle: {
    fontSize: 18,
    color: '#000',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  dropdownStyle: {
    width: '90%',
    borderColor: '#a0a0a0',
    borderWidth: 1,
    borderRadius: 10,
  },
  dropdownText: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
  },
});

