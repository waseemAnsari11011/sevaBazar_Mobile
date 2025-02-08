import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from './Icons/Icon';
import {baseURL} from '../utils/api';
import calculateDiscountedPrice from '../utils/calculateDiscountedPrice';

const ProductCard = ({item = {}}) => {
  const variation = item?.variations?.[0] || {}; // Default to an empty object to prevent errors
  const originalPrice = variation?.price ?? 0;
  const discount = variation?.discount ?? 0;
  const discountedPrice = calculateDiscountedPrice(originalPrice, discount);
  const imageUrl = item?.images?.[0]
    ? `${baseURL}${item.images[0]}`
    : `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM4sEG5g9GFcy4SUxbzWNzUTf1jMISTDZrTw&s`;

  return (
    <View style={styles.cardContainer}>
      {discount > 0 && (
        <View style={styles.discountTag}>
          <Text style={styles.discountText}>-{discount}%</Text>
        </View>
      )}

      <Image source={{uri: imageUrl}} style={styles.productImage} />

      <View style={{padding: 10}}>
        <Text numberOfLines={2} ellipsizeMode="tail" style={styles.productName}>
          {item?.name || 'Unnamed Product'}
        </Text>
        <Text style={styles.ratingText}>
          {variation?.attributes?.value || 'No attribute'}
        </Text>

        <View style={styles.priceContainer}>
          <Text style={styles.originalPrice}>₹{originalPrice}</Text>
          <Text style={styles.discountedPrice}>₹{discountedPrice}</Text>
        </View>
      </View>
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;
const itemWidth = (windowWidth - 50) / 2;

const styles = StyleSheet.create({
  cardContainer: {
    width: itemWidth,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 10,
  },
  discountTag: {
    position: 'absolute',
    top: 10,
    left: 0,
    backgroundColor: '#ff6600',
    paddingVertical: 4,
    paddingHorizontal: 15,
    borderTopEndRadius: 6,
    borderBottomEndRadius: 6,
    zIndex: 100,
  },
  discountText: {
    color: '#fff',
    fontSize: 14,
  },
  productImage: {
    aspectRatio: 1,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    resizeMode: 'contain',
  },
  ratingText: {
    fontSize: 13,
    color: '#000066',
    fontWeight: '700',
    marginTop: 5,
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginTop: 5,
    width: itemWidth - 15,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  originalPrice: {
    fontSize: 13,
    color: '#777',
    textDecorationLine: 'line-through',
  },
  discountedPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default ProductCard;
