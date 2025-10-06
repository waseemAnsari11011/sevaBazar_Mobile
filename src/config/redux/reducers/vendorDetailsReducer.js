// src/config/redux/reducers/vendorDetailsReducer.js

import {
  FETCH_VENDOR_DETAILS_REQUEST,
  FETCH_VENDOR_DETAILS_SUCCESS,
  FETCH_VENDOR_DETAILS_FAILURE,
  RESET_VENDOR_DETAILS,
} from '../actions/types';

const initialState = {
  vendor: null,
  loading: false,
  error: null,
};

export default function (state = initialState, action) {
  const {type, payload} = action;

  switch (type) {
    case FETCH_VENDOR_DETAILS_REQUEST:
      return {...state, loading: true};
    case FETCH_VENDOR_DETAILS_SUCCESS:
      return {...state, loading: false, vendor: payload, error: null};
    case FETCH_VENDOR_DETAILS_FAILURE:
      return {...state, loading: false, error: payload, vendor: null};
    case RESET_VENDOR_DETAILS:
      return initialState;
    default:
      return state;
  }
}
