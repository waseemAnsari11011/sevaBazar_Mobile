// reducers/vendorsWithDiscountsReducer.js
import {
  FETCH_VENDORS_WITH_DISCOUNTS_REQUEST,
  FETCH_VENDORS_WITH_DISCOUNTS_SUCCESS,
  FETCH_VENDORS_WITH_DISCOUNTS_FAILURE,
  UPDATE_VENDORS_WITH_DISCOUNTS_PAGE,
  UPDATE_VENDORS_WITH_DISCOUNTS_LIMIT,
  RESET_VENDORS_WITH_DISCOUNTS,
  REACHED_END_VENDORS_WITH_DISCOUNTS,
} from '../actions/types';

const initialState = {
  loading: false,
  vendors: [], // Renamed from 'products' to 'vendors'
  error: null,
  page: 1,
  limit: 10,
  reachedEnd: false,
};

const vendorsWithDiscountsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_VENDORS_WITH_DISCOUNTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_VENDORS_WITH_DISCOUNTS_SUCCESS:
      return {
        ...state,
        loading: false,
        vendors: [...state.vendors, ...action.payload], // Append new vendors
        error: null,
      };
    case FETCH_VENDORS_WITH_DISCOUNTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case UPDATE_VENDORS_WITH_DISCOUNTS_PAGE:
      return {
        ...state,
        page: action.payload,
      };
    case UPDATE_VENDORS_WITH_DISCOUNTS_LIMIT:
      return {
        ...state,
        limit: action.payload,
      };
    case RESET_VENDORS_WITH_DISCOUNTS:
      return {
        ...initialState,
      };
    case REACHED_END_VENDORS_WITH_DISCOUNTS:
      return {
        ...state,
        loading: false,
        reachedEnd: true,
      };
    default:
      return state;
  }
};

export default vendorsWithDiscountsReducer;
