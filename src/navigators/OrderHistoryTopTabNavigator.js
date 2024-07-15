import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import OrderHistory from '../screens/MainScreens/orders/History/OrderHistory';
import ChatOrderHistory from '../screens/MainScreens/orders/History/ChatOrderHistory';

const Tab = createMaterialTopTabNavigator();

const OrderHistoryTopTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Orders" component={OrderHistory} />
      <Tab.Screen name="Chat Orders" component={ChatOrderHistory} />
    </Tab.Navigator>
  );
};

export default OrderHistoryTopTabNavigator;
