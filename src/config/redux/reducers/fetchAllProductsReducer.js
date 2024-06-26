// reducers/allProductsReducer.js
import {
    FETCH_ALL_PRODUCTS_REQUEST,
    FETCH_ALL_PRODUCTS_SUCCESS,
    FETCH_ALL_PRODUCTS_FAILURE,
    UPDATE_ALL_PRODUCTS_PAGE,
    UPDATE_ALL_PRODUCTS_LIMIT,
    RESET_ALL_PRODUCTS,
    REACHED_END_ALL_PRODUCTS
} from '../actions/types';

const initialState = {
    loading: false,
    products: [],
    error: null,
    page: 1,
    limit: 10,
    reachedEnd: false
};

const allProductsReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ALL_PRODUCTS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FETCH_ALL_PRODUCTS_SUCCESS:
            return {
                ...state,
                loading: false,
                products: [...state.products, ...action.payload], // Append new products
                error: null,
            };
        case FETCH_ALL_PRODUCTS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case UPDATE_ALL_PRODUCTS_PAGE:
            return {
                ...state,
                page: action.payload,
            };
        case UPDATE_ALL_PRODUCTS_LIMIT:
            return {
                ...state,
                limit: action.payload,
            };
        case RESET_ALL_PRODUCTS:
            return {
                ...initialState,
            };
        case REACHED_END_ALL_PRODUCTS:
            return {
                ...state,
                loading: false,
                reachedEnd: true,
            };
        default:
            return state;
    }
};


export default allProductsReducer;
