// src/screens/MainScreens/vendors/VendorDetails.js

import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import SafeScreen from '../../../components/SafeScreen';
import CustomHeader from '../../../components/CustomHeader';
import {
  fetchVendorDetails,
  resetVendorDetails,
} from '../../../config/redux/actions/vendorActions';
import {fetchProductsByVendor} from '../../../config/redux/actions/productAction';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProductCard from '../../../components/ProductCard';

const FALLBACK_IMAGE_URL =
  'https://placehold.co/600x400/EEE/31343C?text=Vendor';

const VendorDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const {vendorId} = route.params;

  const {vendor, loading, error} = useSelector(state => state.vendorDetails);
  const {products, loading: productsLoading} = useSelector(
    state => state.productsByVendor,
  );

  useEffect(() => {
    dispatch(fetchVendorDetails(vendorId));
    dispatch(fetchProductsByVendor(vendorId));

    return () => {
      dispatch(resetVendorDetails());
    };
  }, [dispatch, vendorId]);

  const renderHeader = () => {
    if (!vendor) return null;

    const imageUrl =
      vendor.documents?.shopPhoto?.length > 0
        ? vendor.documents.shopPhoto[0]
        : FALLBACK_IMAGE_URL;

    return (
      <View>
        <Image source={{uri: imageUrl}} style={styles.vendorImage} />
        <View style={styles.vendorInfoContainer}>
          <Text style={styles.vendorName}>
            {vendor.vendorInfo?.businessName}
          </Text>
          <View style={styles.addressContainer}>
            <Icon name="map-marker" size={16} color="#7f8c8d" />
            <Text style={styles.vendorAddress}>
              {vendor.location?.address?.addressLine1 ||
                'Address not available'}
            </Text>
          </View>
        </View>
        <View style={styles.separator} />
        <Text style={styles.productsHeader}>Products</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#ff6600" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeScreen style={styles.screen}>
      <CustomHeader title={'Vendor Details'} navigation={navigation} />
      <FlatList
        data={products}
        keyExtractor={item => item._id}
        ListHeaderComponent={renderHeader}
        // Add numColumns prop for a 2-column grid
        numColumns={2}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.productCardContainer}
            onPress={() => navigation.navigate('Details', {product: item})}>
            <ProductCard
              item={item}
              onPress={() =>
                navigation.navigate('Details', {productId: item._id})
              }
            />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !productsLoading && (
            <View style={styles.centeredContainer}>
              <Text style={styles.emptyText}>
                No products found for this vendor.
              </Text>
            </View>
          )
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#f8f9fa',
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  vendorImage: {
    width: '100%',
    height: 200,
  },
  vendorInfoContainer: {
    padding: 16,
  },
  vendorName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  vendorAddress: {
    fontSize: 14,
    color: '#7f8c8d',
    marginLeft: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#ecf0f1',
    marginHorizontal: 16,
  },
  productsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    padding: 16,
  },
  listContainer: {
    // Add horizontal padding for outer spacing
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  productCardContainer: {
    // Make each item take up half the space
    flex: 1 / 2,
    // Add margin for spacing between items
    margin: 8,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#95a5a6',
    marginTop: 20,
  },
});

export default VendorDetails;
