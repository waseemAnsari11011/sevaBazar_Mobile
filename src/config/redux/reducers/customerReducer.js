import {
    UPDATE_CUSTOMER_REQUEST,
    UPDATE_CUSTOMER_SUCCESS,
    UPDATE_CUSTOMER_FAILURE
  } from '../actions/types';
  
  // Initial state for customer
  const initialState = {
    loading: false,
    error: null,
    customer: null
  };
  
  // Reducer for updating customer
  const customerReducer = (state = initialState, action) => {
    switch (action.type) {
      case UPDATE_CUSTOMER_REQUEST:
        return {
          ...state,
          loading: true,
          error: null
        };
      case UPDATE_CUSTOMER_SUCCESS:
        return {
          ...state,
          loading: false,
          customer: action.payload,
          error: null
        };
      case UPDATE_CUSTOMER_FAILURE:
        return {
          ...state,
          loading: false,
          customer: null,
          error: action.payload
        };
      default:
        return state;
    }
  };
  
  export default customerReducer;
  