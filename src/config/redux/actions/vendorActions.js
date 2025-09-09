import axios from 'axios';
import {baseURL} from '../../../utils/api'; // Assuming you have baseURL configured
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
    const {data} = await axios.get(
      `${baseURL}/vendors/by-category/${categoryId}`,
    );

    console.log('vendors data==>>', data);
    dispatch({
      type: FETCH_VENDORS_BY_CATEGORY_SUCCESS,
      payload: data, // The API returns the array of vendors directly
    });
  } catch (error) {
    dispatch({
      type: FETCH_VENDORS_BY_CATEGORY_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Action to reset the state, useful when leaving the screen
export const resetVendorsByCategory = () => dispatch => {
  dispatch({type: RESET_VENDORS_BY_CATEGORY});
};
