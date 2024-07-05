

const initialState = {
    loading: false,
    order: null,
    orders: [],
    error: null,
};

const orderReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CREATE_ORDER_REQUEST':
        case 'GET_ORDERS_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'CREATE_ORDER_SUCCESS':
            return {
                ...state,
                loading: false,
                order: action.payload,
            };
        case 'GET_ORDERS_SUCCESS':
            return {
                ...state,
                loading: false,
                orders: action.payload,
            };
        case 'CREATE_ORDER_FAIL':
        case 'GET_ORDERS_FAIL':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default orderReducer;
