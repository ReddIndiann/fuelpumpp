import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Alert,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';

const ExistingClientTransaction = () => {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const route = useRoute();
  const { client } = route.params;

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
          client_id: client.id,
          customer_id: client.customerId,
          location_id: client.locationId,
          paymentoption: "MTN",
        },
        {
          headers: {
            'API-KEY': 'muJFx9F3E5ptBExkz8Fqroa1D79gv9Nv',
          },
        }
      );
      if (response.status === 200) {
        Alert.alert('Success', 'Account closed successfully');
        navigation.navigate('Main');
      } else {
        Alert.alert('Error', 'Failed to close account');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to close account');
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Existing Client Transactions</Text>
          
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

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionButtonBlue}
              onPress={() => navigation.navigate('dispensefuel', { client })}
            >
              <Icon name="local-gas-station" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>Dispense Fuel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButtonYellow}
              onPress={() => navigation.navigate('addfunds', { client })}
            >
              <Icon name="attach-money" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>Add Funds</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButtonGreen}
              onPress={() => navigation.navigate('redrawfund', { client })}
            >
              <Icon name="remove-circle" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>Withdraw Funds</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButtonRed}
              onPress={handleCloseAccount}
            >
              <Icon name="close" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>Close Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ExistingClientTransaction;

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
    fontSize: 24,
    fontWeight: 'bold',
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
  clientIcon: {
    backgroundColor: '#4680FF',
    borderRadius: 20,
    paddingHorizontal: 30,
    paddingVertical: 40,
    marginRight: 15,
  },
  clientName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  clientPhone: {
    fontSize: 16,
    color: '#777',
  },
  clientAmount: {
    fontSize: 18,
    color: '#007B5D',
    marginTop: 5,
  },
  actionsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButtonBlue: {
    flexDirection: 'column',
    backgroundColor: '#4680FF',
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  actionButtonYellow: {
    flexDirection: 'column',
    backgroundColor: '#FFC107',
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  actionButtonGreen: {
    flexDirection: 'column',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  actionButtonRed: {
    flexDirection: 'column',
    backgroundColor: '#F44336',
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
});
