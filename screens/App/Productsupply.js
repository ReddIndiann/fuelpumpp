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
    Modal,
  } from 'react-native';
  import React, { useState } from 'react';
  import Icon from 'react-native-vector-icons/MaterialIcons';
  import RNPickerSelect from 'react-native-picker-select';
  import DateTimePicker from '@react-native-community/datetimepicker';
  
  const ProductSupply = () => {
    const [productType, setProductType] = useState('');
    const [vehicleArrivalDate, setVehicleArrivalDate] = useState(new Date());
    const [deliveryDate, setDeliveryDate] = useState(new Date());
    const [quantityDelivered, setQuantityDelivered] = useState('');
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [driverName, setDriverName] = useState('');
    const [driverNumber, setDriverNumber] = useState('');
    const [showVehicleArrivalDatePicker, setShowVehicleArrivalDatePicker] = useState(false);
    const [showDeliveryDatePicker, setShowDeliveryDatePicker] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
  
    const { width } = useWindowDimensions();
    const isTablet = width >= 768;
  
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
  
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Product Supply</Text>
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
              />
            )}
  
            <Text style={styles.label}>Enter Delivery Date</Text>
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
                onPress={() => setIsModalVisible(true)}
              >
                <Text style={styles.signInText}>Save</Text>
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
    buttonContainer: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      marginVertical: 20,
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
    signInText: {
      color: '#FFFFFF',
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
      fontWeight: "bold"
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
  