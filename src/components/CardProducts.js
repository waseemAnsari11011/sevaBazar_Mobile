import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { formatCurrency } from '../utils/currency';
import Icon from './Icons/Icon';
import QuantityUpdater from './QuantityUpdater';

import { useSelector } from 'react-redux';
import AddToCartBtn from './AddToCartBtn';

const CardProducts = ({ item, onPressNavigation }) => {
  const { cartItems } = useSelector(state => state.cart);
  const existingItemIndex = cartItems.findIndex(i => i.id === item.id);
  const quantity =
    existingItemIndex !== -1 ? cartItems[existingItemIndex].quantity : 0;

  return (
    <TouchableOpacity
      onPress={onPressNavigation}
      style={{
        marginVertical: 10,
        borederWidth: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        width: 180,
        padding: 10,
        borderRadius: 5,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: '#333',
        shadowOpacity: 0.3,
        shadowRadius: 2,
      }}>
      <Image
        source={{ uri: item?.image_url }}
        style={{ width: 160, height: 100, borderRadius: 5 }}
        resizeMode="cover"
      />
      <View style={{ marginVertical: 10 }}>
        <Text style={{ fontWeight: '400' }}>{item?.name?.slice(0, 25)}...</Text>
        <Text style={{ color: 'black', marginTop: 10, fontWeight: '700' }}>
          {formatCurrency(item?.price)}
        </Text>
      </View>
      {existingItemIndex === -1 ? (
        <AddToCartBtn product={item} />
      ) : (
        <QuantityUpdater quantity={quantity} item={item} />
      )}
    </TouchableOpacity>
  );
};

export default CardProducts;

const styles = StyleSheet.create({});
