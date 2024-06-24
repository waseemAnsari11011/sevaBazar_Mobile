import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/MainScreens/home/HomeScreen';
import ProfileScreen from '../screens/MainScreens/ProfileScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import OrdersScreen from '../screens/MainScreens/OrdersScreen';
import DrawerNavigator from './DrawerNavigator';
import {useDispatch, useSelector} from 'react-redux';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  const cartItems = useSelector(state => state.cart.cartItems);

  return (
    <Tab.Navigator
  screenOptions={({ route }) => ({
    headerShown: route.name === 'Order' ? true : false, // Show header only for 'Order' screen
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;
      if (route.name === 'Home') {
        iconName = focused ? 'home' : 'home-outline';
      } else if (route.name === 'Profile') {
        iconName = focused ? 'person' : 'person-outline';
      } else if (route.name === 'Order') {
        iconName = focused ? 'cart' : 'cart-outline';
      }

      return <Ionicons name={iconName} size={size} color="green" />;
    },
    tabBarShowLabel: false, // Hide the labels
  })}
>
  <Tab.Screen
    name="Home"
    component={HomeScreen}
  />
  {/* <Tab.Screen name="Home" component={DrawerNavigator} /> */}
  <Tab.Screen
    name="Order"
    component={OrdersScreen}
    options={{
      tabBarBadge: cartItems.length === 0 ? null : cartItems.length,
    }}
  />
  <Tab.Screen name="Profile" component={ProfileScreen} />
</Tab.Navigator>

  );
};

export default MainTabNavigator;
