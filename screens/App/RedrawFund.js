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


const WithdrawFunds = ({ route }) => {
  const { client } = route.params; // Get client data from navigation params

  const [searchQuery, setSearchQuery] = useState('');
  const [amount, setAmount] = useState('');
  const [wallet, setWallet] = useState('');
  const [paymentOption, setPaymentOption] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage] = useState(5);
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

 
  const handleWithdraw = async () => {
    try {
      const response = await axios.post('https://gcnm.wigal.com.gh/withdrawingfunds', {
        agent_id: "2",
        customer_id: "20",
        amount,
        wallet,
        paymentoption: paymentOption
      });
      console.log('Withdrawal successful:', response.data);
      // Handle success (e.g., show a success message or navigate to another screen)
    } catch (error) {
      console.error('Error withdrawing funds:', error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Withdraw Funds</Text>
          
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

          <Text style={styles.title}>Withdraw Funds</Text>
         
          <Text style={styles.label}>Enter Amount</Text>
          
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="enter amount"
              onChangeText={(text) => setAmount(text)}
              style={[styles.inputt, { flex: 1, borderColor: '#FFFFFF' }]}
              placeholderTextColor="#a0a0a0"
            />
          </View>

          <Text style={styles.label}>Select Wallet</Text>
          
          
            <ModalDropdown 
              options={['3', 'Another Wallet']} 
              style={styles.dropdown}
              textStyle={styles.dropdownText}
              dropdownStyle={styles.dropdownMenu}
              onSelect={(index, value) => setWallet(value)}
            />
        

          <Text style={styles.label}>Select Payment Method</Text>
          
          
            <ModalDropdown 
              options={['MTN', 'Vodafone']} 
              style={styles.dropdown}
              textStyle={styles.dropdownText}
              dropdownStyle={styles.dropdownMenu}
              onSelect={(index, value) => setPaymentOption(value)}
            />
       
        
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button]}
              onPress={handleWithdraw}
            >
              <Text style={styles.signInText}>Withdraw</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button1]}
            >
              <Text style={styles.signUpText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default WithdrawFunds;

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
  actionsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButtonBlue: {
    flex: 1,
    backgroundColor: '#007B5D',
    paddingHorizontal: 10,
    paddingVertical: 25,
    borderRadius: 20,
    marginBottom: 10,
    marginRight: 5,
    alignItems: 'center',
  },
  actionButtonYellow: {
    flex: 1,
    backgroundColor: '#FFC107',
    paddingHorizontal: 10,
    paddingVertical: 25,
    borderRadius: 20,
    marginBottom: 10,
    marginRight: 5,
    alignItems: 'center',
  },
  actionButtonOrange: {
    flex: 1,
    backgroundColor: '#FF9800',
    paddingHorizontal: 10,
    paddingVertical: 25,
    borderRadius: 20,
    marginBottom: 10,
    marginRight: 5,
    alignItems: 'center',
  },
  actionButtonRed: {
    flex: 1,
    backgroundColor: '#F44336',
    paddingHorizontal: 10,
    paddingVertical: 25,
    borderRadius: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  label: {
    fontSize: 20,
    marginBottom: 10,
  },
  searchInput: {
    height: 50,
    borderColor: '#a0a0a0',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 15,
    marginBottom: 20,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#a0a0a0',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 15,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tableRowText: {
    flex: 1,
    fontSize: 16,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  paginationButton: {
    marginHorizontal: 5,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  activePaginationButton: {
    backgroundColor: '#007B5D',
  },
  paginationButtonText: {
    fontSize: 16,
  },
  activePaginationButtonText: {
    color: '#fff',
  },
  pageinfo: {
    fontSize: 20,
    alignSelf: 'flex-start',
    marginLeft: 20,
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
    width: '100%',
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
    marginTop: 150,
  },
  dropdown: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    paddingLeft: 15,
    borderWidth: 1,
    borderColor: '#a0a0a0',
    borderRadius: 10,
  },
  dropdownText: {
    fontSize: 18,
    color: '#000',
  },
  dropdownMenu: {
    width: '90%',
    marginTop: 5,
  },
});