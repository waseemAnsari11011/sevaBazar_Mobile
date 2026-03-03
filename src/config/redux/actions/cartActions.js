import api from '../../../utils/api';
import {
  INCREASE_QUANTITY,
  DECREASE_QUANTITY,
  ADD_TO_CART,
  REMOVE_ITEM,
  CLEAR_CART,
  LOAD_CART_SUCCESS
} from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_STORAGE_KEY = 'cart_items';

const saveCartToStorage = async (cartItems) => {
  try {
    await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  } catch (error) {
    console.error('Error saving cart to storage:', error);
  }
};

export const addToCart = item => {
  return (dispatch, getState) => {
    dispatch({
      type: ADD_TO_CART,
      payload: item,
    });
    saveCartToStorage(getState().cart.cartItems);
  };
};

export const increaseQuantity = id => {
  return (dispatch, getState) => {
    dispatch({
      type: INCREASE_QUANTITY,
      payload: id,
    });
    saveCartToStorage(getState().cart.cartItems);
  };
};

export const decreaseQuantity = id => {
  return (dispatch, getState) => {
    dispatch({
      type: DECREASE_QUANTITY,
      payload: id,
    });
    saveCartToStorage(getState().cart.cartItems);
  };
};

export const removeItem = id => {
  return (dispatch, getState) => {
    dispatch({
      type: REMOVE_ITEM,
      payload: id,
    });
    saveCartToStorage(getState().cart.cartItems);
  };
};

export const clearCart = () => {
  return (dispatch, getState) => {
    dispatch({
      type: CLEAR_CART,
    });
    saveCartToStorage([]);
  };
};

export const loadCart = () => {
  return async dispatch => {
    try {
      const cartData = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (cartData) {
        dispatch({
          type: LOAD_CART_SUCCESS,
          payload: JSON.parse(cartData),
        });
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
    }
  };
};

