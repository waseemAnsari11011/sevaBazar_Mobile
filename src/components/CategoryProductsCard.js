import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput
} from 'react-native';
import React from 'react';
import Icon from './Icons/Icon';
import AddToCartBtn from './AddToCartBtn';
import { addToCart } from '../config/redux/actions/cartActions';
import { useDispatch, useSelector } from 'react-redux';
import QuantityUpdater from './QuantityUpdater';
import { baseURL } from '../utils/api';

const windowWidth = Dimensions.get('window').width;

const CategoryProductsCard = ({ item, onPressNavigation }) => {
  const { cartItems } = useSelector(state => state.cart);
  const dispatch = useDispatch();

  const existingItemIndex = cartItems.findIndex(i => i._id === item._id);
  const quantity =
    existingItemIndex !== -1 ? cartItems[existingItemIndex].quantity : 0;

  const handleAddToCart = item => {
    dispatch(addToCart(item));
  };

  function calculateDiscountedPrice(price, discount) {
    // Convert the price and discount from string to number
    const priceNumber = parseFloat(price);
    const discountNumber = parseFloat(discount);

    // Check if both price and discount are valid numbers
    if (isNaN(priceNumber) || isNaN(discountNumber)) {
      throw new Error('Invalid input: price and discount should be valid numbers');
    }

    // Calculate the discounted price
    const discountedPrice = priceNumber - (priceNumber * discountNumber / 100);

    // Return the discounted price as a string, rounded to 2 decimal places
    return discountedPrice.toFixed(2).toString();
  }


  return (

    <>
      <TouchableOpacity style={styles.container} onPress={onPressNavigation}>
        {item?.images && item.images.length > 0 ? (
          <Image source={{ uri: `${baseURL}${item.images[0]}` }} style={styles.productImage} />
        ) : item?.variations &&
          item.variations.length > 0 &&
          item.variations[0].images &&
          item.variations[0].images.length > 0 ? (
          <Image
            source={{ uri: `${baseURL}${item.variations[0].images[0]}` }}
            style={styles.productImage}
          />
        ) : (
          <Image
            source={{ uri: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM4sEG5g9GFcy4SUxbzWNzUTf1jMISTDZrTw&s` }}
            style={styles.productImage}
          />
        )}
        <View style={styles.detailsContainer}>
          <Text style={styles.productName}>{item.name}</Text>
          {item?.variations && item.variations.length > 0 ? (
            <>
              <Text style={styles.productWeight}>
                {Array.isArray(item.variations[0].attributes)
                  ? item.variations[0].attributes[0]?.value
                  : item.variations[0].attributes?.value}
              </Text>
              <View style={styles.priceContainer}>
                <Text style={styles.discountedPrice}>
                  ₹
                  {calculateDiscountedPrice(
                    item.variations[0].price,
                    item.variations[0].discount
                  )}
                </Text>
                <Text style={styles.originalPrice}>₹{item.variations[0].price}</Text>
              </View>
              <Text style={styles.discountPercentage}>
                -{item.variations[0].discount}%
              </Text>
            </>
          ) : (
            <Text style={{ color: "red", marginTop: 5 }}>Out of Stock</Text>
          )}
        </View>
      </TouchableOpacity>
    </>

  );
};

export default CategoryProductsCard;

const styles = StyleSheet.create({

  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 3,
  },
  productImage: {
    width: windowWidth / 3,
    height: windowWidth / 3,
    marginRight: 15,
    resizeMode: "contain"
  },
  detailsContainer: {
    flex: 1,
    padding: 15
  },
  productName: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 13
  },
  productWeight: {
    color: 'black',
    fontSize: 14,
    fontWeight:"500"
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 7
  },
  discountedPrice: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 15,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    marginLeft: 15,
    fontSize: 17
  },
  discountPercentage: {
    color: '#ff6600',
    marginTop: 2,
    fontSize: 15
  },
  addContainer: {
    flexDirection: "row-reverse",
  },

  addButtonText: {
    color: '#fff',
  },
  callIconContainer: {
    // Style for your call icon container
  },
});
