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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WithdrawFunds = ({ route, navigation }) => {
  const { client } = route.params;
  const [balance, setBalance] = useState('0');
  const [amount, setAmount] = useState('');
  const [agentId, setAgentId] = useState('');

  useEffect(() => {
    const fetchAgentId = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('user');
        const user = JSON.parse(savedUser);
        setAgentId(user?.id);
      } catch (error) {
        console.error('Failed to fetch agent ID:', error);
      }
    };

    const fetchBalance = async () => {
      try {
        const response = await axios.post(
          'https://gcnm.wigal.com.gh/verifycustomer',
          { customerphonenumber: client.phonenumber },
          {
            headers: {
              'API-KEY': 'muJFx9F3E5ptBExkz8Fqroa1D79gv9Nv',
            },
          }
        );
        if (response.status === 200 && response.data.statuscode === '00') {
          setBalance(response.data.data.balance); // Update balance state
        } else {
          setBalance('0'); // Show 0 if customer has no account
        }
      } catch (error) {
        setBalance('0'); // Show 0 in case of an error
      }
    };

    fetchAgentId();
    fetchBalance();
  }, [client.customerId]);

  const handleWithdraw = async () => {
    if (!amount) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    // Convert balance and amount to numbers and compare
    const numericBalance = parseFloat(balance);
    const numericAmount = parseFloat(amount);

    if (numericAmount > numericBalance) {
      Alert.alert('Error', 'Insufficient balance.');
      return;
    }

    try {
      const response = await axios.post('https://gcnm.wigal.com.gh/withdrawingfunds', {
        agent_id: agentId,
        customer_id: client.clientid,
        amount: amount,
        wallet: client.wallet_number,
        paymentoption: client.payment_option,
      }, {
        headers: {
          'API-KEY': 'muJFx9F3E5ptBExkz8Fqroa1D79gv9Nv',
        }
      });

      Alert.alert('Success', 'withdrawal request has been initiated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to withdraw funds.');
      console.error('Error withdrawing funds:', error);
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
          
          <View style={styles.clientCard}>
            <View style={styles.clientIconContainer}>
              <Icon name="person" size={40} color="#fff" />
            </View>
            <View style={styles.clientInfo}>
              <Text style={styles.clientName}>{client.name}</Text>
              <Text style={styles.clientPhone}>{client.phonenumber}</Text>
              <Text style={styles.clientAmount}>GH₵ {balance}</Text>
            </View>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.formLabel}>Enter Amount to Withdraw</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              onChangeText={(text) => setAmount(text)}
              keyboardType="numeric"
              placeholderTextColor="#a0a0a0"
            />

            <TouchableOpacity style={styles.withdrawButton} onPress={handleWithdraw}>
              <Text style={styles.buttonText}>Withdraw</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
    textAlign: 'center',
  },
  clientCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clientIconContainer: {
    backgroundColor: '#e74c3c',
    borderRadius: 50,
    padding: 15,
    marginRight: 15,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  clientPhone: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
  },
  clientAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
    marginTop: 10,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dcdde1',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  withdrawButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#ecf0f1',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#e74c3c',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WithdrawFunds;
