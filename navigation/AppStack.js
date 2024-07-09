// AppStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabs from './Bottomtabs'; // Assuming BottomTabs.js is in the same directory
import AddReminder from '../screens/App/AddReminder';
import UserProfile from '../screens/Auth/UserProfile';

import RecordProductList from '../screens/App/RecordProductList';

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

const AppStack = () => {
  return (
    <Stack.Navigator initialRouteName="BottomTabs">
    
      <Stack.Screen name="BottomTabs" component={BottomTabs} options={{ headerShown: false }} />
      <Stack.Screen name="AddReminder" component={AddReminder} options={{ headerShown: false }}/>
      <Stack.Screen name="UserProfile" component={UserProfile} />
      <Stack.Screen name="profile" component={Profile} options={{ headerShown: true }} />
      <Stack.Screen name="productsupply" component={ProductSupply} options={{ headerShown: false }}/>
      <Stack.Screen name="stockrecords" component={StockRecords} />
      <Stack.Screen name="addcustomers" component={AddCustomers} options={{ headerShown: true }} />
      <Stack.Screen name="existingclienttransaction" component={ExistingClientTransaction} options={{ headerShown: true }}/>
      <Stack.Screen name="dispensefuel" component={DispenseFuel} options={{ headerShown: true }} />
      <Stack.Screen name="addfunds" component={AddFunds} options={{ headerShown: true }} />
      <Stack.Screen name="redrawfund" component={RedrawFund} options={{ headerShown: true }}/>
      <Stack.Screen name="RecordProductList" component={RecordProductList} options={{ headerShown: true }}/>
      <Stack.Screen name="stockProductList" component={stockProductList} options={{ headerShown: true }}/>

    </Stack.Navigator>
  );
};

export default AppStack;
