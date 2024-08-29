import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './navigation/AuthStack';
import AppStack from './navigation/AppStack';
import { enableScreens } from 'react-native-screens';
import { AuthProvider } from './hooks/useAuthContext';
import AuthContext from './hooks/useAuthContext';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';
enableScreens();

const AppNavigator = () => {
  const { user } = React.useContext(AuthContext);

  return (
    <NavigationContainer> 
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <AuthProvider>
        <ApplicationProvider {...eva} theme={eva.light}>

      <AppNavigator />

          
        </ApplicationProvider>
    </AuthProvider>
  );
};

export default App;
