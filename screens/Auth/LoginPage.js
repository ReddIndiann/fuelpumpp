// import {
//   StyleSheet,
//   SafeAreaView,
//   Text,
//   View,
//   TouchableOpacity,
//   TextInput,
//   useWindowDimensions,
//   KeyboardAvoidingView,
//   Platform,
//   Keyboard,
//   ScrollView,
//   Pressable,
//   Alert,
// } from 'react-native';
// import React, { useState, useEffect, useContext } from 'react';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import AuthContext from '../../hooks/useAuthContext';

// const LoginPage = ({ navigation }) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [passwordVisible, setPasswordVisible] = useState(false);
//   const [keyboardOpen, setKeyboardOpen] = useState(false);
//   const [isButtonEnabled, setIsButtonEnabled] = useState(false);
//   const { setUser } = useContext(AuthContext);

//   const { width } = useWindowDimensions();
//   const isTablet = width >= 768;

//   const togglePasswordVisibility = () => {
//     setPasswordVisible(!passwordVisible);
//   };

//   const handleLogin = async () => {
//     try {
//       const response = await axios.post('https://gcnm.wigal.com.gh/login', {
//         username,
//         password,
//       }, {
//         headers: {
//           'API-KEY': 'muJFx9F3E5ptBExkz8Fqroa1D79gv9Nv',
//         },
//       });

//       if (response.status === 200) {
//         const userData = response.data.data;
//         await AsyncStorage.setItem('user', JSON.stringify(userData));
//         setUser(userData);  // Set user in context
//         Alert.alert('Success', 'Login successful!', [
//           { text: 'OK', onPress: () => navigation.navigate('BottomTabs') },
//         ]);
//       }
//     } catch (error) {
//       console.error('Error logging in:', error.response || error.message || error);
//       if (error.response) {
//         Alert.alert('Error', `Login failed. Server responded with status: ${error.response.status}`);
//       } else if (error.request) {
//         Alert.alert('Error', 'Login failed. No response received from server.');
//       } else {
//         Alert.alert('Login Error', `Check User's Credentials `);
//       }
//     }
//   };

//   useEffect(() => {
//     const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
//       setKeyboardOpen(true);
//     });
//     const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
//       setKeyboardOpen(false);
//     });

//     return () => {
//       keyboardDidHideListener.remove();
//       keyboardDidShowListener.remove();
//     };
//   }, []);

//   useEffect(() => {
//     if (username && password) {
//       setIsButtonEnabled(true);
//     } else {
//       setIsButtonEnabled(false);
//     }
//   }, [username, password]);

