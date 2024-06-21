// reducer.js
import {
    FETCH_ORDERS_REQUEST,
    FETCH_ORDERS_SUCCESS,
    FETCH_ORDERS_FAILURE,
    UPDATE_ORDER_STATUS_REQUEST,
    UPDATE_ORDER_STATUS_SUCCESS,
    UPDATE_ORDER_STATUS_FAILURE
} from '../actions/types';

const initialState = {
    loading: false,
    orders: [],
    error: ''
};

// Reducer to handle order fetching
const ordersReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ORDERS_REQUEST:
        case UPDATE_ORDER_STATUS_REQUEST:
            return {
                ...state,
                loading: true
            };
        case FETCH_ORDERS_SUCCESS:
            return {
                ...state,
                loading: false,
                orders: action.payload,
                error:null
            };
        case UPDATE_ORDER_STATUS_SUCCESS:
            // Optionally handle update success if needed
            return {
                ...state,
                loading: false,
                // You might update the orders array here if needed, depending on your app's logic
            };
        case FETCH_ORDERS_FAILURE:
        case UPDATE_ORDER_STATUS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
};

export default ordersReducer;
