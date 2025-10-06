// src/config/redux/reducers/productsByVendorReducer.js

import {
  FETCH_PRODUCTS_BY_VENDOR_REQUEST,
  FETCH_PRODUCTS_BY_VENDOR_SUCCESS,
  FETCH_PRODUCTS_BY_VENDOR_FAILURE,
} from '../actions/types';

const initialState = {
  products: [],
  loading: false,
  error: null,
};

export default function (state = initialState, action) {
  const {type, payload} = action;

  switch (type) {
    case FETCH_PRODUCTS_BY_VENDOR_REQUEST:
      return {...state, loading: true};
    case FETCH_PRODUCTS_BY_VENDOR_SUCCESS:
      return {...state, loading: false, products: payload, error: null};
    case FETCH_PRODUCTS_BY_VENDOR_FAILURE:
      return {...state, loading: false, error: payload, products: []};
    default:
      return state;
  }
}
