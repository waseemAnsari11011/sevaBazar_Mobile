import {

    FETCH_CATEGORY_FAILURE,
    FETCH_CATEGORY_REQUEST,
    FETCH_CATEGORY_SUCCESS,

} from '../actions/types';

const initialState = {
    loading: false,
    error: null,
    category: [],
};

const categoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_CATEGORY_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case FETCH_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                category: action.payload,
                error: null,
            };
        case FETCH_CATEGORY_FAILURE:
            return {
                ...state,
                loading: false,
                category: [],
                error: action.payload,
            };

        default:
            return state;
    }
};

export default categoryReducer;
