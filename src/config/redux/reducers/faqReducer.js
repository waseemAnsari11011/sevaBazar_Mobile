// reducer.js
import {
    FETCH_FAQS_REQUEST,
    FETCH_FAQS_SUCCESS,
    FETCH_FAQS_FAILURE,
  } from '../actions/types';
  
  const initialState = {
    loading: false,
    faqs: [],
    error: '',
  };
  
  const faqReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_FAQS_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case FETCH_FAQS_SUCCESS:
        return {
          loading: false,
          faqs: action.payload,
          error: '',
        };
      case FETCH_FAQS_FAILURE:
        return {
          loading: false,
          faqs: [],
          error: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default faqReducer;
  