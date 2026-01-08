import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeNavigator from './HomeNavigator';
import ProfileNavigator from './ProfileNavigator';
import OrderNavigator from './OrderNavigator';
import Ionicons from 'react-native-vector-icons/Ionicons';

import DrawerNavigator from './DrawerNavigator';
import { useDispatch, useSelector } from 'react-redux';
import Chat from '../screens/MainScreens/chat/Chat';
import OfferScreen from '../screens/MainScreens/OfferScreen';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  const cartItems = useSelector(state => state.cart.cartItems);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: route.name === 'Order' ? true : false, // Show header only for 'Order' screen
        tabBarActiveTintColor: '#000066',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
          marginBottom: 5,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Order') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbox' : 'chatbox-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbox' : 'chatbox-outline';
          } else if (route.name === 'Offer') {
            iconName = focused ? 'pricetag' : 'pricetag-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarShowLabel: true, // Show the labels
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeNavigator}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Offer"
        component={OfferScreen}
        options={{
          headerShown: true,
          headerTitle: 'Special Offers',
        }}
      />
      <Tab.Screen
        name="Order"
        component={OrderNavigator}
        options={{
          tabBarBadge: cartItems.length === 0 ? null : cartItems.length,
          headerShown: false,
        }}
      />
      {/* <Tab.Screen name="Chat" component={Chat} /> */}
      <Tab.Screen 
        name="Profile" 
        component={ProfileNavigator} 
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
