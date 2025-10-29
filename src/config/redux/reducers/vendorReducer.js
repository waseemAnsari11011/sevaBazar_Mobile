import {
  FETCH_VENDORS_BY_CATEGORY_REQUEST,
  FETCH_VENDORS_BY_CATEGORY_SUCCESS,
  FETCH_VENDORS_BY_CATEGORY_FAILURE,
  RESET_VENDORS_BY_CATEGORY,
  FETCH_VENDOR_DETAILS_REQUEST,
  FETCH_VENDOR_DETAILS_SUCCESS,
  FETCH_VENDOR_DETAILS_FAILURE,
  RESET_VENDOR_DETAILS,
  // 👇 ADD NEW TYPES
  FETCH_ALL_VENDORS_GROUPED_REQUEST,
  FETCH_ALL_VENDORS_GROUPED_SUCCESS,
  FETCH_ALL_VENDORS_GROUPED_FAILURE,
  RESET_ALL_VENDORS_GROUPED,
} from '../actions/types';

// The initial state now combines all vendor-related states
const initialState = {
  list: {
    // For vendors in a single category
    loading: false,
    vendors: [],
    error: null,
  },
  details: {
    // For a single vendor's details
    vendor: null,
    loading: false,
    error: null,
  },
  groupedList: {
    // 👇 ADD THIS NEW STATE SLICE
    loading: false,
    data: [], // Will hold [{ category: ..., vendors: [...] }]
    error: null,
  },
};

// The combined reducer function
export default function (state = initialState, action) {
  const {type, payload} = action;

  switch (type) {
    // --- Vendor List Cases (Single Category) ---
    case FETCH_VENDORS_BY_CATEGORY_REQUEST:
      return {
        ...state,
        list: {
          ...state.list,
          loading: true,
          error: null,
        },
      };
    case FETCH_VENDORS_BY_CATEGORY_SUCCESS:
      return {
        ...state,
        list: {
          ...state.list,
          loading: false,
          vendors: payload,
          error: null,
        },
      };
    case FETCH_VENDORS_BY_CATEGORY_FAILURE:
      return {
        ...state,
        list: {
          ...state.list,
          loading: false,
          vendors: [],
          error: payload,
        },
      };
    case RESET_VENDORS_BY_CATEGORY:
      return {
        ...state,
        list: initialState.list,
      };

    // --- Vendor Details Cases ---
    case FETCH_VENDOR_DETAILS_REQUEST:
      return {
        ...state,
        details: {
          ...state.details,
          loading: true,
          error: null,
        },
      };
    case FETCH_VENDOR_DETAILS_SUCCESS:
      return {
        ...state,
        details: {
          ...state.details,
          loading: false,
          vendor: payload,
          error: null,
        },
      };
    case FETCH_VENDOR_DETAILS_FAILURE:
      return {
        ...state,
        details: {
          ...state.details,
          loading: false,
          vendor: null,
          error: payload,
        },
      };
    case RESET_VENDOR_DETAILS:
      return {
        ...state,
        details: initialState.details,
      };

    // --- ALL VENDORS GROUPED CASES --- 👇 ADD THESE
    case FETCH_ALL_VENDORS_GROUPED_REQUEST:
      return {
        ...state,
        groupedList: {
          ...state.groupedList,
          loading: true,
          error: null,
        },
      };
    case FETCH_ALL_VENDORS_GROUPED_SUCCESS:
      return {
        ...state,
        groupedList: {
          ...state.groupedList,
          loading: false,
          data: payload,
          error: null,
        },
      };
    case FETCH_ALL_VENDORS_GROUPED_FAILURE:
      return {
        ...state,
        groupedList: {
          ...state.groupedList,
          loading: false,
          data: [],
          error: payload,
        },
      };
    case RESET_ALL_VENDORS_GROUPED:
      return {
        ...state,
        groupedList: initialState.groupedList,
      };

    // --- Default Case ---
    default:
      return state;
  }
}
