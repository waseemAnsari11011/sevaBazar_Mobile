// actions.js
import api from '../../../utils/api';
import {
    CREATE_INQUIRY_REQUEST,
    CREATE_INQUIRY_SUCCESS,
    CREATE_INQUIRY_FAILURE,
    FETCH_INQUIRIES_REQUEST,
    FETCH_INQUIRIES_SUCCESS,
    FETCH_INQUIRIES_FAILURE,
  } from './types';
  
  // Action to create an inquiry
  export const createInquiry = (subject, message, user) => async (dispatch) => {
    dispatch({ type: CREATE_INQUIRY_REQUEST });
  
    try {
      const response = await api.post('/inquiries', { subject, message, user});
      dispatch({ type: CREATE_INQUIRY_SUCCESS, payload: response.data.inquiry });
    } catch (error) {
      dispatch({
        type: CREATE_INQUIRY_FAILURE,
        payload: error.response ? error.response.data.message : error.message,
      });
    }
  };
  
  // Action to fetch all inquiries
  export const fetchInquiries = (userId) => async (dispatch) => {
    dispatch({ type: FETCH_INQUIRIES_REQUEST });
  
    try {
      const response = await api.get(`/inquiries/${userId}/user`);
      dispatch({ type: FETCH_INQUIRIES_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({
        type: FETCH_INQUIRIES_FAILURE,
        payload: error.response ? error.response.data.message : error.message,
      });
    }
  };
  