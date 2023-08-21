import React from 'react';
import {View, StyleSheet, AppRegistry, Button} from 'react-native';
import {WebView} from 'react-native-webview';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Dashboard from './screens/Dashboard';
import LandingPage from './screens/LandingPage';
import Profile from './screens/Profile';
import EditForm from './screens/EditForm';
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Landing">
          <Stack.Screen
            name="Landing"
            component={LandingPage}
            options={{headerShown: false}}
          />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="EditForm" component={EditForm} />
        </Stack.Navigator>
      </NavigationContainer>
      <FlashMessage position="top" />
    </>
  );
};

export default App;
