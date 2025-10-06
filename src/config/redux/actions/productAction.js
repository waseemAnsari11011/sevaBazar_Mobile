// src/actions/productActions.js

import api from '../../../utils/api';
import {
  GET_PRODUCT_REQUEST,
  GET_PRODUCT_SUCCESS,
  GET_PRODUCT_FAILURE,
  CLEAR_PRODUCT_DETAILS,
  FETCH_PRODUCTS_BY_VENDOR_REQUEST,
  FETCH_PRODUCTS_BY_VENDOR_SUCCESS,
  FETCH_PRODUCTS_BY_VENDOR_FAILURE,
} from './types';

// Action to get a product by ID
export const getProductById = id => async dispatch => {
  dispatch({type: GET_PRODUCT_REQUEST});

  try {
    const response = await api.get(`/single-product/${id}`);
    // console.log("details-->>", response.data.product)
    dispatch({
      type: GET_PRODUCT_SUCCESS,
      payload: response.data.product,
    });
  } catch (error) {
    dispatch({
      type: GET_PRODUCT_FAILURE,
      payload: error.message,
    });
  }
};

export const clearProductDetails = () => ({
  type: CLEAR_PRODUCT_DETAILS,
});

export const fetchProductsByVendor = vendorId => async dispatch => {
  console.log('it is called!!');
  dispatch({type: FETCH_PRODUCTS_BY_VENDOR_REQUEST});
  try {
    const res = await api.get(`/products/vendor/${vendorId}`);

    console.log('res===>>>', res.data);
    dispatch({type: FETCH_PRODUCTS_BY_VENDOR_SUCCESS, payload: res.data});
  } catch (err) {
    dispatch({
      type: FETCH_PRODUCTS_BY_VENDOR_FAILURE,
      payload: err.response?.data?.message || 'Failed to fetch products',
    });
  }
};
