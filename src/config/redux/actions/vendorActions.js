import api from '../../../utils/api'; // Assuming you have baseURL configured
import {
  FETCH_VENDORS_BY_CATEGORY_REQUEST,
  FETCH_VENDORS_BY_CATEGORY_SUCCESS,
  FETCH_VENDORS_BY_CATEGORY_FAILURE,
  RESET_VENDORS_BY_CATEGORY,
  FETCH_VENDOR_DETAILS_REQUEST,
  FETCH_VENDOR_DETAILS_SUCCESS,
  RESET_VENDOR_DETAILS,
} from './types';

// Action to fetch vendors by their category ID
export const fetchVendorsByCategory = categoryId => async dispatch => {
  dispatch({type: FETCH_VENDORS_BY_CATEGORY_REQUEST});
  try {
    // Your backend endpoint is '/vendors/by-category/:categoryId'
    const {data} = await api.get(`/vendors/by-category/${categoryId}`);

    // console.log('vendors data==>>', data);
    dispatch({
      type: FETCH_VENDORS_BY_CATEGORY_SUCCESS,
      payload: data, // The API returns the array of vendors directly
    });
  } catch (error) {
    // Adopting the more robust error message pattern from the inspiration code.
    const errorMessage =
      error.response?.data?.message ||
      'Failed to fetch vendors for this category.';
    console.error('Error fetching vendors by category:', errorMessage);
    dispatch({
      type: FETCH_VENDORS_BY_CATEGORY_FAILURE,
      payload: errorMessage,
    });
  }
};

// Action to reset the state, useful when leaving the screen
export const resetVendorsByCategory = () => dispatch => {
  dispatch({type: RESET_VENDORS_BY_CATEGORY});
};

export const searchVendors = (categoryId, query) => async dispatch => {
  dispatch({type: FETCH_VENDORS_BY_CATEGORY_REQUEST});
  try {
    // Call the new search API endpoint
    const response = await api.get(`/vendors/search/${categoryId}?q=${query}`);
    dispatch({
      type: FETCH_VENDORS_BY_CATEGORY_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    console.log('error===>>>', error);
    const message =
      error.response?.data?.message || 'Failed to search for vendors';
    dispatch({type: FETCH_VENDORS_BY_CATEGORY_FAILURE, payload: message});
  }
};

export const fetchVendorDetails = vendorId => async dispatch => {
  dispatch({type: FETCH_VENDOR_DETAILS_REQUEST});
  try {
    // Corrected API endpoint
    const res = await api.get(`/vendors/${vendorId}/details`);
    dispatch({type: FETCH_VENDOR_DETAILS_SUCCESS, payload: res.data});
  } catch (err) {
    dispatch({
      type: FETCH_VENDOR_DETAILS_FAILURE,
      payload: err.response?.data?.message || 'Failed to fetch vendor details',
    });
  }
};

export const resetVendorDetails = () => ({type: RESET_VENDOR_DETAILS});
