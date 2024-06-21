import api from '../../../utils/api';
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
} from './types';

export const login = body => async dispatch => {
  dispatch({ type: LOGIN_REQUEST });
  console.log('credentials:', body);
  try {
    const response = await api.post('/customers/login', body);
    dispatch({ type: LOGIN_SUCCESS, payload: response.data });


    return { success: true, message: 'Login success', user: response.data.customer, token: response.data.token};
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Login failed';
    alert(errorMessage);
    dispatch({ type: LOGIN_FAILURE, payload: { error: errorMessage } });
    return { success: false, message: errorMessage, data: error };
  }
};

export const PhoneLogin = body => async dispatch => {
  dispatch({ type: LOGIN_REQUEST });
  console.log('credentials phone:', body);
  try {
    const response = await api.post('/customers/login/phone', body);
    dispatch({ type: LOGIN_SUCCESS, payload: response.data });


    return { success: true, message: 'Login success', user: response.data.customer, token: response.data.token};
  } catch (error) {
    console.log("error-->>", error)
    const errorMessage = error.response?.data?.message || 'Login failed';
    alert(errorMessage);
    dispatch({ type: LOGIN_FAILURE, payload: { error: errorMessage } });
    return { success: false, message: errorMessage, data: error };
  }
};


export const register = (pincode, contact, email, password) => async dispatch => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    console.log(pincode, contact, email, password)
    const response = await api.post('/customers/signup', {
      contactNumber: contact,
      email,
      password,
      availableLocalities: pincode // Assuming this is an empty array for new customers
    });
    dispatch({ type: REGISTER_SUCCESS, payload: response.data });
    return { success: true, message: 'register success', data: response.data };
  } catch (error) {
    console.log(error)
    if (error.response && error.response.data && error.response.data.error) {
      alert(error.response.data.error);
    }
    dispatch({ type: REGISTER_FAILURE, payload: { error } });
    return { success: false, message: 'register failed', data: error };
  }
};


export const logout = () => async dispatch => {
  console.log(' logout api');
  dispatch({ type: LOGOUT_REQUEST });
  try {
    const response = await api.post('/logout');
    console.log('res', response.data);
    dispatch({ type: LOGOUT_SUCCESS });
  } catch (error) {
    console.log('logout err', error);
    dispatch({ type: LOGOUT_FAILURE, payload: { error } });
  }
};
