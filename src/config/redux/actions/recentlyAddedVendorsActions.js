import api from '../../../utils/api';
import {
  FETCH_RECENTLY_ADDED_VENDORS_REQUEST,
  FETCH_RECENTLY_ADDED_VENDORS_SUCCESS,
  FETCH_RECENTLY_ADDED_VENDORS_FAILURE,
  UPDATE_RECENTLY_ADDED_VENDORS_PAGE,
  UPDATE_RECENTLY_ADDED_VENDORS_LIMIT,
  RESET_RECENTLY_ADDED_VENDORS,
  REACHED_END_RECENTLY_ADDED_VENDORS,
} from './types';

export const fetchRecentlyAddedVendors =
  (page, limit, userLocation) => async dispatch => {
    dispatch({type: FETCH_RECENTLY_ADDED_VENDORS_REQUEST});
    try {
      console.log('Fetching vendors page, limit', page, limit);
      // We use the /all/vendor route which we will modify to accept pagination
      const response = await api.get(`vendors/all/vendor`, {
        params: {page, limit},
      });

      // The controller will return { vendors: [...] }
      if (response.data.vendors.length === 0) {
        dispatch({type: REACHED_END_RECENTLY_ADDED_VENDORS});
      } else {
        dispatch({
          type: FETCH_RECENTLY_ADDED_VENDORS_SUCCESS,
          payload: response.data.vendors,
        });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        'Failed to fetch recently added vendors';
      console.error('Error fetching recently added vendors:', errorMessage);
      dispatch({
        type: FETCH_RECENTLY_ADDED_VENDORS_FAILURE,
        payload: errorMessage,
      });
    }
  };

export const updateRecentlyAddedVendorsPage = page => ({
  type: UPDATE_RECENTLY_ADDED_VENDORS_PAGE,
  payload: page,
});

export const updateRecentlyAddedVendorsLimit = limit => ({
  type: UPDATE_RECENTLY_ADDED_VENDORS_LIMIT,
  payload: limit,
});

export const resetRecentlyAddedVendors = () => ({
  type: RESET_RECENTLY_ADDED_VENDORS,
});
