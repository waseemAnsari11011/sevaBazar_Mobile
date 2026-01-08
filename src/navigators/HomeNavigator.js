import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/MainScreens/home/HomeScreen';
import Details from '../screens/MainScreens/details/Details';
import CategoryProducts from '../screens/MainScreens/CategoryProducts';
import VendorsByCategory from '../screens/MainScreens/vendors/VendorsByCategory';
import VendorDetails from '../screens/MainScreens/vendors/VendorDetails';
import VendorCategoryProducts from '../screens/MainScreens/vendors/VendorCategoryProducts';
import DiscountedProducts from '../screens/MainScreens/DiscountedProducts';
import RecentlyAddedProducts from '../screens/MainScreens/RecentlyAddedProducts';
import NewlyAddedVendorsScreen from '../screens/MainScreens/vendors/NewlyAddedVendorsScreen';
import VendorsWithDiscount from '../screens/MainScreens/vendors/VendorsWithDiscount';
import SearchScreen from '../screens/MainScreens/Search';
import SubmitInquiry from '../screens/MainScreens/inquiry/Inquiry';
import AllCategories from '../screens/MainScreens/home/AllCategories';
import Chat from '../screens/MainScreens/chat/Chat';
import CheckoutScreen from '../screens/MainScreens/Checkout';
import OrdersScreen from '../screens/MainScreens/OrdersScreen';
import ShippingAddressesList from '../screens/MainScreens/location/ShippingAddressesList';
import LocationSearch from '../screens/MainScreens/location/LocationSearch';

const Stack = createNativeStackNavigator();

const HomeNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen
        name="Details"
        options={{headerShown: true}}
        component={Details}
      />
      <Stack.Screen
        name="CategoryProducts"
        options={{headerShown: true}}
        component={CategoryProducts}
      />
      <Stack.Screen
        name="VendorsByCategory"
        options={{headerShown: false}}
        component={VendorsByCategory}
      />
      <Stack.Screen
        name="VendorDetails"
        component={VendorDetails}
      />
      <Stack.Screen
        name="VendorCategoryProducts"
        options={{headerShown: false}}
        component={VendorCategoryProducts}
      />
      <Stack.Screen
        name="Discounted Products"
        options={{headerShown: true}}
        component={DiscountedProducts}
      />
      <Stack.Screen
        name="New Arrivals"
        options={{headerShown: true}}
        component={RecentlyAddedProducts}
      />
      <Stack.Screen
        name="New Dukaans"
        options={{headerShown: false}}
        component={NewlyAddedVendorsScreen}
      />
      <Stack.Screen
        name="Top Deals from Dukaans"
        options={{headerShown: false}}
        component={VendorsWithDiscount}
      />
      <Stack.Screen
        name="Search Your Products"
        options={{headerShown: true}}
        component={SearchScreen}
      />
      <Stack.Screen
        name="Submit Inquiry"
        options={{headerShown: true}}
        component={SubmitInquiry}
      />
      <Stack.Screen
        name="All Categories"
        options={{headerShown: true}}
        component={AllCategories}
      />
      <Stack.Screen
        name="Chat"
        options={{headerShown: true}}
        component={Chat}
      />
      <Stack.Screen
        name="Checkout"
        options={{headerShown: true}}
        component={CheckoutScreen}
      />
      <Stack.Screen
        name="Cart"
        options={{headerShown: true}}
        component={OrdersScreen}
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

export default HomeNavigator;
