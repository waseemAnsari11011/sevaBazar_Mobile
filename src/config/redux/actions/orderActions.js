// actions.js
import api from '../../../utils/api';
import {
    FETCH_ORDERS_REQUEST,
    FETCH_ORDERS_SUCCESS,
    FETCH_ORDERS_FAILURE
} from './types';

// Action to fetch orders by customer ID
export const fetchOrdersByCustomerId = (customerId) => async (dispatch) => {
    dispatch({ type: FETCH_ORDERS_REQUEST });
console.log("customerId--->>>", customerId)
    try {
        const response = await api.get(`/orders/customer/${customerId}`);
        dispatch({
            type: FETCH_ORDERS_SUCCESS,
            payload: response.data
        });
    } catch (error) {
        dispatch({
            type: FETCH_ORDERS_FAILURE,
            payload: error.message
        });
    }
};
