// src/actions/productActions.js

import api from '../../../utils/api';
import {
    GET_PRODUCT_REQUEST,
    GET_PRODUCT_SUCCESS,
    GET_PRODUCT_FAILURE,
    CLEAR_PRODUCT_DETAILS
} from './types';

// Action to get a product by ID
export const getProductById = (id) => async (dispatch) => {
    dispatch({ type: GET_PRODUCT_REQUEST });

    try {
        const response = await api.get(`/single-product/${id}`);
        // console.log("details-->>", response.data.product)
        dispatch({
            type: GET_PRODUCT_SUCCESS,
            payload: response.data.product
        });
    } catch (error) {
        dispatch({
            type: GET_PRODUCT_FAILURE,
            payload: error.message
        });
    }
};

export const clearProductDetails = () => ({
    type: CLEAR_PRODUCT_DETAILS,
  });
