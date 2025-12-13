// searchActions.js
import api from '../../../utils/api';
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
} from './types';

export const searchProducts = (query, page=1 , limit=10, userLocation) => async (dispatch) => {
    dispatch({ type: SEARCH_PRODUCTS_REQUEST });
    try {
        console.log("search action", query, page, limit, userLocation)
        const response = await api.get('/searchProducts', {
            params: { searchQuery: query, page, limit , userLocation},
        });
        console.log("response.data.total====>>>", response.data.total)
        dispatch({ type: SEARCH_PRODUCTS_SUCCESS, payload: response.data.products });
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to search products';
        console.error('Error searching products:', errorMessage);
        dispatch({ type: SEARCH_PRODUCTS_FAILURE, payload: errorMessage });
    }
};

export const searchVendors = (query) => async (dispatch) => {
    dispatch({ type: SEARCH_VENDORS_REQUEST });
    try {
        const response = await api.get('/vendors/customer/search', {
            params: { q: query },
        });
        dispatch({ type: SEARCH_VENDORS_SUCCESS, payload: response.data });
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to search vendors';
        console.error('Error searching vendors:', errorMessage);
        dispatch({ type: SEARCH_VENDORS_FAILURE, payload: errorMessage });
    }
};

export const updateSearchQuery = (query) => ({
    type: UPDATE_SEARCH_QUERY,
    payload: query,
});

export const resetSearchResults = () => ({
    type: RESET_SEARCH_RESULTS,
});

export const updateSimilarProductsPage = (page) => ({
    type: UPDATE_SEARCH_PRODUCTS_PAGE,
    payload: page,
});

export const updateSimilarProductsLimit = (limit) => ({
    type: UPDATE_SEARCH_PRODUCTS_LIMIT,
    payload: limit,
});
