// src/screens/MainScreens/vendors/VendorDetails.js

import React, {useEffect, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Linking,
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
import {fetchVendorProductCategories} from '../../../config/redux/actions/vendorProductCategoryActions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProductCard from '../../../components/ProductCard';
import VendorDetailsCarousel from '../../../components/VendorDetailsCarousel';
import VendorCategoryList from './components/VendorCategoryList';

const FALLBACK_IMAGE_URL =
  'https://placehold.co/600x400/EEE/31343C?text=Vendor';

const VendorDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const {vendorId} = route.params;

  const {vendor, loading, error} = useSelector(state => state.vendors.details);
  const {products, loading: productsLoading} = useSelector(
    state => state.productsByVendor,
  );
  const {categories} = useSelector(state => state.vendorProductCategories);

  useEffect(() => {
    if (vendorId) {
      dispatch(fetchVendorDetails(vendorId));
      dispatch(fetchProductsByVendor(vendorId));
      dispatch(fetchVendorProductCategories(vendorId));
    }

    return () => {
      dispatch(resetVendorDetails());
    };
  }, [dispatch, vendorId]);

  const renderImageCarousel = () => {
    // 1. Get both arrays, defaulting to an empty array if null/undefined
    const shopPhotos = vendor?.documents?.shopPhoto || [];
    const shopVideos = vendor?.documents?.shopVideo || [];

    // 2. Combine them into a single media array
    const allMedia = [...shopPhotos, ...shopVideos];

    // 3. Use the combined array, or the fallback if the combined array is empty
    const images = allMedia.length > 0 ? allMedia : [FALLBACK_IMAGE_URL];

    return (
      <VendorDetailsCarousel
        images={images}
        autoPlay={true}
        pagination={true}
      />
    );
  };

  const renderHeader = () => {
    if (!vendor) return null;

    return (
      <View style={{ marginHorizontal: -5 }}>
        {renderImageCarousel()}
        <View style={styles.vendorInfoContainer}>
          <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
          <Text style={styles.vendorName}>
            {vendor.vendorInfo?.businessName}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name="phone" size={30} color="#ff6600" style={{marginRight: 15}} onPress={() => Linking.openURL(`tel:${vendor.vendorInfo?.contactNumber}`)} />
            <Icon name="chat" size={30} color="#ff6600" onPress={() => navigation.navigate('Chat', {vendorId: vendor._id})} />
          </View>
          </View>
          <View style={styles.addressContainer}>
            <Icon name="map-marker" size={16} color="#7f8c8d" />
            <Text style={styles.vendorAddress}>
              {vendor.location?.address?.addressLine1 ||
                'Address not available'}
            </Text>
          </View>
        </View>
        <View style={styles.separator} />
        <VendorCategoryList categories={categories} vendorId={vendorId} />
        <View style={styles.separator} />
      </View>
    );
  };

  // Move useMemo BEFORE conditional returns
  const groupedProducts = useMemo(() => {
    if (!products) return [];

    const grouped = [];
    
    // 1. Group by existing categories
    if (categories && categories.length > 0) {
      categories.forEach(cat => {
        const catProducts = products.filter(
          p => p.vendorProductCategory === cat._id,
        );
        if (catProducts.length > 0) {
          grouped.push({
            ...cat,
            data: catProducts,
          });
        }
      });
    }

    // 2. Handle Uncategorized (products with no vendorProductCategory or not matching any fetched category)
    const categorizedIds = grouped.flatMap(g => g.data.map(p => p._id));
    const uncategorized = products.filter(p => !categorizedIds.includes(p._id));

    if (uncategorized.length > 0) {
      grouped.push({
        _id: 'uncategorized',
        name: 'Uncategorized',
        data: uncategorized,
      });
    }

    // 3. Add "All Products" section containing all products
    if (products.length > 0) {
      grouped.push({
        _id: 'all_products',
        name: 'All Products',
        data: products,
      });
    }

    return grouped;
  }, [products, categories]);

  const renderCategoryItem = ({item}) => {
    const PREVIEW_LIMIT = 4;
    const showViewAll = true; // Always show View All button
    const displayedProducts = item.data.slice(0, PREVIEW_LIMIT);

    const handleViewAll = () => {
      navigation.navigate('VendorCategoryProducts', {
        categoryId: item._id,
        categoryName: item.name,
        vendorId: vendorId,
      });
    };

    return (
      <View style={styles.categorySection}>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryTitle}>{item.name}</Text>
          {showViewAll && (
            <Text style={styles.viewAllText} onPress={handleViewAll}>
              View All
            </Text>
          )}
        </View>
        <View style={styles.productsGrid}>
          {displayedProducts.map(product => (
            <View key={product._id} style={styles.productWrapper}>
              <ProductCard item={product} navigation={navigation} />
            </View>
          ))}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeScreen style={styles.screen}>
        <CustomHeader title={'Vendor Details'} navigation={navigation} />
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color="#ff6600" />
        </View>
      </SafeScreen>
    );
  }

  if (error) {
    return (
      <SafeScreen style={styles.screen}>
        <CustomHeader title={'Vendor Details'} navigation={navigation} />
        <View style={styles.centeredContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeScreen>
    );
  }





  return (
    <SafeScreen style={styles.screen}>
      <CustomHeader title={'Vendor Details'} navigation={navigation} />
      <FlatList
        data={groupedProducts}
        keyExtractor={item => item._id}
        ListHeaderComponent={renderHeader}
        renderItem={renderCategoryItem}
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
    paddingHorizontal: 5,
    paddingBottom: 20,
    paddingTop: 16,
  },
  productCardContainer: {
    flex: 1 / 2,
    padding: 5,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#95a5a6',
    marginTop: 20,
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 16,
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 10,
  },
  viewAllText: {
    fontSize: 14,
    color: '#ff6600',
    fontWeight: '600',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 5,
  },
  productWrapper: {
    width: '50%', // 2 columns
    padding: 5,
  },
});

export default VendorDetails;
