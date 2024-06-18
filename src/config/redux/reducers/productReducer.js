// src/reducers/productReducer.js

import {
    GET_PRODUCT_REQUEST,
    GET_PRODUCT_SUCCESS,
    GET_PRODUCT_FAILURE,
    CLEAR_PRODUCT_DETAILS
} from '../actions/types';

const initialState = {
    product: null,
    loading: false,
    error: null
};

const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PRODUCT_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case GET_PRODUCT_SUCCESS:
            return {
                ...state,
                loading: false,
                product: action.payload
            };
        case CLEAR_PRODUCT_DETAILS:
            return {
                ...state,
                product: null,
                loading: true,
                error: null,
            };
        case GET_PRODUCT_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
};

export default productReducer;
