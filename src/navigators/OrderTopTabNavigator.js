import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MyOrder from '../screens/MainScreens/orders/MyOrder';
import ChatOrderScreen from '../screens/MainScreens/orders/ChatOrderScreen';

const Tab = createMaterialTopTabNavigator();

const TopTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="My Orders" component={MyOrder} />
      <Tab.Screen name="Chat Orders" component={ChatOrderScreen} />
    </Tab.Navigator>
  );
};

export default TopTabNavigator;
