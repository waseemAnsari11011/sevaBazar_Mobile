// actions.js

import api from '../../../utils/api';
import { GET_BANNERS_REQUEST, GET_BANNERS_SUCCESS, GET_BANNERS_FAILURE } from './types';

function extractImages(banners) {
    const images = [];
    banners.forEach(banner => {
        banner.images.forEach(image => {
            images.push({ image });
        });
    });
    return images;
}


// Action creator for fetching banners
export const getBanners = () => {
    return async (dispatch) => {
        dispatch({ type: GET_BANNERS_REQUEST });
        try {
            const response = await api.get('/all-active-banner');
            dispatch({ type: GET_BANNERS_SUCCESS, payload: extractImages(response.data.banners)  });
        } catch (error) {
            dispatch({ type: GET_BANNERS_FAILURE, payload: error.message });
        }
    };
};
