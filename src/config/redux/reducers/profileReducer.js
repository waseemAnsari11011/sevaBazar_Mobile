import {
  ADD_ADDRESS_REQUEST,
  ADD_ADDRESS_SUCCESS,
  ADD_ADDRESS_FAILURE,
} from '../actions/types';

const initialState = {
  address_response: null,
  loading: false,
  error: null,
};

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ADDRESS_REQUEST:
      return {...state, loading: true, address_response: null, error: null};
    case ADD_ADDRESS_SUCCESS:
      return {
        ...state,
        loading: false,
        address_response: action.payload,
        error: null,
      };
    case ADD_ADDRESS_FAILURE:
      return {
        ...state,
        address_response: null,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default profileReducer;
