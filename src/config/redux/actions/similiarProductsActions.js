// actions/productActions.js
import api from '../../../utils/api';
import {
    FETCH_SIMILAR_PRODUCTS_REQUEST,
    FETCH_SIMILAR_PRODUCTS_SUCCESS,
    FETCH_SIMILAR_PRODUCTS_FAILURE,
    UPDATE_SIMILAR_PRODUCTS_PAGE,
    UPDATE_SIMILAR_PRODUCTS_LIMIT,
    RESET_SIMILAR_PRODUCTS,
    REACHED_END_SIMILAR_PRODUCTS
} from './types';

export const fetchSimilarProducts = (productId, page, limit, userLocation) => async (dispatch) => {
    dispatch({ type: FETCH_SIMILAR_PRODUCTS_REQUEST });
    try {
        console.log("productId, page, limit", productId, page, limit)
        const response = await api.get(`/products/${productId}/similar`, {
            params: { page, limit, userLocation },
        });
        if (response.data.products.length === 0) {
            dispatch({ type: REACHED_END_SIMILAR_PRODUCTS });

        } else {
            dispatch({ type: FETCH_SIMILAR_PRODUCTS_SUCCESS, payload: response.data.products });

        }

    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to fetch similar products';
        console.error('Error fetching similar products:', errorMessage);
        dispatch({ type: FETCH_SIMILAR_PRODUCTS_FAILURE, payload: errorMessage });
    }
};

export const updateSimilarProductsPage = (page) => ({
    type: UPDATE_SIMILAR_PRODUCTS_PAGE,
    payload: page,
});

export const updateSimilarProductsLimit = (limit) => ({
    type: UPDATE_SIMILAR_PRODUCTS_LIMIT,
    payload: limit,
});

export const resetSimilarProducts = () => ({
    type: RESET_SIMILAR_PRODUCTS,
});
