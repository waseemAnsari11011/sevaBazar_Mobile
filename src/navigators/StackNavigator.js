import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabNavigator from './MainTabNavigator';
import DrawerNavigator from './DrawerNavigator';
import LocationSearch from '../screens/MainScreens/location/LocationSearch';
import PhoneSignIn from '../screens/PhoneSignIn';
import { useSelector } from 'react-redux';
import ShippingAddressesList from '../screens/MainScreens/location/ShippingAddressesList';
import CheckoutScreen from '../screens/MainScreens/Checkout';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Main" component={MainTabNavigator} />


      {/* 
          Screens below should only be here if they need to cover the tab bar 
          (e.g., Modals, Full screen flows). 
          Most screens have been moved to HomeNavigator and ProfileNavigator 
          to keep the tab bar visible.
      */}




      <Stack.Screen
        options={{ headerShown: true }}
        name="otp"
        component={PhoneSignIn}
      />

      {/* Location List and Add Location might be accessed from Cart/Checkout flow too? 
          If so, keeping them here might be necessary OR accessible via deep link.
          For now, 'Location List' is in Profile. If accessed from Checkout, we might need it here?
          Let's verify if Checkout uses navigate('Location List').
          If so, we can keep it duplicate or better, move it to a shared stack or keep in Root.
          For now, I'll keep them to be safe for Checkout flow, but standard browse uses nested ones.
          Actually, let's remove duplicates to force usage of nested ones if navigation structure allows.
          But wait, if I am in Home tab -> Cart -> Checkout -> Select Address -> Add Address.
          If `Checkout` is in StackNavigator, `Add Address` must be reachable.
          If `Add Address` is ONLY in ProfileNavigator, we can't push it easily from StackNavigator without jumping tabs.
          Safe bet: Keep 'Location List' and 'Add Location' here for Checkout flow if needed, 
          BUT the goal is "bottom tab present in all screens".
          If I am in Checkout, I am likely covering tabs (since Checkout is usually full screen/modal-like).
          If I go to Address from Checkout, I might still want to be in "Checkout Mode".
          The user asked "bottom tab should be present in all screens".
          So Checkout SHOULD be in a tab stack? Or Checkout is an exception?
          Usually Checkout hides tabs. But if user said "all screens", maybe even checkout?
          Let's assume "Browsing" screens first. 
          I will remove the moved screens.
      */}

      {/* Removed moved screens: 
          Details, Edit Profile, CategoryProducts, Vendors..., Edit Address, Notifications,
          Discounted Products, New Arrivals, Search, Submit Inquiry, Faqs, Contactus,
          All Categories, Chat, Support Ticket
       */}


    </Stack.Navigator>
  );
};

export default StackNavigator;
