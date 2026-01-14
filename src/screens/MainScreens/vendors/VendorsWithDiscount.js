// src/screens/MainScreens/vendors/VendorsWithDiscount.js

import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import SafeScreen from '../../../components/SafeScreen';
import SearchableVendorList from './SearchableVendorList';
import {
  fetchVendorsWithDiscounts,
  resetVendorsWithDiscounts,
} from '../../../config/redux/actions/vendorsWithDiscountsActions';

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
  } = useSelector(state => state.vendorsWithDiscounts);

  const {location: userLocation} = useSelector(state => state.location);

  // Fetch data on component mount
  useEffect(() => {
    dispatch(resetVendorsWithDiscounts());
    dispatch(fetchVendorsWithDiscounts(1, 10));
  }, [dispatch]);

  // Handlers
  const handleRetry = () => {
    dispatch(fetchVendorsWithDiscounts(1, 10));
  };

  const handleVendorPress = vendor => {
    navigation.navigate('VendorDetails', {vendorId: vendor._id});
  };

  return (
    <SafeScreen style={styles.screen}>
      {/* SearchableVendorList now handles the header */}
      <View style={{flex: 1}}>
        <SearchableVendorList
          initialVendors={vendors}
          loading={loading}
          error={error}
          userLocation={userLocation}
          onRetry={handleRetry}
          onVendorPress={handleVendorPress}
          navigation={navigation} // Pass navigation for the back button
        />
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#fff',
    flex: 1,
  },
});

export default NewlyAddedVendorsScreen;
