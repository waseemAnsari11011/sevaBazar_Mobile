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
  const totalVariations = item?.variations?.length || 0;

  const {discountedPrice, originalPrice} = calculateDiscountedPrice(
    basePrice,
    discount,
  );

  const imageUrl = variation?.images?.[0]
    ? variation.images[0]
    : `https://via.placeholder.com/150`;

  const handlePress = () => {
    if (navigation && item) {
      navigation.navigate('Details', {product: item});
    }
  };

  // Extract variation attributes (color, size, etc.)
  const getVariationInfo = () => {
    if (!variation?.attributes || variation.attributes.length === 0)
      return null;

    // Get first 2 attributes to display
    const displayAttributes = variation.attributes.slice(0, 2);
    return displayAttributes.map(attr => ({
      name: attr.name,
      value: attr.value,
    }));
  };

  const variationInfo = getVariationInfo();

  // Check if product is in stock
  const inStock = variation?.quantity > 0;
  const lowStock = variation?.quantity > 0 && variation?.quantity < 10;

  return (
    <TouchableOpacity onPress={handlePress} style={styles.cardContainer}>
      {/* Discount Badge */}
      {discount > 0 && (
        <View style={styles.discountTag}>
          <Text style={styles.discountText}>-{discount}%</Text>
        </View>
      )}

      {/* Stock Status Badge */}
      {!inStock && (
        <View style={[styles.stockBadge, styles.outOfStock]}>
          <Text style={styles.stockBadgeText}>Out of Stock</Text>
        </View>
      )}
      {lowStock && inStock && (
        <View style={[styles.stockBadge, styles.lowStock]}>
          <Text style={styles.stockBadgeText}>
            Only {variation.quantity} left
          </Text>
        </View>
      )}

      <Image source={{uri: imageUrl}} style={styles.productImage} />

      <View style={styles.details}>
        {/* Product Name */}
        <Text numberOfLines={2} ellipsizeMode="tail" style={styles.productName}>
          {item?.name || 'Unnamed Product'}
        </Text>

        {/* Unit Info */}
        {item?.unit && <Text style={styles.unitText}>{item.unit}</Text>}

        {/* Variation Attributes */}
        {variationInfo && variationInfo.length > 0 && (
          <View style={styles.variationContainer}>
            {variationInfo.map((attr, index) => (
              <View key={index} style={styles.variationBadge}>
                <Text style={styles.variationText}>{attr.value}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Available Variations Count */}
        {totalVariations > 1 && (
          <Text style={styles.variationsCount}>
            +{totalVariations - 1} more{' '}
            {totalVariations > 2 ? 'options' : 'option'}
          </Text>
        )}

        {/* Price Container */}
        <View style={styles.priceContainer}>
          <Text style={styles.discountedPrice}>₹{discountedPrice}</Text>
          {discount > 0 && (
            <Text style={styles.originalPrice}>₹{originalPrice}</Text>
          )}
        </View>

        {/* Quick Info Bar */}
        <View style={styles.quickInfoBar}>
          {variation?.quantity > 0 && (
            <View style={styles.quickInfoItem}>
              <Text style={styles.quickInfoText}>In Stock</Text>
            </View>
          )}
          {item?.rating && (
            <View style={styles.quickInfoItem}>
              <Text style={styles.quickInfoText}>★ {item.rating}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 10,
  },
  details: {
    padding: 12,
  },
  discountTag: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#e84118',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    zIndex: 2,
  },
  discountText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  stockBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    zIndex: 2,
  },
  outOfStock: {
    backgroundColor: '#7f8c8d',
  },
  lowStock: {
    backgroundColor: '#f39c12',
  },
  stockBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  productImage: {
    width: '100%',
    aspectRatio: 1,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    minHeight: 34,
    marginBottom: 4,
  },
  unitText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 6,
  },
  variationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
    gap: 6,
  },
  variationBadge: {
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  variationText: {
    fontSize: 11,
    color: '#34495e',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  variationsCount: {
    fontSize: 11,
    color: '#3498db',
    fontWeight: '500',
    marginBottom: 6,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  originalPrice: {
    fontSize: 13,
    color: '#95a5a6',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  discountedPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  quickInfoBar: {
    flexDirection: 'row',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  quickInfoItem: {
    marginRight: 12,
  },
  quickInfoText: {
    fontSize: 10,
    color: '#7f8c8d',
    fontWeight: '500',
  },
});

export default ProductCard;
