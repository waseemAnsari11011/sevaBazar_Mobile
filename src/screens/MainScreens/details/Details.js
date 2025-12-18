// src/screens/MainScreens/details/Details.js

import React, {useEffect, useMemo} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

// --- Local Imports ---
import useProductVariations from './useProductVariations';
import {getProductById} from '../../../config/redux/actions/productAction';
import {
  fetchSimilarProducts,
  resetSimilarProducts,
} from '../../../config/redux/actions/similiarProductsActions';
import {getImages} from './utils';
import HorizontalSelector from './HorizontalSelector';

// --- Component Imports ---
import CustomImageCarousalSquare from '../../../components/CustomImageCarousalSquare';
import StickyButton from '../../../components/stickyBottomCartBtn';
import ProductCard from '../../../components/ProductCard';
import calculateDiscountedPrice from '../../../utils/calculateDiscountedPrice';

const ProductDetails = ({route, navigation}) => {
  const dispatch = useDispatch();
  const productId = route.params.product._id;

  // --- Redux State ---
  const {
    product: productDetails,
    loading: productDetailsLoading,
    error: productDetailsError,
  } = useSelector(state => state.product);

  // Similar Products State
  const {
    products: similarProducts,
    loading: similarProductsLoading,
  } = useSelector(state => state.similarProducts);

  console.log('productDetails-->>', productDetails);

  // --- Custom Hook for Variation Logic ---
  const {
    currentVariation,
    attributeTypes,
    selectedAttributes,
    handleSelectAttribute,
    getAvailableOptions,
    isOptionAvailable, // Get the new function from the hook
  } = useProductVariations(productDetails?.variations);

  // --- Data Fetching ---
  useEffect(() => {
    if (productId) {
      dispatch(getProductById(productId));

      // Fetch Similar Products
      // We pass 1 as page, and 6 as limit (or whatever number fits design)
      dispatch(resetSimilarProducts());
      dispatch(fetchSimilarProducts(productId, 1, 6));
    }
  }, [dispatch, productId]);

  // --- Memoized Price Calculation ---
  // This safely calculates the price and only re-runs when the variation changes.
  const {discountedPrice, originalPrice} = useMemo(
    () =>
      calculateDiscountedPrice(
        currentVariation?.price,
        currentVariation?.discount,
      ),
    [currentVariation],
  );

  // --- Loading State ---
  if (productDetailsLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#e84118" />
      </View>
    );
  }

  // --- Error State ---
  if (productDetailsError || !productDetails) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          Could not load product. Please try again.
        </Text>
      </View>
    );
  }

  // --- Header Component for FlatList ---
  const ListHeaderComponent = () => {
    // **CRASH FIX:** Ensure the carousel always gets an array.
    const carouselImages = getImages(currentVariation, productDetails) || [];
    // console.log('carouselImages', carouselImages);

    return (
      <View>
        <CustomImageCarousalSquare images={carouselImages} />
        <View style={styles.detailsContainer}>
          <Text style={styles.productName}>{productDetails.name}</Text>

          {/* Conditionally render price section only when a variation is selected */}
          {currentVariation ? (
            <View style={styles.priceContainer}>
              <Text style={styles.discountedPrice}>₹{discountedPrice}</Text>
              {parseFloat(originalPrice) > parseFloat(discountedPrice) && (
                <Text style={styles.originalPrice}>₹{originalPrice}</Text>
              )}
              {currentVariation.discount > 0 && (
                <Text style={styles.discountBadge}>
                  {currentVariation.discount}% OFF
                </Text>
              )}
            </View>
          ) : (
            <Text style={styles.unavailableText}>
              This combination is unavailable.
            </Text>
          )}

          {/* Attribute selectors */}
          {attributeTypes.map(name => (
            <HorizontalSelector
              key={name}
              attributeName={name}
              options={getAvailableOptions(name)}
              selectedValue={selectedAttributes[name]}
              onSelect={handleSelectAttribute}
              isOptionAvailable={isOptionAvailable} // Pass the function down as a prop
            />
          ))}

          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.descriptionText}>
            {productDetails.description}
          </Text>
          {similarProducts.length > 0 && (
            <Text style={styles.frequentlyBoughtTitle}>Similar Products</Text>
          )}
        </View>
      </View>
    );
  };

  // --- Main Render ---
  return (
    <View style={styles.flex}>
      <FlatList
        data={similarProducts} // Replace with similar products data source
        renderItem={({item}) => (
          <View style={{width: '50%', padding: 5}}>
            <ProductCard item={item} navigation={navigation} />
          </View>
        )}
        keyExtractor={item => item._id}
        numColumns={2}
        ListHeaderComponent={ListHeaderComponent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
      {/* Sticky button only appears when a valid variation is selected */}
      {currentVariation && (
        <StickyButton
          product={productDetails}
          variation={currentVariation}
          navigation={navigation}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {flex: 1, backgroundColor: '#fff'},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  errorText: {fontSize: 16, color: 'red'},
  detailsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#fff',
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  discountedPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#e84118',
  },
  originalPrice: {
    fontSize: 16,
    color: '#7f8c8d',
    textDecorationLine: 'line-through',
    marginLeft: 10,
  },
  discountBadge: {
    fontSize: 12,
    color: 'green',
    fontWeight: 'bold',
    marginLeft: 10,
    backgroundColor: '#d4edda',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  unavailableText: {
    fontSize: 16,
    color: '#c0392b',
    marginVertical: 10,
    fontWeight: '500',
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#34495e',
  },
  frequentlyBoughtTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  listContent: {
    paddingBottom: 80, // Space for the sticky button
  },
});

export default ProductDetails;
