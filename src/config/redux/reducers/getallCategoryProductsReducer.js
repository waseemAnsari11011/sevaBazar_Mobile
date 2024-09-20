// reducer.js
import {
    FETCH_ALL_CATEGORY_PRODUCTS_REQUEST,
    FETCH_ALL_CATEGORY_PRODUCTS_SUCCESS,
    FETCH_ALL_CATEGORY_PRODUCTS_FAILURE,
    RESET_ALL_CATEGORY_PRODUCTS
} from '../actions/types';

const initialState = {
    loading: false,
    data: [],
    error: '',
};

const allCategoryProductsReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ALL_CATEGORY_PRODUCTS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case FETCH_ALL_CATEGORY_PRODUCTS_SUCCESS:
            return {
                loading: false,
                data: action.payload,
                error: '',
            };
        case RESET_ALL_CATEGORY_PRODUCTS:
            return {
                ...initialState,
            };
        case FETCH_ALL_CATEGORY_PRODUCTS_FAILURE:
            return {
                loading: false,
                data: [],
                error: action.payload,
            };
        default:
            return state;
    }
};

export default allCategoryProductsReducer;
