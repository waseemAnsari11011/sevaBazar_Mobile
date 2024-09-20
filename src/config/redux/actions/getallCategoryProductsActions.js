// actions.js
import api from '../../../utils/api';
import {
    FETCH_ALL_CATEGORY_PRODUCTS_REQUEST,
    FETCH_ALL_CATEGORY_PRODUCTS_SUCCESS,
    FETCH_ALL_CATEGORY_PRODUCTS_FAILURE,
    RESET_ALL_CATEGORY_PRODUCTS
} from './types';


// Action creator for requesting category products
export const fetchAllCategoryProductsRequest = () => ({
    type: FETCH_ALL_CATEGORY_PRODUCTS_REQUEST,
});

// Action creator for successfully fetching category products
export const fetchAllCategoryProductsSuccess = (data) => ({
    type: FETCH_ALL_CATEGORY_PRODUCTS_SUCCESS,
    payload: data,
});

// Action creator for failed category products fetch
export const fetchAllCategoryProductsFailure = (error) => ({
    type: FETCH_ALL_CATEGORY_PRODUCTS_FAILURE,
    payload: error,
});

// Thunk action to fetch all category products
export const fetchAllCategoryProducts = () => {
    // console.log("fetchAllCategoryProducts api call")
    return async (dispatch) => {
        dispatch(fetchAllCategoryProductsRequest());
        try {
            const response = await api.get('/allCategoryProducts');
            // console.log("response-->", response.data)
            dispatch(fetchAllCategoryProductsSuccess(response.data));
        } catch (error) {
            console.log("error-->>", error)
            dispatch(fetchAllCategoryProductsFailure(error.message));
        }
    };
};


export const resetFetchAllCategoryProducts = () => ({
    type: RESET_ALL_CATEGORY_PRODUCTS,
});