// index.js

import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import './firebaseMessaging'; // Import the firebase messaging setup

AppRegistry.registerComponent(appName, () => App);
