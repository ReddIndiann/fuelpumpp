// AppStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabs from './Bottomtabs'; // Assuming BottomTabs.js is in the same directory
import AddReminder from '../screens/App/AddReminder';
import UserProfile from '../screens/Auth/UserProfile';



import Transactions from '../screens/App/Transactions';
import DispenseFuel from "../screens/App/DispenseFuel";
import AddFunds from "../screens/App/AddFunds";
import Profile from "../screens/App/Profile";
import StockRecords from "../screens/App/StockRecords";

import ProductSupply from "../screens/App/Productsupply";

import AddClients from "../screens/App/AddClient";
import RedrawFund from "../screens/App/RedrawFund";
import ExistingClientTransaction from "../screens/App/ExistingClientTransaction";
import AuthStack from './AuthStack';
const Stack = createStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator initialRouteName="Auth">
     <Stack.Screen name="Auth" component={AuthStack} options={{ headerShown: false }} />
      <Stack.Screen name="BottomTabs" component={BottomTabs} options={{ headerShown: false }} />
      <Stack.Screen name="AddReminder" component={AddReminder} options={{ headerShown: false }}/>
      <Stack.Screen name="UserProfile" component={UserProfile} />
      <Stack.Screen name="profile" component={Profile} options={{ headerShown: false }} />
      <Stack.Screen name="productsupply" component={ProductSupply} options={{ headerShown: false }}/>
      <Stack.Screen name="stockrecords" component={StockRecords} />
      <Stack.Screen name="addclient" component={AddClients} options={{ headerShown: false }} />
      <Stack.Screen name="existingclienttransaction" component={ExistingClientTransaction} options={{ headerShown: false }}/>
      <Stack.Screen name="dispensefuel" component={DispenseFuel} />
      <Stack.Screen name="addfunds" component={AddFunds} options={{ headerShown: false }} />
      <Stack.Screen name="redrawfund" component={RedrawFund} options={{ headerShown: false }}/>

    </Stack.Navigator>
  );
};

export default AppStack;
