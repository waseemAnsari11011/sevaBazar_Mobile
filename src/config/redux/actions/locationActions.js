// src/config/redux/actions/locationActions.js
import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {
  GET_LOCATION_REQUEST,
  GET_LOCATION_SUCCESS,
  GET_LOCATION_FAILURE,
  LOCATION_PERMISSION_DENIED,
  LOGIN_SUCCESS,
} from './types';

import api from '../../../utils/api';
import {saveData} from './storageActions';

import {GOOGLE_API_KEY} from '@env';

export const fetchUserLocation = () => async (dispatch, getState) => {
  // Don't ask again if we already have the location or permission was denied
  // COMMENTING OUT this check because "Use Current Location" button forces a refresh
  /*
  const {location, permissionDenied} = getState().location;
  if (location || permissionDenied) {
    return;
  }
  */

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
      async position => {
        const {latitude, longitude} = position.coords;
        dispatch({
          type: GET_LOCATION_SUCCESS,
          payload: {latitude, longitude},
        });

        // Fetch address from Google Maps Reverse Geocoding API
        // const GOOGLE_API_KEY is now imported from @env

        const fetchAddress = async () => {
          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
            );
            const data = await response.json();
            if (data.results && data.results.length > 0) {
              const addressComponents = data.results[0].address_components;
              const formattedAddress = data.results[0].formatted_address;
              
              let city = 'Detected';
              let state = 'Detected';
              let postalCode = '000000';
              let country = 'India';

              addressComponents.forEach(component => {
                if (component.types.includes('locality')) {
                  city = component.long_name;
                }
                if (component.types.includes('administrative_area_level_1')) {
                  state = component.long_name;
                }
                if (component.types.includes('postal_code')) {
                  postalCode = component.long_name;
                }
                if (component.types.includes('country')) {
                   country = component.long_name;
                }
              });

              return {
                 addressLine1: formattedAddress,
                 city,
                 state,
                 postalCode,
                 country
              };
            }
          } catch (error) {
            console.error('Error fetching address from Google Maps:', error);
          }
           return {
                 addressLine1: 'Current Location',
                 city: 'Detected',
                 state: 'Detected',
                 postalCode: '000000',
                 country: 'India'
           };
        };


        // Save location to backend
        try {
          const {local} = getState();
          const user = local?.data?.user;
          
          // Get the real address
          const addressData = await fetchAddress();

          if (user) {
            // Since we are forcing single address policy, we can just always call the post/put based on intent.
            // But the backend now replaces everything on POST (saveAddressAndLocalities).
            // So we can just call that one endpoint.
            
            // However, the existing code logic tries to update if active address exists.
            // Let's stick to the plan: update if exists, create if not. 
            // BUT wait, my backend change makes 'saveAddressAndLocalities' (which is mapped to POST /address/:id) replace everything.
            // So relying on POST /address/:id is actually the safest way to "reset" to a single current location.
            // Converting PUT to POST might be cleaner given the new backend logic, 
            // but let's see if PUT is still relevant.
            // PUT /address/:id/:addressId updates a specific address. If we want to maintain the "single address" invariant,
            // we should probably just use the POST endpoint which I modified to replace the array.
            
            // Let's simplify: simply call POST /address/:userID to set the ONE location.
            
             console.log(`Setting current location. UserID: ${user._id}`);
             const response = await api.post(`/address/${user._id}`, {
                ...addressData,
                latitude,
                longitude,
                isActive: true,
                name: user.name || 'User',
                phone: user.contactNumber,
                addressDescription: 'Current Location',
                landmark: ''
             });

            if (response && response.data && response.data.user) {
              console.log('Location saved, updating user state...');
              dispatch({
                type: LOGIN_SUCCESS,
                payload: response.data.user,
              });
              
              // Also update the local storage state which HomeScreen uses
              dispatch(saveData('user', response.data.user));
            }
          }
        } catch (error) {
          console.error('Error saving user location to backend:', error);
          if (error.response) {
             console.error('Backend Error Data:', error.response.data);
             console.error('Backend Error Status:', error.response.status);
          }
        }
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
