import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from './Icons/Icon';
import { useSelector } from 'react-redux';

const ShoppingCartIcon = ( ) => {
    const cartItems = useSelector(state => state.cart.cartItems);

   
  return (
    <View style={styles.container}>
      <Icon.FontAwesome name="shopping-cart" size={30} color="#000066" />
      {cartItems.length > 0 && (
        <View style={styles.itemCountContainer}>
          <Text style={styles.itemCountText}>{cartItems.length}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemCountContainer: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: 'red',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemCountText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ShoppingCartIcon;
