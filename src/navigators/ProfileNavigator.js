import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ProfileScreen from '../screens/MainScreens/ProfileScreen';
import EditProfile from '../screens/MainScreens/Profile/EditProfile';
import EditAddress from '../screens/MainScreens/Profile/EditAddress';
import Notifications from '../screens/MainScreens/Profile/Notifications';
import ShippingAddressesList from '../screens/MainScreens/location/ShippingAddressesList';
import LocationSearch from '../screens/MainScreens/location/LocationSearch';
import faqs from '../screens/MainScreens/faqs/Faqs';
import Contactus from '../screens/MainScreens/contact/Contactus';
import SupportTicketScreen from '../screens/MainScreens/SupportTicketScreen';
import OrderTopTabNavigator from './OrderTopTabNavigator';
import OrderHistoryTopTabNavigator from './OrderHistoryTopTabNavigator';
import OrderTacking from '../screens/MainScreens/orders/OrderTacking';

const Stack = createNativeStackNavigator();

const ProfileNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen
        name="Edit Profile"
        options={{headerShown: true}}
        component={EditProfile}
      />
      <Stack.Screen name="Edit Address" component={EditAddress} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen
        name="Location List"
        options={{headerShown: true}}
        component={ShippingAddressesList}
      />
      <Stack.Screen
        name="Add Location"
        options={{headerShown: true}}
        component={LocationSearch}
      />
      <Stack.Screen
        name="Faqs"
        options={{headerShown: true}}
        component={faqs}
      />
      {/* <Stack.Screen
        name="Contact us"
        options={{headerShown: true}}
        component={Contactus}
      /> */}
      <Stack.Screen name="Support Ticket" component={SupportTicketScreen} />
      <Stack.Screen
        name="My order"
        options={{headerShown: true}}
        component={OrderTopTabNavigator}
      />
      <Stack.Screen
        name="Order History"
        options={{headerShown: true}}
        component={OrderHistoryTopTabNavigator}
      />
      <Stack.Screen name="OrderTacking" component={OrderTacking} />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
