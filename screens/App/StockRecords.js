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
  import React, { useState, useEffect } from 'react';
  import Icon from 'react-native-vector-icons/MaterialIcons';
  import DateTimePicker from '@react-native-community/datetimepicker';
  import RNPickerSelect from 'react-native-picker-select';
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
    const [showDeliveryDatePicker, setShowDeliveryDatePicker] = useState(false);
    const navigateToScreen = useNavigateToScreen();
    const { width } = useWindowDimensions();
  
    const isTablet = width >= 768;
  
    const togglePasswordVisibility = () => {
      setPasswordVisible(!passwordVisible);
    };
  
    
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
  
    useEffect(() => {
      if (email && password) {
        setIsButtonEnabled(true);
      } else {
        setIsButtonEnabled(false);
      }
    }, [email, password]);
  
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Stock Records</Text>
            <Text style={styles.pageinfo}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
            </Text>
            <Text style={styles.label}>Select Product Type</Text>
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


<TouchableOpacity >
                <Icon size={24} color="#a0a0a0" />
              </TouchableOpacity>
              
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
            
            <View style={styles.passwordContainer}>
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
            
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Enter quantity"
                value={password}
                onChangeText={(text) => setPassword(text)}
                style={[styles.inputt, { flex: 1, borderColor: '#FFFFFF' }]}
                keyboardType='numeric'
                placeholderTextColor="#a0a0a0"
              />
              <TouchableOpacity >
                <Icon name='' size={24} color="#a0a0a0" />
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>Enter Dispenser Quantity</Text>
            
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Enter quantity"
                value={password}
                onChangeText={(text) => setPassword(text)}
                style={[styles.inputt, { flex: 1, borderColor: '#FFFFFF' }]}
                secureTextEntry={!passwordVisible}
                placeholderTextColor="#a0a0a0"
                keyboardType='numeric'
              />
             <TouchableOpacity >
                <Icon name='' size={24} color="#a0a0a0" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, !isButtonEnabled && styles.buttonDisabled, isTablet && styles.tabletButton]}
                
                disabled={!isButtonEnabled}
              >
                <Text style={styles.signInText}>Log in</Text>
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
    forgotpassword: {
      fontSize: 18,
      alignSelf: 'flex-start',
      marginLeft: 20,
    },
    pageinfo: {
      fontSize: 20,
      alignSelf: 'flex-start',
      marginLeft: 20,
      marginBottom: 20,
    }, inputContainer: {
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
      marginBottom:15,
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