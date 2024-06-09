import {
    FETCH_PRODUCTS_BY_CATEGORY_REQUEST,
    FETCH_PRODUCTS_BY_CATEGORY_SUCCESS,
    FETCH_PRODUCTS_BY_CATEGORY_FAILURE,
    UPDATE_PRODUCTS_BY_CATEGORY_PAGE,
    UPDATE_PRODUCTS_BY_CATEGORY_LIMIT,
    RESET_PRODUCTS_BY_CATEGORY,
    REACHED_END_PRODUCTS_BY_CATEGORY
} from '../actions/types';

const initialState = {
    loading: false,
    products: [],
    error: null,
    page: 1,
    limit: 10,
    reachedEnd: false
};

const productsByCategoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_PRODUCTS_BY_CATEGORY_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FETCH_PRODUCTS_BY_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                products: [...state.products, ...action.payload], // Append new products
                error: null,
            };
        case FETCH_PRODUCTS_BY_CATEGORY_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case UPDATE_PRODUCTS_BY_CATEGORY_PAGE:
            return {
                ...state,
                page: action.payload,
            };
        case UPDATE_PRODUCTS_BY_CATEGORY_LIMIT:
            return {
                ...state,
                limit: action.payload,
            };
        case RESET_PRODUCTS_BY_CATEGORY:
            return {
                ...initialState,
            };
        case REACHED_END_PRODUCTS_BY_CATEGORY:
            return {
                ...state,
                loading: false,
                reachedEnd: true,
            };
        default:
            return state;
    }
};

export default productsByCategoryReducer;
