import React, { useState } from 'react';
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
import ModalDropdown from 'react-native-modal-dropdown';
import axios from 'axios';

const AddFunds = ({ route }) => {
  const { client } = route.params; // Get client data from navigation params

  const [amount, setAmount] = useState('');
  const [wallet, setWallet] = useState('');
  const [paymentOption, setPaymentOption] = useState('');
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const handleAddFunds = () => {
    const data = {
      agent_id: '2',
      customer_id: '26', // Replace with actual IDs or fetch from client data
      amount: amount,
      wallet: wallet,
      paymentoptionload: paymentOption,
    };

    axios.post('https://gcnm.wigal.com.gh/loadfunds', data)
      .then(response => {
        // Handle success
        Alert.alert('Success', 'Funds added successfully.');
      })
      .catch(error => {
        // Handle error
        Alert.alert('Error', 'Failed to add funds.');
        console.error(error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Add Funds</Text>

          {/* Client Information Card */}
          <View style={styles.clientCard}>
            <View style={styles.clientCardHeader}>
              <Icon name="person" size={40} color="#fff" style={styles.clientIcon} />
              <View>
                <Text style={styles.clientName}>{client.name}</Text>
                <Text style={styles.clientPhone}>{client.phoneNumber}</Text>
                <Text style={styles.clientAmount}>$35,078</Text>
              </View>
            </View>
          </View>

          {/* Add Funds Form */}
          <Text style={styles.label}>Enter Amount</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Enter amount"
              onChangeText={(text) => setAmount(text)}
              style={[styles.inputt, { flex: 1, borderColor: '#FFFFFF' }]}
              placeholderTextColor="#a0a0a0"
              keyboardType="numeric"
            />
          </View>

          {/* Select Wallet Dropdown */}
          <Text style={styles.label}>Select Wallet</Text>
          <View style={styles.inputContainer}>
            <ModalDropdown 
              options={['3', 'Another Wallet']} 
              style={styles.dropdown}
              textStyle={styles.dropdownText}
              dropdownStyle={styles.dropdownMenu}
              onSelect={(index, value) => setWallet(value)}
            />
          </View>

          {/* Select Payment Method Dropdown */}
          <Text style={styles.label}>Select Payment Method</Text>
          <View style={styles.inputContainer}>
            <ModalDropdown 
              options={['MTN', 'Vodafone']} 
              style={styles.dropdown}
              textStyle={styles.dropdownText}
              dropdownStyle={styles.dropdownMenu}
              onSelect={(index, value) => setPaymentOption(value)}
            />
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleAddFunds}
            >
              <Text style={styles.signInText}>Add Funds</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button1}
            >
              <Text style={styles.signUpText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddFunds;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '300',
    marginBottom: 20,
  },
  clientCard: {
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 20,
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
  },
  clientCardHeader: {
    flexDirection: 'row',
    borderRadius: 20,
    alignItems: 'center',
  },
  button: {
    width: 330,
    height: 50,
    backgroundColor: '#FAAD14',
    justifyContent: 'center',
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
  signUpText: {
    fontSize: 17,
    color: "#DC2626"
  },
  button1: {
    width: 330,
    height: 50,
    borderColor: '#DC2626',
    justifyContent: 'center',
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
  },
  clientIcon: {
    backgroundColor: '#4680FF',
    borderRadius: 20,
    paddingHorizontal: 30,
    paddingVertical: 40,
    marginRight: 15,
  },
  clientName: {
    fontSize: 25,
    fontWeight: '300',
  },
  clientPhone: {
    fontSize: 18,
    fontWeight: "bold",
  },
  clientAmount: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 5,
  },
  label: {
    fontSize: 20,
    marginBottom: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#a0a0a0',
    paddingHorizontal: 1,
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
  inputContainer: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    fontSize: 18,
    paddingLeft: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#a0a0a0',
  },
  dropdown: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
  },
  dropdownText: {
    fontSize: 18,
    color: '#000',
  },
  dropdownMenu: {
    width: '100%',
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginVertical: 20,
    marginTop: 150,
  },
});