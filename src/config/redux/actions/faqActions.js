// actions.js
import axios from 'axios';
import {
  FETCH_FAQS_REQUEST,
  FETCH_FAQS_SUCCESS,
  FETCH_FAQS_FAILURE,
} from './types';
import api from '../../../utils/api';


export const fetchFAQsRequest = () => ({
  type: FETCH_FAQS_REQUEST,
});

export const fetchFAQsSuccess = (faqs) => ({
  type: FETCH_FAQS_SUCCESS,
  payload: faqs,
});

export const fetchFAQsFailure = (error) => ({
  type: FETCH_FAQS_FAILURE,
  payload: error,
});

export const fetchFAQs = () => {
  return async (dispatch) => {
    dispatch(fetchFAQsRequest());
    try {
      const response = await api.get('/faqs');
      dispatch(fetchFAQsSuccess(response.data));
    } catch (error) {
      dispatch(fetchFAQsFailure(error.message));
    }
  };
};
