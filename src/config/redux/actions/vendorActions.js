import api from '../../../utils/api'; // Assuming you have baseURL configured
import {
  FETCH_VENDORS_BY_CATEGORY_REQUEST,
  FETCH_VENDORS_BY_CATEGORY_SUCCESS,
  FETCH_VENDORS_BY_CATEGORY_FAILURE,
  RESET_VENDORS_BY_CATEGORY,
} from './types';

// Action to fetch vendors by their category ID
export const fetchVendorsByCategory = categoryId => async dispatch => {
  dispatch({type: FETCH_VENDORS_BY_CATEGORY_REQUEST});
  try {
    // Your backend endpoint is '/vendors/by-category/:categoryId'
    const {data} = await api.get(`/vendors/by-category/${categoryId}`);

    console.log('vendors data==>>', data);
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
    const message =
      error.response?.data?.message || 'Failed to search for vendors';
    dispatch({type: FETCH_VENDORS_BY_CATEGORY_FAILURE, payload: message});
  }
};
