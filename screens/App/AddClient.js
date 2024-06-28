


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
  Pressable,
  Modal,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useNavigateToScreen } from '../../hooks/useNavigateToScreen';

const Clients = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const navigateToScreen = useNavigateToScreen();
  const { width } = useWindowDimensions();

  const isTablet = width >= 768;

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = () => {
    // Mock login logic
    if (password !== 'correctPassword') { // Replace with your actual login logic
      setIsModalVisible(true);
    } else {
      navigateToScreen('login');
    }
  };

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
    if (email && password) {
      setIsButtonEnabled(true);
    } else {
      setIsButtonEnabled(false);
    }
  }, [email, password]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Clients</Text>
          <Text style={styles.pageinfo}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
          </Text>
          <Text style={styles.label}>Add New Client</Text>
          <Text style={styles.label}>Enter Name</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Enter your name"
              value={password}
              onChangeText={(text) => setPassword(text)}
              style={[styles.inputt, { flex: 1, borderColor: '#FFFFFF' }]}
              secureTextEntry={!passwordVisible}
              placeholderTextColor="#a0a0a0"
            />
            
          </View>
          <Text style={styles.label}>Enter Phone Number</Text>
        
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Enter your phone number"
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={[styles.inputt, { flex: 1, borderColor: '#FFFFFF' }]}
            secureTextEntry={!passwordVisible}
            placeholderTextColor="#a0a0a0"
          />
        
        </View>
        <Text style={styles.label}>Enter Alternative Phone Number</Text>
        
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Enter Alternative Phone Number"
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={[styles.inputt, { flex: 1, borderColor: '#FFFFFF' }]}
            secureTextEntry={!passwordVisible}
            placeholderTextColor="#a0a0a0"
          />
        
        </View>
        <Text style={styles.label}>Select ID Type</Text>
        
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Select ID Type"
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={[styles.inputt, { flex: 1, borderColor: '#FFFFFF' }]}
            secureTextEntry={!passwordVisible}
            placeholderTextColor="#a0a0a0"
          />
       
        </View>
        <Text style={styles.label}>Enter ID Number</Text>
        
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Enter ID Number"
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={[styles.inputt, { flex: 1, borderColor: '#FFFFFF' }]}
            secureTextEntry={!passwordVisible}
            placeholderTextColor="#a0a0a0"
          />
          
        </View>
        <Text style={styles.label}>Enter Residential Address</Text>
        
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Enter Residential Address"
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={[styles.inputt, { flex: 1, borderColor: '#FFFFFF' }]}
            secureTextEntry={!passwordVisible}
            placeholderTextColor="#a0a0a0"
          />
      
        </View>
        <Text style={styles.label}>Select Mobile Wallet</Text>
        
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Select Mobile Wallet"
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={[styles.inputt, { flex: 1, borderColor: '#FFFFFF' }]}
            secureTextEntry={!passwordVisible}
            placeholderTextColor="#a0a0a0"
          />
          
        </View>
      
        <Text style={styles.label}>Enter Wallet Number</Text>
        
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Enter Wallet Number"
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={[styles.inputt, { flex: 1, borderColor: '#FFFFFF' }]}
            secureTextEntry={!passwordVisible}
            placeholderTextColor="#a0a0a0"
          />
         
        </View>
      
       
       
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, !isButtonEnabled && styles.buttonDisabled, isTablet && styles.tabletButton]}
              onPress={handleLogin}
              disabled={!isButtonEnabled}
            >
              <Text style={styles.signInText}>Log in</Text>
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
            <Text style={styles.modalMessage}>The password or the e-mail address is incorrect</Text>
            
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
      alignSelf: "flex-start",
      marginLeft: "6%",
    },
  forgotpassword: {
    fontSize: 18,
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  pageinfo: {
    fontSize: 20,
    alignSelf: 'flex-start',
    marginLeft: 20,
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
    width: '90%',
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
  },
  buttonContainerKeyboardOpen: {
    marginTop: 10,
  },
  button: {
    width: 320,
    height: 50,
    borderColor: '#02B2DD',
    backgroundColor: '#007B5D',
    borderWidth: 1,
    justifyContent: 'center',
    marginBottom:15,
    borderRadius: 10,
    marginRight: 20,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a0a0a0',
    borderColor: '#a0a0a0',
  },
  button1: {
    width: 300,
    height: 50,
    justifyContent: 'center',
    marginTop: 10,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
  },
  tabletButton: {
    width: 240,
    height: 80,
  },
  tabletButton1: {
    width: 240,
    height: 80,
    backgroundColor: '#02B2DD',
  },
  signInText: {
    color: '#FFFFFF',
    fontSize: 17,
  },
  signUpText: {
    fontSize: 17,
  },
  modalOverlay: {
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',
  
    marginTop:300
  },
  modalContainer: {
    width: '90%',
marginRight:10,
backgroundColor: '#D32F2F',
    borderRadius: 10,
    alignItems: 'center',
    flexDirection:"row",
    padding:10
  
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
    fontWeight:"bold"
  },
  modalButton: {
    width: '100%',
    padding: 10,
    backgroundColor: '#007B5D',
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
