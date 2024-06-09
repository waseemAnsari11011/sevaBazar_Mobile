// actions/productActions.js
import api from '../../../utils/api';
import {
    FETCH_DISCOUNTED_PRODUCTS_REQUEST,
    FETCH_DISCOUNTED_PRODUCTS_SUCCESS,
    FETCH_DISCOUNTED_PRODUCTS_FAILURE,
    UPDATE_DISCOUNTED_PRODUCTS_PAGE,
    UPDATE_DISCOUNTED_PRODUCTS_LIMIT,
    RESET_DISCOUNTED_PRODUCTS,
    REACHED_END_DISCOUNTED_PRODUCTS
} from './types';

export const fetchDiscountedProducts = (page, limit, userLocation) => async (dispatch) => {
    dispatch({ type: FETCH_DISCOUNTED_PRODUCTS_REQUEST });
    try {
        const response = await api.get(`/onDiscountProducts`, { // Assuming this is the correct endpoint for discounted products
            params: { page, limit, userLocation },
        });
        if (response.data.products.length === 0) {
            dispatch({ type: REACHED_END_DISCOUNTED_PRODUCTS });
        } else {
            dispatch({ type: FETCH_DISCOUNTED_PRODUCTS_SUCCESS, payload: response.data.products });
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to fetch discounted products';
        console.error('Error fetching discounted products:', errorMessage);
        dispatch({ type: FETCH_DISCOUNTED_PRODUCTS_FAILURE, payload: errorMessage });
    }
};

export const updateDiscountedProductsPage = (page) => ({
    type: UPDATE_DISCOUNTED_PRODUCTS_PAGE,
    payload: page,
});

export const updateDiscountedProductsLimit = (limit) => ({
    type: UPDATE_DISCOUNTED_PRODUCTS_LIMIT,
    payload: limit,
});

export const resetDiscountedProducts = () => ({
    type: RESET_DISCOUNTED_PRODUCTS,
});
