// src/screens/MainScreens/vendors/VendorsByCategory.js

import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import SafeScreen from '../../../components/SafeScreen';
import CustomHeader from '../../../components/CustomHeader';
import {
  fetchVendorsByCategory,
  resetVendorsByCategory,
} from '../../../config/redux/actions/vendorActions';
import SearchableVendorList from './SearchableVendorList';

const VendorsByCategory = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const {categoryId, categoryTitle} = route.params;

  // The parent screen is now responsible for getting data from Redux
  const {vendors, loading, error} = useSelector(
    state => state.vendorsByCategory,
  );
  const {location: userLocation} = useSelector(state => state.location);

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchVendorsByCategory(categoryId));
    return () => {
      dispatch(resetVendorsByCategory());
    };
  }, [dispatch, categoryId]);

  // Handlers to pass down as props
  const handleRetry = () => {
    dispatch(fetchVendorsByCategory(categoryId));
  };

  const handleVendorPress = vendor => {
    navigation.navigate('VendorDetails', {vendorId: vendor._id});
  };

  return (
    <SafeScreen style={styles.screen}>
      <CustomHeader title={categoryTitle} navigation={navigation} />
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

export default VendorsByCategory;
