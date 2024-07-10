import PushNotification from 'react-native-push-notification';

PushNotification.configure({
  // Called when Token is generated (iOS and Android)
  onRegister: function (token) {
    console.log('TOKEN:', token);
  },

  // Called when a remote or local notification is opened or received
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);

    // process the notification

    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NoData);
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

export const showLocalNotification = (title, message) => {
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
  });
};
