// actions/productActions.js
import api from '../../../utils/api';
import {
    FETCH_ALL_PRODUCTS_REQUEST,
    FETCH_ALL_PRODUCTS_SUCCESS,
    FETCH_ALL_PRODUCTS_FAILURE,
    UPDATE_ALL_PRODUCTS_PAGE,
    UPDATE_ALL_PRODUCTS_LIMIT,
    RESET_ALL_PRODUCTS,
    REACHED_END_ALL_PRODUCTS
} from './types';

export const fetchAllProducts = ( page, limit, userLocation) => async (dispatch) => {
    dispatch({ type: FETCH_ALL_PRODUCTS_REQUEST });
    try {
        // console.log("productId, page, limit", productId, page, limit)
        const response = await api.get(`/get-all-products`, {
            params: { page, limit, userLocation },
        });
        if (response.data.products.length === 0) {
            dispatch({ type: REACHED_END_ALL_PRODUCTS });

        } else {
            dispatch({ type: FETCH_ALL_PRODUCTS_SUCCESS, payload: response.data.products });

        }

    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to fetch All products';
        console.error('Error fetching All products:', error);
        dispatch({ type: FETCH_ALL_PRODUCTS_FAILURE, payload: errorMessage });
    }
};

export const updateAllProductsPage = (page) => ({
    type: UPDATE_ALL_PRODUCTS_PAGE,
    payload: page,
});

export const updateAllProductsLimit = (limit) => ({
    type: UPDATE_ALL_PRODUCTS_LIMIT,
    payload: limit,
});

export const resetAllProducts = () => ({
    type: RESET_ALL_PRODUCTS,
});
