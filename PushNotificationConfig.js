import { Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';

import { navigate } from './src/utils/navigationRef';

PushNotification.configure({
  // Called when Token is generated (iOS and Android)
  onRegister: function (token) {
    console.log('TOKEN:', token);
  },

  onNotification: function (notification) {
    console.log("NOTIFICATION CLICKED:", notification);

    if (notification.userInteraction) {
      const data = notification.data || notification;
      if (data?.type === 'order_cancelled' || data?.newStatus === 'Cancelled') {
        navigate('Profile', { screen: 'Order History' });
      } else {
        navigate('Profile', { screen: 'My order' });
      }
    }

    // (required) Called when a remote is received or opened, or local notification is opened
    if (Platform.OS === 'ios' && typeof notification.finish === 'function') {
      notification.finish('noData');
    }
  },

  // Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  // Should the initial notification be popped automatically
  popInitialNotification: true,

  // Request permissions on iOS
  requestPermissions: true,
});

// Create Global Channel for Android
PushNotification.createChannel(
  {
    channelId: "default-channel-id", // (required)
    channelName: "Default Channel", // (required)
    channelDescription: "A default channel for notifications", // (optional) default: undefined.
    playSound: true, // (optional) default: true
    soundName: "default", // (optional) default: "default".
    importance: 4, // (optional) default: 4. Int value of the Android notification importance
    vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
  },
  (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
);

export const showLocalNotification = (title, message, data = {}) => {
  PushNotification.localNotification({
    /* Android Only Properties */
    channelId: "default-channel-id", // (required) channelId, if the channel doesn't exist, it will be created. 
    autoCancel: true, // (optional) default: true
    largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
    smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
    bigText: message, // (optional) default: "message" prop
    subText: "Notification", // (optional) default: none

    /* iOS and Android properties */
    title: title, // (optional)
    message: message, // (required)
    playSound: true, // (optional) default: true
    soundName: 'default', // (optional) default: 'default'
    userInfo: data, // (optional) default: {} (managed by the library as 'data' on Android)
  });
};
