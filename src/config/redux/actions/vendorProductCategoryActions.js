import api from '../../../utils/api';
import {
  FETCH_VENDOR_PRODUCT_CATEGORIES_REQUEST,
  FETCH_VENDOR_PRODUCT_CATEGORIES_SUCCESS,
  FETCH_VENDOR_PRODUCT_CATEGORIES_FAILURE,
} from './types';

export const fetchVendorProductCategories = (vendorId) => async (dispatch) => {
  dispatch({ type: FETCH_VENDOR_PRODUCT_CATEGORIES_REQUEST });
  try {
    const { data } = await api.get(
      `/vendor-product-category/vendor/${vendorId}`
    );
    dispatch({
      type: FETCH_VENDOR_PRODUCT_CATEGORIES_SUCCESS,
      payload: data.categories,
    });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      'Failed to fetch vendor product categories.';
    console.error('Error fetching vendor product categories:', errorMessage);
    dispatch({
      type: FETCH_VENDOR_PRODUCT_CATEGORIES_FAILURE,
      payload: errorMessage,
    });
  }
};
