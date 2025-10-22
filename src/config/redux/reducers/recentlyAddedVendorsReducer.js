import {
  FETCH_RECENTLY_ADDED_VENDORS_REQUEST,
  FETCH_RECENTLY_ADDED_VENDORS_SUCCESS,
  FETCH_RECENTLY_ADDED_VENDORS_FAILURE,
  UPDATE_RECENTLY_ADDED_VENDORS_PAGE,
  UPDATE_RECENTLY_ADDED_VENDORS_LIMIT,
  RESET_RECENTLY_ADDED_VENDORS,
  REACHED_END_RECENTLY_ADDED_VENDORS,
} from '../actions/types';

const initialState = {
  loading: false,
  vendors: [], // Changed from 'products' to 'vendors'
  error: null,
  page: 1,
  limit: 10,
  reachedEnd: false,
};

const recentlyAddedVendorsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_RECENTLY_ADDED_VENDORS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_RECENTLY_ADDED_VENDORS_SUCCESS:
      return {
        ...state,
        loading: false,
        vendors: [...state.vendors, ...action.payload], // Append new vendors
        error: null,
      };
    case FETCH_RECENTLY_ADDED_VENDORS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case UPDATE_RECENTLY_ADDED_VENDORS_PAGE:
      return {
        ...state,
        page: action.payload,
      };
    case UPDATE_RECENTLY_ADDED_VENDORS_LIMIT:
      return {
        ...state,
        limit: action.payload,
      };
    case RESET_RECENTLY_ADDED_VENDORS:
      return {
        ...initialState,
      };
    case REACHED_END_RECENTLY_ADDED_VENDORS:
      return {
        ...state,
        loading: false,
        reachedEnd: true,
      };
    default:
      return state;
  }
};

export default recentlyAddedVendorsReducer;
