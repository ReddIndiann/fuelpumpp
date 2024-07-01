import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import Intro from '../screens/Auth/Intro';
import LoginPage from '../screens/Auth/LoginPage';
import ForgotPassword from '../screens/Auth/ForgotPassword';
import Passwordsuccess from '../screens/Auth/Passwordsuccess';
import ResetPassword from '../screens/Auth/Resetpassword';


const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="Intro">
      <Stack.Screen name="Intro" component={Intro} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="Login" component={LoginPage} />
      <Stack.Screen name="ForgetPassword" component={ForgotPassword} />
      <Stack.Screen name="PasswordSucess" component={Passwordsuccess}  options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default AuthStack;