//   return (
//     <SafeAreaView style={styles.container}>
//       <KeyboardAvoidingView
//         style={styles.container}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       >
//         <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
//           <Text style={styles.title}>Log in</Text>
//           <Text style={styles.pageinfo}>
//             Welcome! Please login to access your account and unlock a world of fuel management convenience
//           </Text>
//           <TextInput
//             placeholder="E-mail address"
//             value={username}
//             onChangeText={(text) => setUsername(text)}
//             style={styles.input}
//             placeholderTextColor="#a0a0a0"
//           />
//           <View style={styles.passwordContainer}>
//             <TextInput
//               placeholder="Password"
//               value={password}
//               onChangeText={(text) => setPassword(text)}
//               style={[styles.inputt, { flex: 1, borderColor: '#FFFFFF' }]}
//               secureTextEntry={!passwordVisible}
//               placeholderTextColor="#a0a0a0"
//             />
//             <TouchableOpacity onPress={togglePasswordVisibility}>
//               <Icon name={passwordVisible ? 'visibility' : 'visibility-off'} size={24} color="#a0a0a0" />
//             </TouchableOpacity>
//           </View>
//           <Pressable style={styles.forgotpassword} onPress={() => navigation.navigate('ForgetPassword')}>
//             <Text style={styles.forgotpassword}>Forgot password?</Text>
//           </Pressable>
//           <View style={[styles.buttonContainer, keyboardOpen && styles.buttonContainerKeyboardOpen]}>
//             <TouchableOpacity
//               style={[styles.button, !isButtonEnabled && styles.buttonDisabled, isTablet && styles.tabletButton]}
//               onPress={handleLogin}
//               disabled={!isButtonEnabled}
//             >
//               <Text style={styles.signInText}>Log in</Text>
//             </TouchableOpacity>
           
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// export default LoginPage;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 30,
//     alignSelf: 'flex-start',
//     marginLeft: 20,
//     marginBottom:"6%"
//   },
//   forgotpassword: {
//     fontSize: 18,
//     alignSelf: 'flex-start',
//     marginLeft: 20,
//   },
//   pageinfo: {
//     fontSize: 20,
//     alignSelf: 'flex-start',
//     marginLeft: 20,
//   },
//   input: {
//     width: '90%',
//     height: 50,
//     borderRadius: 10,
//     fontSize: 18,
//     paddingLeft: 15,
//     marginVertical: 10,
//     borderWidth: 1,
//     borderColor: '#a0a0a0',
//   },
//   inputt: {
//     width: '90%',
//     height: 45,
//     borderRadius: 10,
//     fontSize: 18,
//     paddingLeft: 15,
//     marginVertical: 10,
//     borderWidth: 1,
//     borderColor: '#a0a0a0',
//   },
//   passwordContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     width: '90%',
//     height: 50,
//     borderRadius: 10,
//     marginVertical: 10,
//     borderWidth: 1,
//     borderColor: '#a0a0a0',
//     paddingHorizontal: 1,
//   },
//   buttonContainer: {
//     flexDirection: 'column',
//     justifyContent: 'space-between',
//     marginTop: 300,
//     marginVertical: 20,
//   },
//   buttonContainerKeyboardOpen: {
//     marginTop: 10,
//   },
//   button: {
//     width: 300,
//     height: 50,
//     borderColor: '#02B2DD',
//     backgroundColor: '#007B5D',
//     borderWidth: 1,
//     justifyContent: 'center',
//     alignContent:'center',
//     borderRadius: 10,
    
//     alignItems: 'center',
//   },
//   buttonDisabled: {
//     backgroundColor: '#a0a0a0',
//     borderColor: '#a0a0a0',
//   },
 
//   tabletButton: {
//     width: 240,
//     height: 80,
//   },
//   tabletButton1: {
//     width: 240,
//     height: 80,
//     backgroundColor: '#02B2DD',
//   },
//   signInText: {
//     color: '#FFFFFF',
//     fontSize: 17,
//   },
//   signUpText: {
//     fontSize: 17,
//   },
// });





import React, { useState, useEffect, useContext } from 'react';
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
  Alert,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
        setUser(userData);
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
        Alert.alert('Login Error', `Check User's Credentials`);
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
    setIsButtonEnabled(username && password);
  }, [username, password]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <Image source={require('../../assets/slider5.png')} style={styles.logo} />
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.pageinfo}>
            Log in to access your account and manage your fuel efficiently
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="E-mail address"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              placeholderTextColor="#a0a0a0"
            />
            <Text style={styles.floatingLabel}>E-mail address</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              secureTextEntry={!passwordVisible}
              placeholderTextColor="#a0a0a0"
            />
            <Text style={styles.floatingLabel}>Password</Text>
            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
              <Icon name={passwordVisible ? 'visibility' : 'visibility-off'} size={24} color="#008080" />
            </TouchableOpacity>
          </View>
         
          <TouchableOpacity
            style={[styles.button, !isButtonEnabled && styles.buttonDisabled, isTablet && styles.tabletButton]}
            onPress={handleLogin}
            disabled={!isButtonEnabled}
          >
            <LinearGradient
              colors={['#008080', '#00A3A3']}
              style={styles.gradient}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
            >
              <Text style={styles.buttonText}>Log in</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  pageinfo: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
    position: 'relative',
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    fontSize: 16,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#008080',
  },
  floatingLabel: {
    position: 'absolute',
    left: 15,
    top: -10,
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    fontSize: 12,
    color: '#008080',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 12,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#FF6B6B',
    fontSize: 14,
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  tabletButton: {
    width: 300,
    alignSelf: 'center',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginPage;