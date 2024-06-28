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
import ModalDropdown from 'react-native-modal-dropdown';
import axios from 'axios';

const Clients = () => {
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
      const response = await axios.post('https://gcnm.wigal.com.gh/savecustomer', {
        name,
        email,
        phonenumber: phoneNumber,
        alternative_phonenumber: alternativePhoneNumber,
        id_card_type: idCardType,
        agent_id: "2",
        id_card_number: idCardNumber,
        wallet_number: walletNumber
      });
      console.log('Data posted successfully:', response.data);
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
          <Text style={styles.title}>Add Clients</Text>
          <Text style={styles.pageinfo}>
            aliqua
          </Text>
          <Text style={styles.label}>Add New Client</Text>
          <Text style={styles.label}>Enter Name</Text>
          <TextInput
            placeholder="Enter your name"
            value={name}
            onChangeText={(text) => setName(text)}
            style={styles.input}
            placeholderTextColor="#a0a0a0"
          />
          <Text style={styles.label}>Enter Email</Text>
          <TextInput
            placeholder="Enter Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
            placeholderTextColor="#a0a0a0"
          />
          <Text style={styles.label}>Enter Phone Number</Text>
          <TextInput
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChangeText={(text) => setPhoneNumber(text)}
            style={styles.input}
            placeholderTextColor="#a0a0a0"
          />
          <Text style={styles.label}>Enter Alternative Phone Number</Text>
          <TextInput
            placeholder="Enter alternative phone number"
            value={alternativePhoneNumber}
            onChangeText={(text) => setAlternativePhoneNumber(text)}
            style={styles.input}
            placeholderTextColor="#a0a0a0"
          />
          <Text style={styles.label}>Select ID card type</Text>
          <View style={styles.inputContainer}>
            <ModalDropdown
              options={['ghana_card', 'ID Card Type 2', 'ID Card Type 3']}
              defaultValue="Select your ID card type"
              style={styles.dropdown}
              textStyle={styles.dropdownText}
              dropdownTextStyle={styles.dropdownListText}
              onSelect={(index, value) => setIdCardType(value)}
            />
            <TouchableOpacity>
              <Icon size={24} color="#a0a0a0" />
            </TouchableOpacity>
          </View>
          <Text style={styles.label}>Enter ID Card Number</Text>
          <TextInput
            placeholder="Id card number"
            value={idCardNumber}
            onChangeText={(text) => setIdCardNumber(text)}
            style={styles.input}
            placeholderTextColor="#a0a0a0"
          />
          <Text style={styles.label}>Enter Wallet Number</Text>
          <TextInput
            placeholder="Enter wallet number"
            value={walletNumber}
            onChangeText={(text) => setWalletNumber(text)}
            style={styles.input}
            placeholderTextColor="#a0a0a0"
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, !isButtonEnabled && styles.buttonDisabled, isTablet && styles.tabletButton]}
              onPress={handleAddClient}
              disabled={!isButtonEnabled}
            >
              <Text style={styles.signInText}>Add Client</Text>
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
            <Text style={styles.modalMessage}>Failed to add client</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Clients;

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
    alignSelf: 'flex-start',
    marginLeft: "6%",
  },
  pageinfo: {
    fontSize: 20,
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  input: {
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
    width: '90%',
    height: 50,
    borderRadius: 10,
    fontSize: 18,
    paddingLeft: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#a0a0a0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdown: {
    flex: 1,
  },
  dropdownText: {
    fontSize: 18,
    color: '#000',
  },
  dropdownListText: {
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
    marginBottom: 15,
    borderRadius: 10,
    marginRight: 20,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a0a0a0',
    borderColor: '#a0a0a0',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});