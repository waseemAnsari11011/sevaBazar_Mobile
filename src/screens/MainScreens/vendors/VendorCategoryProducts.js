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
    let filteredProducts = [];
    if (!products) {
      filteredProducts = [];
    } else if (categoryId === 'all_products') {
      filteredProducts = products;
    } else if (categoryId === 'uncategorized') {
      filteredProducts = products.filter(p => !p.vendorProductCategory);
    } else {
      filteredProducts = products.filter(p => p.vendorProductCategory === categoryId);
    }

    // Shuffle the filtered products
    // We create a copy to avoid mutating the original array
    let shuffled = [...filteredProducts];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
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
    flex: 1 / 2, // 50% width for 2 columns
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
