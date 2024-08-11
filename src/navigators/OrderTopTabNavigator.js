import React, { useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MyOrder from '../screens/MainScreens/orders/MyOrder';
import ChatOrderScreen from '../screens/MainScreens/orders/ChatOrderScreen';
import { useDispatch } from 'react-redux';
import { fetchContact } from '../config/redux/actions/contactActions';

const Tab = createMaterialTopTabNavigator();

const TopTabNavigator = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchContact());
  }, [dispatch]);

  return (
    <Tab.Navigator>
      <Tab.Screen name="My Orders" component={MyOrder} />
      <Tab.Screen name="Chat Orders" component={ChatOrderScreen} />
    </Tab.Navigator>
  );
};

export default TopTabNavigator;
