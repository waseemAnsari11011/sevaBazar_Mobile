import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import store from './src/config/redux/store';
import RootNavigator from './src/navigators/RootNavigator';
import firebase from '@react-native-firebase/app';
import { PaperProvider } from 'react-native-paper';

const App = () => {

  return (
    <Provider store={store}>
      <PaperProvider>
        <RootNavigator />
      </PaperProvider>
    </Provider>
  );
};

export default App;
