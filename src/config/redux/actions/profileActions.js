import api from '../../../utils/api';
import {
  ADD_ADDRESS_REQUEST,
  ADD_ADDRESS_SUCCESS,
  ADD_ADDRESS_FAILURE,
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAILURE,
} from './types';

export const saveAddress = (Office_name, cabin_no) => async dispatch => {
  dispatch({type: ADD_ADDRESS_REQUEST});
  try {
    const response = await api.post('/address_update', {
      Office_name,
      cabin_no,
    });
    dispatch({type: ADD_ADDRESS_SUCCESS, payload: response.data});
    return {success: true, message: 'register success', data: response.data};
  } catch (error) {
    dispatch({type: ADD_ADDRESS_FAILURE, payload: {error}});
    return {
      success: false,
      message: 'register failed',
      data: error.response.data,
    };
  }
};

export const getProfileDetails = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.post('/userprofile');
      resolve({success: true, response: response.data});
    } catch (error) {
      reject({success: false, response: error});
    }
  });
};

export const updateProfile = formData => {
  console.log('updateProfile');
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.post('/updateprofile', formData);
      resolve({success: true, message: 'Profile updated', data: response.data});
    } catch (error) {
      if (error.response) {
        console.log('Error status:', error.response.status);
      }
      console.log(error);
      reject({success: false, message: 'Profile not updated', data: error});
    }
  });
};
