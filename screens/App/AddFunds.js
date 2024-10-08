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

const AddFunds = ({ route, navigation }) => {
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
          setBalance(response.data.data.balance);
        } else {
          setBalance('0');
        }
      } catch (error) {
        setBalance('0');
      }
    };

    fetchAgentId();
    fetchBalance();
  }, [client.customerId]);

  const handleAddFunds = () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount greater than 0.');
      return;
    }
    const data = {
      agent_id: agentId,
      customer_id: client.clientid,
      amount: amount,
      wallet: client.wallet_number,
      paymentoption: client.payment_option,
    };

    axios.post('https://gcnm.wigal.com.gh/loadfunds', data, {
      headers: {
        'API-KEY': 'muJFx9F3E5ptBExkz8Fqroa1D79gv9Nv',
      }
    })
      .then(response => {
        Alert.alert("Success", "A prompt has been sent to the customer's phone to complete the payment", [
          { text: "OK", onPress: () =>  navigation.navigate('DepositList', { customerId: client.id }) }
        ]);
      })
      .catch(error => {
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
            <Text style={styles.formLabel}>Enter Amount</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              onChangeText={(text) => setAmount(text)}
              keyboardType="numeric"
              placeholderTextColor="#a0a0a0"
            />

            <TouchableOpacity style={styles.addButton} onPress={handleAddFunds}>
              <Text style={styles.buttonText}>Add Funds</Text>
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
    backgroundColor: '#2ecc71',
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
  addButton: {
    backgroundColor: '#2ecc71',
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

export default AddFunds;