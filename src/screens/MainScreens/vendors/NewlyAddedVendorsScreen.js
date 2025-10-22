// src/screens/MainScreens/vendors/NewlyAddedVendorsScreen.js

import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import SafeScreen from '../../../components/SafeScreen';
import CustomHeader from '../../../components/CustomHeader';
import {
  fetchRecentlyAddedVendors,
  resetRecentlyAddedVendors,
} from '../../../config/redux/actions/recentlyAddedVendorsActions';
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
  } = useSelector(state => state.recentlyAddedVendors);

  const {location: userLocation} = useSelector(state => state.location);

  // Fetch data on component mount and reset on unmount
  useEffect(() => {
    dispatch(resetRecentlyAddedVendors());

    // Fetch the first page of vendors
    dispatch(fetchRecentlyAddedVendors(1, 10));

    // return () => {
    //   dispatch(resetRecentlyAddedVendors());
    // };
  }, [dispatch]);

  // Handlers to pass down to the list component
  const handleRetry = () => {
    dispatch(fetchRecentlyAddedVendors(1, 10));
  };

  const handleVendorPress = vendor => {
    navigation.navigate('VendorDetails', {vendorId: vendor._id});
  };

  return (
    <SafeScreen style={styles.screen}>
      <CustomHeader title={'Newly Added Dukaans'} navigation={navigation} />
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
