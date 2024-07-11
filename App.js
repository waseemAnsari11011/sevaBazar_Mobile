// App.js

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import store from './src/config/redux/store';
import RootNavigator from './src/navigators/RootNavigator';
import { PaperProvider } from 'react-native-paper';
import { requestUserPermission, getToken, notificationListener, } from './firebaseMessaging';
import { updateFcm } from './src/config/redux/actions/customerActions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {


  useEffect(() => {
    const setupMessaging = async () => {
      await requestUserPermission();
     const token = await getToken();
      await AsyncStorage.setItem('deviceToken', JSON.stringify(token));

      await notificationListener()

      // await AsyncStorage.setItem('user', JSON.stringify({
      //   "shippingAddresses": {
      //     "address": "CWC8+RC Mountain View, CA, USA",
      //     "city": "Mountain View",
      //     "state": "California",
      //     "country": "United States",
      //     "postalCode": "12"
      //   },
      //   "_id": "667503fc3c7cd6306d52f284",
      //   "contactNumber": "+918882202176",
      //   "role": "customer",
      //   "isRestricted": false,
      //   "createdAt": "2024-06-21T04:39:24.341Z",
      //   "updatedAt": "2024-06-21T04:39:24.341Z",
      //   "__v": 0,
      //   "availableLocalities": "12",
      //   "name": "Waseem",
      //   "email": "waseemahm05@gmail.com"
      // }));

    };

    setupMessaging();
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
