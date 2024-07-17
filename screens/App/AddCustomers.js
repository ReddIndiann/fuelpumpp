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
  Alert,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

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
      <Text>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.dropdownContainer}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.dropdownButton} onPress={toggleDropdown}>
        <Text style={styles.dropdownButtonText}>
          {(selected && selected.label) || "Select your ID card type"}
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
              keyExtractor={(item) => item.value}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const AddCustomers = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [alternativePhoneNumber, setAlternativePhoneNumber] = useState('');
  const [idCardNumber, setIdCardNumber] = useState('');
  const [idCardType, setIdCardType] = useState('');
  const [walletNumber, setWalletNumber] = useState('');
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const navigation = useNavigation();

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
    setIsButtonEnabled(!!(name && phoneNumber && email && idCardNumber && walletNumber && idCardType));
  }, [name, phoneNumber, email, idCardNumber, walletNumber, idCardType]);

  const handleAddClient = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('user');
      const user = JSON.parse(savedUser);
      const userId = user?.id; // Adjust this based on your user object structure
      console.log('User ID:', userId);

      if (!userId) {
        throw new Error('User ID not found');
      }

      const response = await axios.post('https://gcnm.wigal.com.gh/savecustomer', {
        name,
        email,
        phonenumber: phoneNumber,
        alternative_phonenumber: alternativePhoneNumber,
        id_card_type: idCardType.value,
        agent_id: userId,
        id_card_number: idCardNumber,
        wallet_number: walletNumber
      });
      console.log('Data posted successfully:', response.data);

      Alert.alert(
        'Success',
        'Customer added successfully',
        [
          { text: 'OK', onPress: () => navigation.navigate('Customers') }
        ]
      );

    } catch (error) {
      console.error('Error posting data:', error);
      setIsModalVisible(true);
    }
  };

  const idCardTypes = [
    { label: 'Ghana Card', value: 'ghana_card' },
    { label: 'ID Card Type 2', value: 'id_card_type_2' },
    { label: 'ID Card Type 3', value: 'id_card_type_3' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : keyboardOpen ? 'height' : null}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Add New Customer</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              placeholder="Enter your name"
              value={name}
              onChangeText={(text) => setName(text)}
              style={styles.input}
              placeholderTextColor="#a0a0a0"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="Enter Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={styles.input}
              placeholderTextColor="#a0a0a0"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChangeText={(text) => setPhoneNumber(text)}
              style={styles.input}
              placeholderTextColor="#a0a0a0"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Alternative Phone Number</Text>
            <TextInput
              placeholder="Enter alternative phone number"
              value={alternativePhoneNumber}
              onChangeText={(text) => setAlternativePhoneNumber(text)}
              style={styles.input}
              placeholderTextColor="#a0a0a0"
              keyboardType="phone-pad"
            />
          </View>

          <Dropdown
            label="ID Card Type"
            data={idCardTypes}
            onSelect={setIdCardType}
          />

          <View style={styles.formGroup}>
            <Text style={styles.label}>ID Card Number</Text>
            <TextInput
              placeholder="Id card number"
              value={idCardNumber}
              onChangeText={(text) => setIdCardNumber(text)}
              style={styles.input}
              placeholderTextColor="#a0a0a0"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Wallet Number</Text>
            <TextInput
              placeholder="Enter wallet number"
              value={walletNumber}
              onChangeText={(text) => setWalletNumber(text)}
              style={styles.input}
              placeholderTextColor="#a0a0a0"
                 keyboardType="phone-pad"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, !isButtonEnabled && styles.buttonDisabled]}
            onPress={handleAddClient}
            disabled={!isButtonEnabled}
          >
            <Text style={styles.buttonText}>Add Customer</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setIsModalVisible(false)}>
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.modalMessage}>Failed to add Customer</Text>
          </View>
        </View>
      </Modal>
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
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  select: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#007B5D',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#a0a0a0',
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    maxHeight: 300,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#D32F2F',
    borderRadius: 8,
    padding: 20,
    width: '90%',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalMessage: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AddCustomers;
