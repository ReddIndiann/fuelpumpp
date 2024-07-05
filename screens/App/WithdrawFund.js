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
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WithdrawFunds = ({ route, navigation }) => {
  const { client } = route.params; // Get client data from navigation params

  const [amount, setAmount] = useState('');
  const [agentId, setAgentId] = useState('');
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  useEffect(() => {
    const fetchAgentId = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('user');
        const user = JSON.parse(savedUser);
        setAgentId(user?.id); // Adjust this based on your user object structure
      } catch (error) {
        console.error('Failed to fetch agent ID:', error);
      }
    };

    fetchAgentId();
  }, []);

  const handleWithdraw = async () => {
    try {
      const response = await axios.post('https://gcnm.wigal.com.gh/withdrawingfunds', {
        agent_id: agentId,
        customer_id: client.clientid, // Fetch customer ID from client data
        amount: amount,
        wallet: client.wallet_number, // Fetch wallet from client data
        paymentoption: client.payment_option, // Fetch payment option from client data
      }, {
        headers: {
          'API-KEY': 'muJFx9F3E5ptBExkz8Fqroa1D79gv9Nv',
        }
      });

      Alert.alert('Success', 'Withdrawal successful.', [
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

          {/* Client Information Card */}
          <View style={styles.clientCard}>
            <View style={styles.clientCardHeader}>
              <Icon name="person" size={40} color="#fff" style={styles.clientIcon} />
              <View>
                <Text style={styles.clientName}>{client.name}</Text>
                <Text style={styles.clientPhone}>{client.phoneNumber}</Text>
                <Text style={styles.clientAmount}>{client.amount}</Text>
              </View>
            </View>
          </View>

          {/* Withdraw Funds Form */}
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

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleWithdraw}
            >
              <Text style={styles.signInText}>Withdraw</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button1}
              onPress={() => navigation.goBack()}
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
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginVertical: 20,
    marginTop: 150,
  },
});
