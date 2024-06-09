// actions/productActions.js
import api from '../../../utils/api';
import {
    FETCH_RECENTLY_ADDED_PRODUCTS_REQUEST,
    FETCH_RECENTLY_ADDED_PRODUCTS_SUCCESS,
    FETCH_RECENTLY_ADDED_PRODUCTS_FAILURE,
    UPDATE_RECENTLY_ADDED_PRODUCTS_PAGE,
    UPDATE_RECENTLY_ADDED_PRODUCTS_LIMIT,
    RESET_RECENTLY_ADDED_PRODUCTS,
    REACHED_END_RECENTLY_ADDED_PRODUCTS
} from './types';

export const fetchRecentlyAddedProducts = (page, limit, userLocation) => async (dispatch) => {
    dispatch({ type: FETCH_RECENTLY_ADDED_PRODUCTS_REQUEST });
    try {
        console.log("page, limit", page, limit)
        const response = await api.get(`/recentlyAddedProducts`, {
            params: { page, limit , userLocation},
        });
        if (response.data.products.length === 0) {
            dispatch({ type: REACHED_END_RECENTLY_ADDED_PRODUCTS });

        } else {
            dispatch({ type: FETCH_RECENTLY_ADDED_PRODUCTS_SUCCESS, payload: response.data.products });

        }

    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to fetch recently added products';
        console.error('Error fetching recently added products:', errorMessage);
        dispatch({ type: FETCH_RECENTLY_ADDED_PRODUCTS_FAILURE, payload: errorMessage });
    }
};

export const updateRecentlyAddedProductsPage = (page) => ({
    type: UPDATE_RECENTLY_ADDED_PRODUCTS_PAGE,
    payload: page,
});

export const updateRecentlyAddedProductsLimit = (limit) => ({
    type: UPDATE_RECENTLY_ADDED_PRODUCTS_LIMIT,
    payload: limit,
});

export const resetRecentlyAddedProducts = () => ({
    type: RESET_RECENTLY_ADDED_PRODUCTS,
});
