import api from '../../../utils/api';
import {
  INCREASE_QUANTITY,
  DECREASE_QUANTITY,
  ADD_TO_CART,
  REMOVE_ITEM,
  CLEAR_CART,
  
} from './types';

export const addToCart = item => ({
  type: ADD_TO_CART,
  payload: item,
});

export const increaseQuantity = id => ({
  type: INCREASE_QUANTITY,
  payload: id,
});

export const decreaseQuantity = id => ({
  type: DECREASE_QUANTITY,
  payload: id,
});

export const removeItem = id => ({
  type: REMOVE_ITEM,
  payload: id,
});

export const clearCart = () => ({
  type: CLEAR_CART,
});

