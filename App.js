import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import store from './src/config/redux/store';
import RootNavigator from './src/navigators/RootNavigator';
import firebase from '@react-native-firebase/app';
import { PaperProvider } from 'react-native-paper';
import messaging from '@react-native-firebase/messaging';

const App = () => {

  useEffect(() => {
    const getToken = async () => {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
    };
  
    getToken();
  }, []);
  

  useEffect(() => {
    const requestUserPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
      }
    };

    requestUserPermission();

    // Handle foreground messages
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', remoteMessage);
      // Handle the message as needed
    });

    // Handle background messages
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
      // Handle the message as needed
    });

    // Clean up the listeners on unmount
    return () => {
      unsubscribeOnMessage();
    };
  }, []);

  return (
    <Provider store={store}>
      <PaperProvider>
        <RootNavigator />
      </PaperProvider>
    </Provider>
  );
};

export default App;
