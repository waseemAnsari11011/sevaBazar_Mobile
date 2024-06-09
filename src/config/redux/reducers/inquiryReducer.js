// reducer.js
import {
    CREATE_INQUIRY_REQUEST,
    CREATE_INQUIRY_SUCCESS,
    CREATE_INQUIRY_FAILURE,
    FETCH_INQUIRIES_REQUEST,
    FETCH_INQUIRIES_SUCCESS,
    FETCH_INQUIRIES_FAILURE,
} from '../actions/types';

const initialState = {
    inquiries: [],
    loading: false,
    error: null,
};

const inquiryReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_INQUIRY_REQUEST:
        case FETCH_INQUIRIES_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case CREATE_INQUIRY_SUCCESS:
            return {
                ...state,
                loading: false,
                inquiries: [...state.inquiries, action.payload],
            };
        case FETCH_INQUIRIES_SUCCESS:
            return {
                ...state,
                loading: false,
                inquiries: action.payload,
            };
        case CREATE_INQUIRY_FAILURE:
        case FETCH_INQUIRIES_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default inquiryReducer
