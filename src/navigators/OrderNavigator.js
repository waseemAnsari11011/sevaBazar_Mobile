import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OrdersScreen from '../screens/MainScreens/OrdersScreen';
import CheckoutScreen from '../screens/MainScreens/Checkout';
import ShippingAddressesList from '../screens/MainScreens/location/ShippingAddressesList';
import LocationSearch from '../screens/MainScreens/location/LocationSearch';

const Stack = createNativeStackNavigator();

const OrderNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="Cart"
        component={OrdersScreen}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="Checkout"
        options={{headerShown: true}}
        component={CheckoutScreen}
      />
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
    </Stack.Navigator>
  );
};

export default OrderNavigator;
