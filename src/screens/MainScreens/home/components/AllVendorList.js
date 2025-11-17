import React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {useSelector} from 'react-redux';
import VendorCard from '../../vendors/VendorCard';

const VendorList = ({navigation}) => {
  const {
    loading: vendorsLoading,
    vendors,
    error: vendorsError,
  } = useSelector(state => state.recentlyAddedVendors);
  const {location: userLocation} = useSelector(state => state.location);

  if (vendorsLoading && vendors.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading new vendors...</Text>
      </View>
    );
  }

  if (vendorsError) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Error: {vendorsError}</Text>
      </View>
    );
  }

  const renderVendorItem = ({item}) => {
    return (
      <VendorCard
        vendor={item}
        userLocation={userLocation}
        onPress={() =>
          navigation.navigate('VendorDetails', {vendorId: item._id})
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={vendors}
        renderItem={renderVendorItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContentContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default VendorList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  loadingText: {
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
  },
  listContentContainer: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
});
