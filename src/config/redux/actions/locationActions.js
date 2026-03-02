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
            houseNo: '',
            plusCode: '',
            locality: '',
            sublocality: '',
            addressLine2: 'Current Location',
            city: '',
            state: '',
            postalCode: '',
            country: 'India'
          };


          if (data.results && data.results.length > 0) {
            console.log('DEBUG: Full Geocoding Results count:', data.results.length);

            // Loop through results to find the best components
            let locality = '';
            let district = '';
            let subDistrict = '';

            // Use the first result for the full address and landmarks
            addressData.addressLine2 = data.results[0].formatted_address;
            addressData.houseNo = '';

            let landmark = '';

            // ROBUST LANDMARK DETECTION: Scan all results for POIs or Establishments
            const landmarkTypesList = [
              'point_of_interest', 'establishment', 'premise', 'place_of_worship',
              'park', 'natural_feature', 'shopping_mall', 'school', 'hospital', 'landmark'
            ];

            // Try to find the most specific landmark from the first few results
            for (let i = 0; i < Math.min(data.results.length, 5); i++) {
              const res = data.results[i];
              if (res.types.some(t => landmarkTypesList.includes(t))) {
                const poiName = res.address_components[0]?.long_name;
                // Avoid using Plus Codes as landmark names (Plus Codes contain '+')
                if (poiName && poiName.length > 2 && !poiName.includes('+')) {
                  landmark = `Near ${poiName}`;
                  break;
                }
              }
            }

            // Look through all results to gather the most complete information
            data.results.forEach((result, index) => {
              result.address_components.forEach(component => {
                if (component.types.includes('locality') && !locality) {
                  locality = component.long_name;
                }
                if (component.types.includes('administrative_area_level_2') && !district) {
                  district = component.long_name;
                }
                if (component.types.includes('administrative_area_level_3') && !subDistrict) {
                  subDistrict = component.long_name;
                }
                if (component.types.includes('administrative_area_level_1') && !addressData.state) {
                  addressData.state = component.long_name;
                }
                if (component.types.includes('postal_code') && !addressData.postalCode) {
                  addressData.postalCode = component.long_name;
                }
                if (component.types.includes('country') && !addressData.country) {
                  addressData.country = component.long_name;
                }

              });
            });

            console.log(`DEBUG: Extracted - District: ${district}, SubDistrict: ${subDistrict}, Locality: ${locality}, Landmark: ${landmark}`);

            // Extract granular components
            addressData.landmark = landmark;
            addressData.plusCode = data.plus_code?.global_code || '';
            addressData.locality = locality || '';
            addressData.sublocality = data.results[0].address_components.find(c => c.types.includes('sublocality_level_1'))?.long_name || '';

            // Muzaffarpur is likely administrative_area_level_3 (District)
            // Tirhut Division is likely administrative_area_level_2 (Division)
            // Prioritize SubDistrict over District
            addressData.city = subDistrict || district || locality || 'Detected';

            // Deduplicate landmark if it's already in sublocality/locality
            let finalLandmark = landmark;
            if (finalLandmark) {
              const landmarkTrimmed = finalLandmark.replace('Near ', '').toLowerCase().trim();
              const sublocLower = (addressData.sublocality || '').toLowerCase().trim();
              const locLower = (addressData.locality || '').toLowerCase().trim();
              if (sublocLower.includes(landmarkTrimmed) || locLower.includes(landmarkTrimmed)) {
                console.log('DEBUG: Landmark redundant with locality/sublocality, ignoring.');
                finalLandmark = '';
              }
            }
            addressData.landmark = finalLandmark;

            // Construct custom fullAddress strictly as: houseNo, sublocality, locality, landmark, city, state, country, postalCode
            const finalComponents = [
              addressData.houseNo,
              addressData.sublocality,
              addressData.locality,
              addressData.landmark,
              addressData.city,
              addressData.state,
              addressData.country,
              addressData.postalCode
            ].filter(part => part && String(part).trim() !== '');

            addressData.fullAddress = finalComponents.join(', ');
            console.log('DEBUG: Constructed fullAddress (with robust landmark):', addressData.fullAddress);

            // SUPER ROBUST FALLBACK FOR INDIA: Extract city from formatted_address relative to state
            if (data.results[0].formatted_address && addressData.state) {
              const addrParts = data.results[0].formatted_address.split(',').map(p => p.trim());
              const stateIndex = addrParts.findIndex(p => p.toLowerCase().includes(addressData.state.toLowerCase()));
              if (stateIndex > 0) {
                const inferredCity = addrParts[stateIndex - 1];
                if (inferredCity && inferredCity.length > 2) {
                  console.log(`DEBUG: State-relative city extraction found: ${inferredCity}`);
                  addressData.city = inferredCity;
                }
              }
            }
            console.log(`DEBUG: Final Selected City: ${addressData.city}`);
          }
          resolve({ latitude, longitude, ...addressData });
        } catch (error) {
          console.error('Error in reverse geocoding:', error);
          resolve({
            latitude,
            longitude,
            houseNo: '',
            fullAddress: 'Current Location',
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
    console.log('DEBUG: User state in saveLocationToBackend:', JSON.stringify(user));

    if (user && (user._id || user.id)) {
      const userId = user._id || user.id;
      console.log(`DEBUG: Saving confirmed location. UserID: ${userId}`);

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
        try {
          console.log(`DEBUG: Address already exists, activating it: ${existingAddress._id}`);
          response = await api.put(`/customer/${userId}/address/${existingAddress._id}/activate`);
        } catch (actError) {
          if (actError.response?.status === 404) {
            console.log('DEBUG: Activation failed (404), falling back to saving as new.');
            response = await api.post(`/address/${userId}`, {
              ...locationData,
              houseNo: locationData.houseNo || '',
              addressLine2: locationData.addressLine2,
              isActive: true,
              name: user.name || 'User',
              phone: user.contactNumber || user.phone || '',
              landmark: locationData.landmark || ''
            });
          } else {
            throw actError;
          }
        }
      } else {
        console.log('DEBUG: Saving new location to backend:', locationData.addressLine2);
        response = await api.post(`/address/${userId}`, {
          ...locationData,
          houseNo: locationData.houseNo || '',
          addressLine2: locationData.addressLine2,
          isActive: true,
          name: user.name || 'User',
          phone: user.contactNumber || user.phone || '',
          landmark: locationData.landmark || ''
        });
      }

      console.log('DEBUG: Save response:', JSON.stringify(response.data));

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
