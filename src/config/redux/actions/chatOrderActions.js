import api from "../../../utils/api";

// Action to create a new chat order
export const createChatOrder = (orderData) => async dispatch => {
    dispatch({
        type: 'CREATE_ORDER_REQUEST',
    });
    try {
        const response = await api.post('/create-chat-order', orderData);
        dispatch({
            type: 'CREATE_ORDER_SUCCESS',
            payload: response.data,
        });
    } catch (error) {
        dispatch({
            type: 'CREATE_ORDER_FAIL',
            payload: error.message,
        });
    }
};

// Action to get all chat orders of a particular customer
export const getChatOrdersByCustomer = (customerId) => async dispatch => {
    dispatch({
        type: 'GET_ORDERS_REQUEST',
    });
    try {
        const response = await api.get(`/customer/${customerId}/chat-orders`);
        console.log("response-->>>", response.data)
        dispatch({
            type: 'GET_ORDERS_SUCCESS',
            payload: response.data,
        });
    } catch (error) {
        console.log("err->", error)
        dispatch({
            type: 'GET_ORDERS_FAIL',
            payload: error.message,
        });
    }
};

export const getChatOrdersHistoryByCustomer = (customerId) => async dispatch => {
    dispatch({
        type: 'GET_ORDERS_REQUEST',
    });
    try {
        const response = await api.get(`/chat-orders-history/${customerId}`);
        console.log("chat order history response-->>>", response.data)
        dispatch({
            type: 'GET_ORDERS_SUCCESS',
            payload: response.data,
        });
    } catch (error) {
        console.log("err chat->", error)
        dispatch({
            type: 'GET_ORDERS_FAIL',
            payload: error.message,
        });
    }
};


// Action to updatechat order status
export const updateChatOrderStatus = (orderId, newStatus) => async (dispatch) => {
    dispatch({ type: 'UPDATE_ORDER_STATUS_REQUEST' });
    console.log("updateOrderStatus action->", orderId, newStatus)
    try {
        const response = await api.put(`/chat-order/status/${orderId}/vendor/`, { newStatus });
        dispatch({
            type: 'UPDATE_ORDER_STATUS_SUCCESS',
            payload: response.data // You might not necessarily need to update the entire order in Redux state
        });

      
    } catch (error) {
        dispatch({
            type: 'UPDATE_ORDER_STATUS_FAILURE',
            payload: error.message
        });
    }
};

