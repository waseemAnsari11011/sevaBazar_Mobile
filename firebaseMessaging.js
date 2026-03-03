// firebaseMessaging.js

import messaging from '@react-native-firebase/messaging';
import {updateFcm} from './src/config/redux/actions/customerActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  showLocalNotification,
  createNotificationChannel,
  setupNotifeeListeners,
} from './PushNotificationConfig';

import {navigate} from './src/utils/navigationRef';

const navigateToOrder = remoteMessage => {
  const data = remoteMessage?.data;
  if (data?.type === 'order_cancelled' || data?.newStatus === 'Cancelled') {
    navigate('Profile', {screen: 'Order History'});
  } else {
    navigate('Profile', {screen: 'My order'});
  }
};

// Background message handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  // Handle the background message here
});

export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
};

export const getToken = async () => {
  try {
    console.log('Firebase Options:', messaging().app.options);
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    return token;
  } catch (error) {
    console.error('Error fetching FCM token:', error);
    return null;
  }
};

export const notificationListener = async () => {
  console.log('notificationListener');

  // Create notifee channel on startup
  await createNotificationChannel();

  // Setup notifee foreground press handler
  setupNotifeeListeners();

  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
    navigateToOrder(remoteMessage);
  });

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
        navigateToOrder(remoteMessage);
      }
    });

  messaging().onMessage(async remoteMessage => {
    console.log('foreground state:', remoteMessage);
    const title =
      remoteMessage.notification?.title ||
      remoteMessage.data?.title ||
      'Notification';
    const body =
      remoteMessage.notification?.body || remoteMessage.data?.body || '';
    if (body) {
      showLocalNotification(title, body, remoteMessage.data);
    }
  });
};
