// searchReducer.js
import {
    SEARCH_PRODUCTS_REQUEST,
    SEARCH_PRODUCTS_SUCCESS,
    SEARCH_PRODUCTS_FAILURE,
    UPDATE_SEARCH_QUERY,
    RESET_SEARCH_RESULTS,
    UPDATE_SEARCH_PRODUCTS_PAGE,

    UPDATE_SEARCH_PRODUCTS_LIMIT,
    SEARCH_VENDORS_REQUEST,
    SEARCH_VENDORS_SUCCESS,
    SEARCH_VENDORS_FAILURE
} from '../actions/types';

const initialState = {
    loading: false,
    products: [],
    vendors: [],
    error: null,
    query: '',
    page: 1,
    limit: 10,
};

const searchReducer = (state = initialState, action) => {
    switch (action.type) {
        case SEARCH_PRODUCTS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case SEARCH_PRODUCTS_SUCCESS:
            return {
                ...state,
                loading: false,
                products: action.payload,
                error: null,
            };
        case SEARCH_PRODUCTS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case SEARCH_VENDORS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case SEARCH_VENDORS_SUCCESS:
            return {
                ...state,
                loading: false,
                vendors: action.payload,
                error: null,
            };
        case SEARCH_VENDORS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case UPDATE_SEARCH_PRODUCTS_PAGE:
            return {
                ...state,
                page: action.payload,
            };
        case UPDATE_SEARCH_PRODUCTS_LIMIT:
            return {
                ...state,
                limit: action.payload,
            };
        case UPDATE_SEARCH_QUERY:
            return {
                ...state,
                query: action.payload,
            };
        case RESET_SEARCH_RESULTS:
            return initialState;
        default:
            return state;
    }
};

export default searchReducer;
