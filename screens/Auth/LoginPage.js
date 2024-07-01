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
  
  const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [keyboardOpen, setKeyboardOpen] = useState(false);
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(true);
  
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
            <Text style={styles.title}>Log in</Text>
            <Text style={styles.pageinfo}>
              Welcome! Please login to access your account and unlock a world of fuel management convenience
            </Text>
            <TextInput
              placeholder="E-mail address"
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={styles.input}
              placeholderTextColor="#a0a0a0"
            />
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={(text) => setPassword(text)}
                style={[styles.inputt, { flex: 1, borderColor: '#FFFFFF' }]}
                secureTextEntry={!passwordVisible}
                placeholderTextColor="#a0a0a0"
              />
              <TouchableOpacity onPress={togglePasswordVisibility}>
                <Icon name={passwordVisible ? 'visibility' : 'visibility-off'} size={24} color="#a0a0a0" />
              </TouchableOpacity>
            </View>
            <Pressable style={styles.forgotpassword} onPress={() => navigateToScreen('ForgetPassword')}>
              <Text style={styles.forgotpassword}>Forgot password?</Text>
            </Pressable>
            <View style={[styles.buttonContainer, keyboardOpen && styles.buttonContainerKeyboardOpen]}>
              <TouchableOpacity
                style={[styles.button, !isButtonEnabled && styles.buttonDisabled, isTablet && styles.tabletButton]}
                onPress={handleLogin}
                disabled={!isButtonEnabled}
              >
                <Text style={styles.signInText}>Log in</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button1, isTablet && styles.tabletButton1]}
                onPress={() => navigateToScreen('onBoard')}
              >
                <Text style={styles.signUpText}>Sign up with Google</Text>
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
  
  export default LoginPage;
  
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
      marginTop: 300,
      marginVertical: 20,
    },
    buttonContainerKeyboardOpen: {
      marginTop: 10,
    },
    button: {
      width: 300,
      height: 50,
      borderColor: '#02B2DD',
      backgroundColor: '#007B5D',
      borderWidth: 1,
      justifyContent: 'center',
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
  