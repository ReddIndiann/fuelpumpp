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
  Alert
} from 'react-native';
import { Select, SelectItem } from '@ui-kitten/components';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ModalDropdown from 'react-native-modal-dropdown';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

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
        id_card_type: idCardType,
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

          <View style={styles.formGroup}>
            <Text style={styles.label}>ID Card Type</Text>
            <Select
              style={styles.select}
              selectedIndex={idCardType}
              onSelect={(index) => setIdCardType(index)}
              value={idCardType || 'Select your ID card type'}
            >
              <SelectItem title="Ghana Card" />
              <SelectItem title="ID Card Type 2" />
              <SelectItem title="ID Card Type 3" />
            </Select>
          </View>

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