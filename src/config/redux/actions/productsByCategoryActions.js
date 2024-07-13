import api from '../../../utils/api';
import {
    FETCH_PRODUCTS_BY_CATEGORY_REQUEST,
    FETCH_PRODUCTS_BY_CATEGORY_SUCCESS,
    FETCH_PRODUCTS_BY_CATEGORY_FAILURE,
    UPDATE_PRODUCTS_BY_CATEGORY_PAGE,
    UPDATE_PRODUCTS_BY_CATEGORY_LIMIT,
    RESET_PRODUCTS_BY_CATEGORY,
    REACHED_END_PRODUCTS_BY_CATEGORY
} from './types';

export const fetchProductsByCategory = (categoryId, page, limit, userLocation) => async (dispatch) => {
    dispatch({ type: FETCH_PRODUCTS_BY_CATEGORY_REQUEST });
    try {
        console.log("categoryId, page, limit", categoryId, page, limit);
        const response = await api.get(`/categories/${categoryId}/products`, {
            params: { page, limit, userLocation },
        });
        console.log("response.data.products.length", response.data.products.length)
        if (response.data.products.length === 0) {
            dispatch({ type: REACHED_END_PRODUCTS_BY_CATEGORY });
        } else {
            dispatch({ type: FETCH_PRODUCTS_BY_CATEGORY_SUCCESS, payload: response.data.products });
        }
    } catch (error) {
        console.error(error)
        const errorMessage = error.response?.data?.message || 'Failed to fetch products by category';
        dispatch({ type: FETCH_PRODUCTS_BY_CATEGORY_FAILURE, payload: errorMessage });
    }
};

export const updateProductsByCategoryPage = (page) => ({
    type: UPDATE_PRODUCTS_BY_CATEGORY_PAGE,
    payload: page,
});

export const updateProductsByCategoryLimit = (limit) => ({
    type: UPDATE_PRODUCTS_BY_CATEGORY_LIMIT,
    payload: limit,
});

export const resetProductsByCategory = () => ({
    type: RESET_PRODUCTS_BY_CATEGORY,
});
