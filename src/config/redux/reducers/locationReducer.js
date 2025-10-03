// src/config/redux/reducers/locationReducer.js
import {
  GET_LOCATION_REQUEST,
  GET_LOCATION_SUCCESS,
  GET_LOCATION_FAILURE,
  LOCATION_PERMISSION_DENIED,
} from '../actions/types';

const initialState = {
  location: null,
  loading: false,
  error: null,
  permissionDenied: false, // Track if user explicitly denied permission
};

const locationReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_LOCATION_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_LOCATION_SUCCESS:
      return {
        ...state,
        loading: false,
        location: action.payload,
        permissionDenied: false,
      };
    case GET_LOCATION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case LOCATION_PERMISSION_DENIED:
      return {
        ...state,
        loading: false,
        permissionDenied: true,
      };
    default:
      return state;
  }
};

export default locationReducer;
