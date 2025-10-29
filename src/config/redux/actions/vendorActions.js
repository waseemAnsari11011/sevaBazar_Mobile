import api from '../../../utils/api'; // Assuming you have baseURL configured
import {
  // Types for fetching vendors by a single category
  FETCH_VENDORS_BY_CATEGORY_REQUEST,
  FETCH_VENDORS_BY_CATEGORY_SUCCESS,
  FETCH_VENDORS_BY_CATEGORY_FAILURE,
  RESET_VENDORS_BY_CATEGORY,

  // Types for fetching a single vendor's details
  FETCH_VENDOR_DETAILS_REQUEST,
  FETCH_VENDOR_DETAILS_SUCCESS,
  FETCH_VENDOR_DETAILS_FAILURE,
  RESET_VENDOR_DETAILS,

  // Types for fetching all vendors grouped by category for the home screen
  FETCH_ALL_VENDORS_GROUPED_REQUEST,
  FETCH_ALL_VENDORS_GROUPED_SUCCESS,
  FETCH_ALL_VENDORS_GROUPED_FAILURE,
  RESET_ALL_VENDORS_GROUPED,
} from './types';

// Action to fetch vendors by their category ID
export const fetchVendorsByCategory = categoryId => async dispatch => {
  dispatch({type: FETCH_VENDORS_BY_CATEGORY_REQUEST});
  try {
    // Your backend endpoint is '/vendors/by-category/:categoryId'
    const {data} = await api.get(`/vendors/customer/by-category/${categoryId}`);

    dispatch({
      type: FETCH_VENDORS_BY_CATEGORY_SUCCESS,
      payload: data, // The API returns the array of vendors directly
    });
  } catch (error) {
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

// Action to search vendors (reuses the same reducer as fetchVendorsByCategory)
export const searchVendors = (categoryId, query) => async dispatch => {
  dispatch({type: FETCH_VENDORS_BY_CATEGORY_REQUEST});
  try {
    // Call the new search API endpoint
    const response = await api.get(
      `/vendors/customer/search/${categoryId}?q=${query}`,
    );
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

// Action to fetch a single vendor's details
export const fetchVendorDetails = vendorId => async dispatch => {
  dispatch({type: FETCH_VENDOR_DETAILS_REQUEST});
  try {
    // Corrected API endpoint
    const res = await api.get(`/vendors/customer/${vendorId}/details`);
    dispatch({type: FETCH_VENDOR_DETAILS_SUCCESS, payload: res.data});
  } catch (err) {
    // Corrected to use the proper FAILURE type
    dispatch({
      type: FETCH_VENDOR_DETAILS_FAILURE,
      payload: err.response?.data?.message || 'Failed to fetch vendor details',
    });
  }
};

// Action to reset the vendor details state
export const resetVendorDetails = () => ({type: RESET_VENDOR_DETAILS});

// --- New Actions for Grouped Vendors ---

// Action to fetch all vendors grouped by category
export const fetchAllVendorsGrouped = () => async dispatch => {
  dispatch({type: FETCH_ALL_VENDORS_GROUPED_REQUEST});
  try {
    const {data} = await api.get('/vendors/customer/all-by-category');
    dispatch({
      type: FETCH_ALL_VENDORS_GROUPED_SUCCESS,
      payload: data, // This will be the array: [{ category: ..., vendors: [...] }]
    });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || 'Failed to fetch all vendors.';
    console.error('Error fetching all vendors grouped:', errorMessage);
    dispatch({
      type: FETCH_ALL_VENDORS_GROUPED_FAILURE,
      payload: errorMessage,
    });
  }
};

// Action to reset the grouped vendors state
export const resetAllVendorsGrouped = () => dispatch => {
  dispatch({type: RESET_ALL_VENDORS_GROUPED});
};
