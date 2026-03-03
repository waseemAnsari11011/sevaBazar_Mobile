// PushNotificationConfig.js
// Uses @notifee/react-native (replaces deprecated react-native-push-notification)

import notifee, {
  AndroidImportance,
  AndroidVisibility,
  EventType,
} from '@notifee/react-native';
import {navigate} from './src/utils/navigationRef';

const DEFAULT_CHANNEL_ID = 'default-channel-id';

// Create notification channel (Android)
export const createNotificationChannel = async () => {
  await notifee.createChannel({
    id: DEFAULT_CHANNEL_ID,
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
    vibration: true,
    visibility: AndroidVisibility.PUBLIC,
  });
};

// Show local foreground notification
export const showLocalNotification = async (title, message, data = {}) => {
  await createNotificationChannel();

  await notifee.displayNotification({
    title: title,
    body: message,
    data: data,
    android: {
      channelId: DEFAULT_CHANNEL_ID,
      importance: AndroidImportance.HIGH,
      pressAction: {
        id: 'default',
      },
    },
  });
};

// Handle notification press events (foreground)
export const setupNotifeeListeners = () => {
  return notifee.onForegroundEvent(({type, detail}) => {
    if (type === EventType.PRESS) {
      const data = detail.notification?.data || {};
      if (data?.type === 'order_cancelled' || data?.newStatus === 'Cancelled') {
        navigate('Profile', {screen: 'Order History'});
      } else {
        navigate('Profile', {screen: 'My order'});
      }
    }
  });
};
