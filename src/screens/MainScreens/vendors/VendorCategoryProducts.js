import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useSelector } from 'react-redux';
import SafeScreen from '../../../components/SafeScreen';
import CustomHeader from '../../../components/CustomHeader';
import ProductCard from '../../../components/ProductCard';

const VendorCategoryProducts = ({ navigation, route }) => {
  const { categoryId, categoryName } = route.params;
  
  // Get products from the existing store since they were already fetched in VendorDetails
  // This avoids an extra API call and ensures consistency
  const { products } = useSelector(state => state.productsByVendor);

  const categoryProducts = useMemo(() => {
    if (!products) return [];

    if (categoryId === 'all_products') {
      return products;
    }

    if (categoryId === 'uncategorized') {
      // This logic should ideally match what's in VendorDetails.js
      // Since we don't have the full category list here easily without passing it or selecting it,
      // we'll assume uncategorized means no vendorProductCategory is set.
      // However, VendorDetails logic was: products not in any of the fetched categories.
      // For robustness, if we really want to be exact, we should pass the product IDs or filter similarly.
      // But usually 'uncategorized' implies vendorProductCategory is null/undefined.
      // Let's stick to checking if vendorProductCategory is falsy for now, 
      // or if we want to be consistent with VendorDetails, we might need to pass the data.
      // Given the navigation params, we can't easily pass the whole array.
      // Let's assume uncategorized means !vendorProductCategory.
      return products.filter(p => !p.vendorProductCategory);
    }

    return products.filter(p => p.vendorProductCategory === categoryId);
  }, [products, categoryId]);

  const renderItem = ({ item }) => (
    <View style={styles.productWrapper}>
      <ProductCard item={item} navigation={navigation} />
    </View>
  );

  return (
    <SafeScreen style={styles.screen}>
      <CustomHeader title={categoryName} navigation={navigation} />
      <FlatList
        data={categoryProducts}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.centeredContainer}>
            <Text style={styles.emptyText}>No products found in this category.</Text>
          </View>
        }
      />
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  listContainer: {
    padding: 5,
  },
  productWrapper: {
    flex: 1/2, // 50% width for 2 columns
    padding: 5,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#95a5a6',
  },
});

export default VendorCategoryProducts;
