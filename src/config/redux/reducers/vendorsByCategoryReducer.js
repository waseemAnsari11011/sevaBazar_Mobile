import {
  FETCH_VENDORS_BY_CATEGORY_REQUEST,
  FETCH_VENDORS_BY_CATEGORY_SUCCESS,
  FETCH_VENDORS_BY_CATEGORY_FAILURE,
  RESET_VENDORS_BY_CATEGORY,
} from '../actions/types';

const initialState = {
  loading: false,
  vendors: [],
  error: null,
};

// The reducer function remains the same
const vendorsByCategoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_VENDORS_BY_CATEGORY_REQUEST:
      return {...state, loading: true, error: null}; // Also clear previous errors on new request
    case FETCH_VENDORS_BY_CATEGORY_SUCCESS:
      return {loading: false, vendors: action.payload, error: null};
    case FETCH_VENDORS_BY_CATEGORY_FAILURE:
      return {loading: false, vendors: [], error: action.payload};
    case RESET_VENDORS_BY_CATEGORY:
      return initialState;
    default:
      return state;
  }
};

// Changed from a named export to a default export
export default vendorsByCategoryReducer;
