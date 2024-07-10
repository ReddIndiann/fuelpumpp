// AppStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabs from './Bottomtabs'; // Assuming BottomTabs.js is in the same directory
import AddReminder from '../screens/App/AddReminder';
import UserProfile from '../screens/Auth/UserProfile';
import RecordList from '../screens/App/RecordList';
import Transactions from '../screens/App/Transactions';
import DispenseFuel from "../screens/App/DispenseFuel";
import AddFunds from "../screens/App/AddFunds";
import Profile from "../screens/App/Profile";
import StockRecords from "../screens/App/StockRecords";
import stockProductList from '../screens/App/StockProductList';
import ProductSupply from "../screens/App/Productsupply";
import AddCustomers from "../screens/App/AddCustomers";
import RedrawFund from "../screens/App/WithdrawFund";
import ExistingClientTransaction from "../screens/App/ExistingClientTransaction";
import AuthStack from './AuthStack';

const Stack = createStackNavigator();

const screenOptions = {
  headerShown: false,
};

const AppStack = () => {
  return (
    <Stack.Navigator initialRouteName="BottomTabs" screenOptions={screenOptions}>
      <Stack.Screen 
        name="BottomTabs" 
        component={BottomTabs} 
      />
      <Stack.Screen 
        name="AddReminder" 
        component={AddReminder} 
      />
      <Stack.Screen 
        name="UserProfile" 
        component={UserProfile} 
        options={{ 
          headerShown: true,
          title: 'User Profile',
          headerBackTitle: 'Back',
        }} 
      />
      <Stack.Screen 
        name="profile" 
        component={Profile} 
        options={{ 
          headerShown: true,
          title: 'Profile',
          headerBackTitle: 'Back',
        }} 
      />
      <Stack.Screen 
        name="productsupply" 
        component={ProductSupply} 
      />
      <Stack.Screen 
        name="stockrecords" 
        component={StockRecords} 
        options={{ 
          headerShown: true,
          title: 'Stock Records',
          headerBackTitle: 'Back',
        }} 
      />
      <Stack.Screen 
        name="addcustomers" 
        component={AddCustomers} 
        options={{ 
          headerShown: true,
          title: 'Add Customers',
          headerBackTitle: 'Back',
        }} 
      />
      <Stack.Screen 
        name="existingclienttransaction" 
        component={ExistingClientTransaction} 
        options={{ 
          headerShown: true,
          title: 'Client Transaction',
          headerBackTitle: 'Back',
        }} 
      />
      <Stack.Screen 
        name="dispensefuel" 
        component={DispenseFuel} 
        options={{ 
          headerShown: true,
          title: 'Dispense Fuel',
          headerBackTitle: 'Back',
        }} 
      />
      <Stack.Screen 
        name="addfunds" 
        component={AddFunds} 
        options={{ 
          headerShown: true,
          title: 'Add Funds',
          headerBackTitle: 'Back',
        }} 
      />
      <Stack.Screen 
        name="withdrawfund" 
        component={RedrawFund} 
        options={{ 
          headerShown: true,
          title: 'Withdraw Fund',
          headerBackTitle: 'Back',
        }} 
      />
      <Stack.Screen 
        name="RecordList" 
        component={RecordList} 
        options={{ 
          headerShown: true,
          title: 'Record Product List',
          headerBackTitle: 'Back',
        }} 
      />
      <Stack.Screen 
        name="stockProductList" 
        component={stockProductList} 
        options={{ 
          headerShown: true,
          title: 'Stock Product List',
          headerBackTitle: 'Back',
        }} 
      />
    </Stack.Navigator>
  );
};

export default AppStack;
