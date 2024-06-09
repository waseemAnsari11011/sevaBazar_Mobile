import {StyleSheet, Text, TouchableOpacity, Alert, Dimensions} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from './Icons/Icon';
import {useDispatch, useSelector} from 'react-redux';
import {
  startTimer,
  decrementTimer,
  placeOrder,
  addToCart,
} from '../config/redux/actions/cartActions';
import {getBalance} from '../config/redux/actions/orderTrackingActions';
const windowWidth = Dimensions.get('window').width;

const AddToCartBtn = ({product}) => {
  const {timer, cartItems} = useSelector(state => state.cart);
  const dispatch = useDispatch();

  const handleAddToCart = item => {
    dispatch(addToCart(item));
  };



  const showAlert = () => {
    handleAddToCart(product);
  };

  return (
    <TouchableOpacity
      onPress={showAlert}
      style={{
        padding: 5,
        borderColor: 'green',
        borderWidth: 1,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        fontWidth: 5,
        width:windowWidth/4
      }}>
      <Icon.AntDesign
        name="plus"
        size={20}
        style={{color: 'green', marginRight: 5}}
      />
      <Text style={{color: 'green', fontWeight: '600',}}>ORDER</Text>
    </TouchableOpacity>
  );
};

export default AddToCartBtn;

const styles = StyleSheet.create({});
