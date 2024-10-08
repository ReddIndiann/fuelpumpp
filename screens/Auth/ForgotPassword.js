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

  
  const ForgotPassword = () => {
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
      if (email ) {
        setIsButtonEnabled(true);
      } else {
        setIsButtonEnabled(false);
      }
    }, [email]);
  
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Forgot your password?</Text>
            <Text style={styles.pageinfo}>
            Please provide us with the email address associated with your account. We will sent an email to help you reset your password.
            </Text>
           
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="E-mail address"
                value={email}
                onChangeText={(text) => setEmail(text)}
                style={[styles.inputt, { flex: 1, borderColor: '#FFFFFF' }]}
              
                placeholderTextColor="#a0a0a0"
              />
              <TouchableOpacity onPress={togglePasswordVisibility}>
                <Icon name={passwordVisible ? 'visibility' : 'visibility-off'} size={24} color="#a0a0a0" />
              </TouchableOpacity>
            </View>
       
            <View style={[styles.buttonContainer, keyboardOpen && styles.buttonContainerKeyboardOpen]}>
              <TouchableOpacity
                style={[styles.button, !isButtonEnabled && styles.buttonDisabled, isTablet && styles.tabletButton]}
                onPress={() => navigateToScreen('ResetPassword')}
                disabled={!isButtonEnabled}
              >
                <Text style={styles.signInText}>Recover account</Text>
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
            <View
              style={styles.closeButton}
           
            >
<Text style={styles.modalheader}>Request sent.</Text>
            </View>
           
            <Text style={styles.modalMessage}>An email has been sent to your registered email address with instructions to help you recover your password. Please check your inbox and follow the provided steps to regain access to your account.</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      </SafeAreaView>
    );
  };
  
  export default ForgotPassword;
  
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
      marginTop: 400,
      marginVertical: 20,
    },
    buttonContainerKeyboardOpen: {
      marginTop: 30,
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
        backgroundColor: 'rgba(0,0,0,0.5)',
      },
      modalContainer: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        position: 'relative',
      },
      modalheader: {
       fontWeight:"bold",
       fontSize:20,
       marginBottom:5
       
        
      },
      modalIconContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
        padding: 10,
      },
      modalMessage: {
        color: '#000000',
        textAlign:"center",
        fontSize: 18,
      },
      modalButtonText: {
        fontWeight:"500",
        fontSize:20,
        marginTop:10
      },
  });
  