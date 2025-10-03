// src/config/redux/actions/locationActions.js
import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {
  GET_LOCATION_REQUEST,
  GET_LOCATION_SUCCESS,
  GET_LOCATION_FAILURE,
  LOCATION_PERMISSION_DENIED,
} from './types';

export const fetchUserLocation = () => async (dispatch, getState) => {
  // Don't ask again if we already have the location or permission was denied
  const {location, permissionDenied} = getState().location;
  if (location || permissionDenied) {
    return;
  }

  dispatch({type: GET_LOCATION_REQUEST});

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'This app needs access to your location to show nearby vendors.',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    // For iOS, permission is requested when Geolocation.getCurrentPosition is called
    return true;
  };

  const hasPermission = await requestPermission();

  if (hasPermission) {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        dispatch({
          type: GET_LOCATION_SUCCESS,
          payload: {latitude, longitude},
        });
      },
      error => {
        dispatch({type: GET_LOCATION_FAILURE, payload: error.message});
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  } else {
    dispatch({type: LOCATION_PERMISSION_DENIED});
    console.log('Location permission denied');
  }
};
