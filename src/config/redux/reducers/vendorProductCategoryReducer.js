import {
  FETCH_VENDOR_PRODUCT_CATEGORIES_REQUEST,
  FETCH_VENDOR_PRODUCT_CATEGORIES_SUCCESS,
  FETCH_VENDOR_PRODUCT_CATEGORIES_FAILURE,
} from '../actions/types';

const initialState = {
  loading: false,
  categories: [],
  error: null,
};

const vendorProductCategoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_VENDOR_PRODUCT_CATEGORIES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_VENDOR_PRODUCT_CATEGORIES_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: action.payload,
      };
    case FETCH_VENDOR_PRODUCT_CATEGORIES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default vendorProductCategoryReducer;
