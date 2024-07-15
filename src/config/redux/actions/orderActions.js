// actions.js
import api from '../../../utils/api';
import {
    FETCH_ORDERS_REQUEST,
    FETCH_ORDERS_SUCCESS,
    FETCH_ORDERS_FAILURE,
    UPDATE_ORDER_STATUS_REQUEST,
    UPDATE_ORDER_STATUS_SUCCESS,
    UPDATE_ORDER_STATUS_FAILURE
} from './types';

// Action to fetch orders by customer ID
export const fetchOrdersByCustomerId = (customerId) => async (dispatch) => {
    dispatch({ type: FETCH_ORDERS_REQUEST });
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

export const fetchOrdersHistoryByCustomerId = (customerId) => async (dispatch) => {
    dispatch({ type: FETCH_ORDERS_REQUEST });
    try {
        const response = await api.get(`/order-history/${customerId}`);
        dispatch({
            type: FETCH_ORDERS_SUCCESS,
            payload: response.data
        });
    } catch (error) {
        console.log("error fetchOrdersHistoryByCustomerId", error)
        dispatch({
            type: FETCH_ORDERS_FAILURE,
            payload: error.message
        });
    }
};


// Action to update order status
export const updateOrderStatus = (orderId, vendorId, newStatus) => async (dispatch) => {
    dispatch({ type: UPDATE_ORDER_STATUS_REQUEST });
console.log("updateOrderStatus action->", orderId, vendorId, newStatus)
    try {
        const response = await api.put(`/order/status/${orderId}/vendor/${vendorId}`, newStatus );
        dispatch({
            type: UPDATE_ORDER_STATUS_SUCCESS,
            payload: response.data // You might not necessarily need to update the entire order in Redux state
        });

        // After updating, refetch orders to get the updated data
        dispatch(fetchOrdersByCustomerId(customerId)); // Assuming you have customerId accessible here
    } catch (error) {
        dispatch({
            type: UPDATE_ORDER_STATUS_FAILURE,
            payload: error.message
        });
    }
};