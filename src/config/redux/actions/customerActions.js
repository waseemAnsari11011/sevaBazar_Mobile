import { useSelector } from 'react-redux';
import api from '../../../utils/api';
import { selectUserData } from '../reducers/storageReducer';
import { UPDATE_CUSTOMER_REQUEST, UPDATE_CUSTOMER_SUCCESS, UPDATE_CUSTOMER_FAILURE } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Action creator with asynchronous API call
export const updateCustomer = (token, customerId, formData) => async dispatch => {
    dispatch({ type: UPDATE_CUSTOMER_REQUEST });

    try {
        const response = await api.put(`/single-customer/${customerId}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        // console.log("response.data-->>", response.data)

        dispatch({ type: UPDATE_CUSTOMER_SUCCESS, payload: response.data });
        return { success: true, user: response.data };

    } catch (error) {
        dispatch({ type: UPDATE_CUSTOMER_FAILURE, payload: error.message });
    }
};

export const updateFcm = async ( data) => {
    const user = await AsyncStorage.getItem('user');
    const userData = JSON.parse(user)
    console.log(" updateFcm token-->>", data)
    try {
        const response = await api.put(`/update-fcm/${userData?._id}`, {fcmDeviceToken:data});
        // console.log("response.data-->>", response.data);
        return { success: true, user: response.data };
    } catch (error) {
        // Handle error here if needed
        console.error('Error updating FCM token:', error);
        return { success: false, error: error.message };
    }r
};

