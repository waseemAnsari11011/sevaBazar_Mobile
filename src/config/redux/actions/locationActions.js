// src/config/redux/actions/locationActions.js
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {
  GET_LOCATION_REQUEST,
  GET_LOCATION_SUCCESS,
  GET_LOCATION_FAILURE,
  LOCATION_PERMISSION_DENIED,
  LOGIN_SUCCESS,
} from './types';

import api from '../../../utils/api';
import { saveData } from './storageActions';

import { GOOGLE_API_KEY } from '@env';

export const detectLocation = () => async (dispatch) => {
  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]);
        return (
          granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.ACCESS_COARSE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
        );

      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const hasPermission = await requestPermission();
  if (!hasPermission) {
    dispatch({ type: LOCATION_PERMISSION_DENIED });
    throw new Error('Location permission denied');
  }

  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
          );
          const data = await response.json();
          let addressData = {
            addressLine1: '',
            addressLine2: 'Current Location',
            city: 'Detected',
            state: 'Detected',
            postalCode: '000000',
            country: 'India'
          };

          if (data.results && data.results.length > 0) {
            const addressComponents = data.results[0].address_components;
            addressData.addressLine2 = data.results[0].formatted_address;
            addressData.addressLine1 = '';

            addressComponents.forEach(component => {
              if (component.types.includes('locality')) addressData.city = component.long_name;
              if (component.types.includes('administrative_area_level_1')) addressData.state = component.long_name;
              if (component.types.includes('postal_code')) addressData.postalCode = component.long_name;
              if (component.types.includes('country')) addressData.country = component.long_name;
            });
          }
          resolve({ latitude, longitude, ...addressData });
        } catch (error) {
          console.error('Error in reverse geocoding:', error);
          resolve({
            latitude,
            longitude,
            addressLine1: '',
            addressLine2: 'Current Location',
            city: 'Detected',
            state: 'Detected',
            postalCode: '000000',
            country: 'India'
          });
        }
      },
      error => {
        dispatch({ type: GET_LOCATION_FAILURE, payload: error.message });
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0,
        showLocationDialog: true,
        forceRequestLocation: true
      },
    );
  });
};

export const saveLocationToBackend = (locationData) => async (dispatch, getState) => {
  try {
    const { local, auth } = getState();
    const user = local?.data?.user || auth?.user;

    if (user && user._id) {
      console.log(`Saving confirmed location. UserID: ${user._id}`);

      // Normalize string for comparison
      const normalize = (str) => str ? str.toLowerCase().replace(/[^a-z0-9]/g, '') : '';

      const newPostal = normalize(locationData.postalCode);
      const newAddr = normalize(locationData.addressLine2);

      // Check if address already exists with more flexible matching
      const existingAddress = user.shippingAddresses?.find(addr => {
        const existingPostal = normalize(addr.postalCode);
        const existingAddr = normalize(addr.addressLine2 || addr.address);

        const postalMatch = existingPostal === newPostal;
        const addrMatch = existingAddr.includes(newAddr) || newAddr.includes(existingAddr);

        return postalMatch && addrMatch;
      });

      let response;
      if (existingAddress) {
        console.log(`Address already exists, activating it: ${existingAddress._id}`);
        response = await api.put(`/customer/${user._id}/address/${existingAddress._id}/activate`);
      } else {
        response = await api.post(`/address/${user._id}/`, {
          ...locationData,
          isActive: true,
          name: user.name || 'User',
          phone: user.contactNumber || user.phone || '',
          landmark: ''
        });
      }

      if (response && response.data && response.data.user) {
        dispatch({ type: LOGIN_SUCCESS, payload: response.data.user });
        dispatch(saveData('user', response.data.user));
        return response.data.user;
      }
    } else {
      console.warn('saveLocationToBackend: No user ID found');
    }
  } catch (error) {
    console.error('Error saving confirmed location:', error);
    throw error;
  }
};

export const fetchUserLocation = () => async (dispatch, getState) => {
  // Existing automatic fetch logic (silently does everything)
  dispatch({ type: GET_LOCATION_REQUEST });
  try {
    const locationData = await dispatch(detectLocation());
    await dispatch(saveLocationToBackend(locationData));
    dispatch({ type: GET_LOCATION_SUCCESS, payload: locationData });
  } catch (error) {
    console.error('fetchUserLocation error:', error);
    dispatch({ type: GET_LOCATION_FAILURE, payload: error.message });
  }
};
