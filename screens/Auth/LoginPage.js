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
  Alert,
} from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../../hooks/useAuthContext';

const LoginPage = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const { setUser } = useContext(AuthContext);

  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://gcnm.wigal.com.gh/login', {
        username,
        password,
      }, {
        headers: {
          'API-KEY': 'muJFx9F3E5ptBExkz8Fqroa1D79gv9Nv',
        },
      });

      if (response.status === 200) {
        const userData = response.data.data;
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);  // Set user in context
        Alert.alert('Success', 'Login successful!', [
          { text: 'OK', onPress: () => navigation.navigate('BottomTabs') },
        ]);
      }
    } catch (error) {
      console.error('Error logging in:', error.response || error.message || error);
      if (error.response) {
        Alert.alert('Error', `Login failed. Server responded with status: ${error.response.status}`);
      } else if (error.request) {
        Alert.alert('Error', 'Login failed. No response received from server.');
      } else {
        Alert.alert('Error', `Login failed. Error: ${error.message}`);
      }
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
    if (username && password) {
      setIsButtonEnabled(true);
    } else {
      setIsButtonEnabled(false);
    }
  }, [username, password]);

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
            value={username}
            onChangeText={(text) => setUsername(text)}
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
          <Pressable style={styles.forgotpassword} onPress={() => navigation.navigate('ForgetPassword')}>
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
           
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
});
