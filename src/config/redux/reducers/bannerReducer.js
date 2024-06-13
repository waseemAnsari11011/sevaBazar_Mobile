// reducer.js

import { GET_BANNERS_REQUEST, GET_BANNERS_SUCCESS, GET_BANNERS_FAILURE } from '../actions/types';

const initialState = {
    loading: false,
    banners: [],
    error: ''
};

const bannerReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_BANNERS_REQUEST:
            return {
                ...state,
                loading: true
            };
        case GET_BANNERS_SUCCESS:
            return {
                ...state,
                loading: false,
                banners: action.payload,
                error: ''
            };
        case GET_BANNERS_FAILURE:
            return {
                ...state,
                loading: false,
                banners: [],
                error: action.payload
            };
        default:
            return state;
    }
};

export default bannerReducer;
