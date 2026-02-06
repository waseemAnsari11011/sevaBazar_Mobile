import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import VendorCard from '../../vendors/VendorCard';
import { useVendorInfiniteScroll } from '../hooks/useVendorInfiniteScroll';

const VendorList = ({ navigation }) => {
  const {
    vendors,
    vendorsLoading,
    vendorsError,
    fetchMoreVendors,
    reachedEnd,
  } = useVendorInfiniteScroll();

  const { location: userLocation } = useSelector(state => state.location);

  if (vendorsLoading && vendors.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000066" />
        <Text style={styles.loadingText}>Loading vendors...</Text>
      </View>
    );
  }

  if (vendorsError && vendors.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Error: {vendorsError}</Text>
      </View>
    );
  }

  const renderVendorItem = ({ item }) => {
    return (
      <VendorCard
        vendor={item}
        userLocation={userLocation}
        onPress={() =>
          navigation.navigate('VendorDetails', { vendorId: item._id })
        }
      />
    );
  };

  const renderFooter = () => {
    if (!vendorsLoading) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#000066" />
      </View>
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
        onEndReached={fetchMoreVendors}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        scrollEnabled={false} // Disable nested scrolling if used inside another scrollable
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
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
  },
  listContentContainer: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  footerLoader: {
    marginVertical: 15,
    alignItems: 'center',
  },
});
