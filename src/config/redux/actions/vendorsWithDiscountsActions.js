// actions/vendorsWithDiscountsActions.js
import api from '../../../utils/api';
import {
  FETCH_VENDORS_WITH_DISCOUNTS_REQUEST,
  FETCH_VENDORS_WITH_DISCOUNTS_SUCCESS,
  FETCH_VENDORS_WITH_DISCOUNTS_FAILURE,
  UPDATE_VENDORS_WITH_DISCOUNTS_PAGE,
  UPDATE_VENDORS_WITH_DISCOUNTS_LIMIT,
  RESET_VENDORS_WITH_DISCOUNTS,
  REACHED_END_VENDORS_WITH_DISCOUNTS,
} from './types';

// The userLocation parameter is no longer needed here,
// as the backend automatically determines location from the authenticated user.
export const fetchVendorsWithDiscounts = (page, limit) => async dispatch => {
  dispatch({type: FETCH_VENDORS_WITH_DISCOUNTS_REQUEST});
  try {
    // 👇 Updated API endpoint and removed userLocation from params
    const response = await api.get(`vendors/customer/with-discounts`, {
      params: {page, limit},
    });

    // 👇 Check the 'vendors' array in the response
    if (response.data.vendors.length === 0) {
      dispatch({type: REACHED_END_VENDORS_WITH_DISCOUNTS});
    } else {
      // 👇 Dispatch the 'vendors' array as the payload
      dispatch({
        type: FETCH_VENDORS_WITH_DISCOUNTS_SUCCESS,
        payload: response.data.vendors,
      });
    }
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || 'Failed to fetch vendors';
    console.error('Error fetching vendors with discounts:', errorMessage);
    dispatch({
      type: FETCH_VENDORS_WITH_DISCOUNTS_FAILURE,
      payload: errorMessage,
    });
  }
};

export const updateVendorsWithDiscountsPage = page => ({
  type: UPDATE_VENDORS_WITH_DISCOUNTS_PAGE,
  payload: page,
});

export const updateVendorsWithDiscountsLimit = limit => ({
  type: UPDATE_VENDORS_WITH_DISCOUNTS_LIMIT,
  payload: limit,
});

export const resetVendorsWithDiscounts = () => ({
  type: RESET_VENDORS_WITH_DISCOUNTS,
});
