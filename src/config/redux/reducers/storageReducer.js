import { GET_PROFILE_SUCCESS, GET_PROFILE_FAILURE } from '../actions/types';

const initialState = {
  data: {},
  loading: false,
  error: null,
};

const storageReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SAVE_DATA_SUCCESS':
      const { key, value } = action.payload;
      return { ...state, data: { ...state.data, [key]: value }, loading: false };
    case 'SAVE_DATA_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'LOAD_DATA_SUCCESS':
      const { key: loadKey, value: loadValue } = action.payload;
      if (state.data.hasOwnProperty(loadKey)) {
        return { ...state, loading: false }; // key already exists in state
      }
      return {
        ...state,
        data: { ...state.data, [loadKey]: loadValue },
        loading: false,
      };

    case 'LOAD_DATA_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'DELETE_DATA_SUCCESS':
      const { key: deleteKey } = action.payload;
      const { [deleteKey]: deletedValue, ...remainingData } = state.data;
      return { ...state, data: remainingData, loading: false };
    case 'DELETE_DATA_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'CLEAR_ALL_DATA':
      return {
        ...state,
        data: {},
      };
    case 'CLEAR_ALL_DATA_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};



export default storageReducer;
