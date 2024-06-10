import api from '../../../utils/api';
import { FETCH_CONTACT_FAILURE,FETCH_CONTACT_SUCCESS, FETCH_CONTACT_REQUEST} from './types';


// Action Creators
export const fetchContactRequest = () => ({
  type: FETCH_CONTACT_REQUEST
});

export const fetchContactSuccess = (contact) => ({
  type: FETCH_CONTACT_SUCCESS,
  payload: contact
});

export const fetchContactFailure = (error) => ({
  type: FETCH_CONTACT_FAILURE,
  payload: error
});

// Async Action to Fetch Contact
export const fetchContact = () => {
  return async (dispatch) => {
    dispatch(fetchContactRequest());
    try {
      const response = await api.get('/get-contact'); // Assuming your API endpoint is at /api/get-contact
      dispatch(fetchContactSuccess(response.data));
    } catch (error) {
      dispatch(fetchContactFailure(error.message));
    }
  };
};
