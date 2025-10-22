// src/components/ProductCard.js

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import calculateDiscountedPrice from '../utils/calculateDiscountedPrice';

const ProductCard = ({item = {}, navigation}) => {
  const variation = item?.variations?.[0] || {};
  const basePrice = variation?.price ?? 0;
  const discount = variation?.discount ?? 0;

  const {discountedPrice, originalPrice} = calculateDiscountedPrice(
    basePrice,
    discount,
  );

  const imageUrl = variation?.images?.[0]
    ? variation.images[0]
    : `https://via.placeholder.com/150`;

  const handlePress = () => {
    if (navigation && item) {
      // --- BUG FIX IS HERE ---
      // Changed 'ProductDetails' to 'Details' to navigate to the correct screen.
      navigation.navigate('Details', {product: item});
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.cardContainer}>
      {discount > 0 && (
        <View style={styles.discountTag}>
          <Text style={styles.discountText}>-{discount}%</Text>
        </View>
      )}

      <Image source={{uri: imageUrl}} style={styles.productImage} />

      <View style={styles.details}>
        <Text numberOfLines={2} ellipsizeMode="tail" style={styles.productName}>
          {item?.name || 'Unnamed Product'}
        </Text>

        <View style={styles.priceContainer}>
          <Text style={styles.discountedPrice}>₹{discountedPrice}</Text>
          {discount > 0 && (
            <Text style={styles.originalPrice}>₹{originalPrice}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Styles (no changes needed here)
const windowWidth = Dimensions.get('window').width;
const itemWidth = windowWidth / 2 - 15; // Adjusted for container padding

const styles = StyleSheet.create({
  cardContainer: {
    // width: itemWidth, // Removed fixed width to allow flex to work
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    marginBottom: 10,
  },
  details: {
    padding: 10,
  },
  discountTag: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#e84118',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
    zIndex: 1,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productImage: {
    width: '100%',
    aspectRatio: 1,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    minHeight: 34,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  originalPrice: {
    fontSize: 13,
    color: '#777',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  discountedPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
});

export default ProductCard;
