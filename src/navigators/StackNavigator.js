import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OrdersScreen from '../screens/MainScreens/OrdersScreen';
import MainTabNavigator from './MainTabNavigator';
import DrawerNavigator from './DrawerNavigator';
import Details from '../screens/MainScreens/Details';
import EditProfile from '../screens/MainScreens/Profile/EditProfile';
import CategoryProducts from '../screens/MainScreens/CategoryProducts';
import EditAddress from '../screens/MainScreens/Profile/EditAddress';
import Notifications from '../screens/MainScreens/Profile/Notifications';
import MyOrder from '../screens/MainScreens/orders/MyOrder';
import CheckoutScreen from '../screens/MainScreens/Checkout';
import DiscountedProducts from '../screens/MainScreens/DiscountedProducts';
import RecentlyAddedProducts from '../screens/MainScreens/RecentlyAddedProducts';
import SearchScreen from '../screens/MainScreens/Search';
import LocationSearch from '../screens/MainScreens/LocationSearch';
import PhoneSignIn from '../screens/PhoneSignIn';
import { useSelector } from 'react-redux';
import OrderTacking from '../screens/MainScreens/orders/OrderTacking';
import SubmitInquiry from '../screens/MainScreens/inquiry/Inquiry';
import faqs from '../screens/MainScreens/faqs/Faqs';
import Contactus from '../screens/MainScreens/contact/Contactus';


const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const { data } = useSelector(state => state?.local);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      { !data?.user?.shippingAddresses && <Stack.Screen name="Search Location" options={{ headerShown: true }} component={LocationSearch} />}
      <Stack.Screen name="Main" component={MainTabNavigator} />
      <Stack.Screen options={{ headerShown: true }} name="Details" component={Details} />
      <Stack.Screen name="Edit Profile" component={EditProfile} />
      <Stack.Screen options={{ headerShown: true }} name="CategoryProducts" component={CategoryProducts} />
      <Stack.Screen name="Edit Address" component={EditAddress} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="My order" options={{ headerShown: true }} component={MyOrder} />
      <Stack.Screen name="Discounted Products" options={{ headerShown: true }} component={DiscountedProducts} />
      <Stack.Screen name="New Arrivals" options={{ headerShown: true }} component={RecentlyAddedProducts} />
      <Stack.Screen name="Search Your Products" options={{ headerShown: true }} component={SearchScreen} />
      <Stack.Screen name="Checkout" options={{ headerShown: true }} component={CheckoutScreen} />
      <Stack.Screen options={{ headerShown: true }} name="otp" component={PhoneSignIn} />
      <Stack.Screen name="Add Location" options={{ headerShown: true }} component={LocationSearch} />
      <Stack.Screen name="Submit Inquiry" options={{ headerShown: true }} component={SubmitInquiry} />
      <Stack.Screen name="Faqs" options={{ headerShown: true }} component={faqs} />
      <Stack.Screen name="Contact us" options={{ headerShown: true }} component={Contactus} />

    </Stack.Navigator>
  );
};

export default StackNavigator;
