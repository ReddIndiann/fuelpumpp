import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ExistingClientTransaction = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { client } = route.params;
  const [agentId, setAgentId] = useState('');
  const [balance, setBalance] = useState('0');
  const [fadeAnim] = useState(new Animated.Value(0));

  const isAccountOpen = client.account_status === "open";

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

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
  }, [client.phonenumber]);

  const handleCloseAccount = () => {
    Alert.alert(
      'Confirm Account Closure',
      'Are you sure you want to close this account?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => closeAccount(),
        },
      ],
      { cancelable: false }
    );
  };

  const closeAccount = async () => {
    try {
      const response = await axios.post(
        'https://gcnm.wigal.com.gh/closingingaccount',
        {
          agent_id: agentId,
          customer_id: client.clientid,
        },
        {
          headers: {
            'API-KEY': 'muJFx9F3E5ptBExkz8Fqroa1D79gv9Nv',
          },
        }
      );
      if (response.status === 200) {
        Alert.alert('Success', 'Account closed successfully');
        navigation.navigate('Client');
      } else {
        Alert.alert('Error', 'Failed to close account');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to close account');
    }
  };

  const ActionButton = ({ icon, text, color, onPress, disabled }) => (
    <TouchableOpacity 
      style={[
        styles.actionButton, 
        { backgroundColor: color },
        disabled && styles.disabledButton
      ]} 
      onPress={onPress}
      disabled={disabled}
    >
      <Icon name={icon} size={28} color={disabled ? "#ccc" : "#fff"} />
      <Text style={[styles.actionButtonText, disabled && styles.disabledText]}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Client Transactions</Text>

          <Animated.View style={[styles.clientCard, { opacity: fadeAnim }]}>
            <View style={styles.clientCardHeader}>
              <View style={styles.clientIconContainer}>
                <Icon name="person" size={40} color="#fff" />
              </View>
              <View style={styles.clientInfo}>
                <Text style={styles.clientName}>{client.name}</Text>
                <Text style={styles.clientPhone}>{client.phonenumber}</Text>
                <Text style={styles.clientAmount}>GH₵ {balance}</Text>
                <Text style={styles.accountStatus}>
                  Status: {client.account_status}
                </Text>
              </View>
            </View>
          </Animated.View>

          <View style={styles.actionsContainer}>
            <ActionButton
              icon="local-gas-station"
              text="Dispense Fuel"
              color="#3498db"
              onPress={() => navigation.navigate('DisburementList', { client })}
              disabled={!isAccountOpen}
            />
            <ActionButton
              icon="attach-money"
              text="Add Funds"
              color="#2ecc71"
              onPress={() => navigation.navigate('addfunds', { client })}
              disabled={!isAccountOpen}
            />
            <ActionButton
              icon="remove-circle"
              text="Withdraw Funds"
              color="#e74c3c"
              onPress={() => navigation.navigate('withdrawfund', { client })}
              disabled={!isAccountOpen}
            />
            <ActionButton
              icon="close"
              text="Close Account"
              color="#95a5a6"
              onPress={handleCloseAccount}
              disabled={!isAccountOpen}
            />
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
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
  },
  clientCard: {
    borderRadius: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clientCardHeader: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  clientIconContainer: {
    backgroundColor: '#3498db',
    borderRadius: 50,
    padding: 15,
    marginRight: 15,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  clientPhone: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 5,
  },
  clientAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#27ae60',
    marginTop: 10,
  },
  accountStatus: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 5,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 5,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#ccc',
  },
});

export default ExistingClientTransaction;