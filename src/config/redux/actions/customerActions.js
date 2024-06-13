import api from '../../../utils/api';
import { UPDATE_CUSTOMER_REQUEST, UPDATE_CUSTOMER_SUCCESS, UPDATE_CUSTOMER_FAILURE } from './types';

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

        console.log("response.data-->>", response.data)

        dispatch({ type: UPDATE_CUSTOMER_SUCCESS, payload: response.data });
        return { success: true, user: response.data };

    } catch (error) {
        dispatch({ type: UPDATE_CUSTOMER_FAILURE, payload: error.message });
    }
};
