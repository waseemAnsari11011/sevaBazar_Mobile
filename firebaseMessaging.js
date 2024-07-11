// firebaseMessaging.js

import messaging from '@react-native-firebase/messaging';
import { updateFcm } from './src/config/redux/actions/customerActions';
import AsyncStorage from '@react-native-async-storage/async-storage';


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
    const token = await messaging().getToken();
    return token
};

export const notificationListener = async () => {
    console.log('notificationListener');
    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
            'Notification caused app to open from background state:',
            remoteMessage.notification,
        );
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
            }
        });

    messaging().onMessage(async remoteMessage => {
        console.log('foreground state:', remoteMessage);
        alert(remoteMessage.notification.body);
    });
};