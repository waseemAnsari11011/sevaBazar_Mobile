// src/screens/MainScreens/vendors/VendorsWithDiscount.js

import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import SafeScreen from '../../../components/SafeScreen';
import CustomHeader from '../../../components/CustomHeader';
import {
  fetchVendorsWithDiscounts,
  resetVendorsWithDiscounts,
} from '../../../config/redux/actions/vendorsWithDiscountsActions';
import SearchableVendorList from './SearchableVendorList';

/**
 * A screen to display a list of recently added vendors.
 * It handles fetching the data and uses the reusable SearchableVendorList
 * component to display and filter the results.
 */
const NewlyAddedVendorsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Selectors to get data from the Redux store
  const {
    vendors,
    loading,
    error,
    // Add pagination state if you plan to implement infinite scroll
    // page,
    // hasMore,
  } = useSelector(state => state.vendorsWithDiscounts);

  const {location: userLocation} = useSelector(state => state.location);

  // Fetch data on component mount and reset on unmount
  useEffect(() => {
    dispatch(resetVendorsWithDiscounts());

    // Fetch the first page of vendors
    dispatch(fetchVendorsWithDiscounts(1, 10));

    // return () => {
    //   dispatch(resetVendorsWithDiscounts());
    // };
  }, [dispatch]);

  // Handlers to pass down to the list component
  const handleRetry = () => {
    dispatch(fetchVendorsWithDiscounts(1, 10));
  };

  const handleVendorPress = vendor => {
    navigation.navigate('VendorDetails', {vendorId: vendor._id});
  };

  return (
    <SafeScreen style={styles.screen}>
      <CustomHeader title={'Top Deals from Dukaans'} navigation={navigation} />
      <View style={{flex: 1}}>
        <SearchableVendorList
          initialVendors={vendors}
          loading={loading}
          error={error}
          userLocation={userLocation}
          onRetry={handleRetry}
          onVendorPress={handleVendorPress}
        />
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#f8f9fa',
    flex: 1,
  },
});

export default NewlyAddedVendorsScreen;
