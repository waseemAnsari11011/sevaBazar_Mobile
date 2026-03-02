import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import ManualLocationSearch from './ManualLocationSearch';
import ButtonComponent from '../../../components/Button';
import api from '../../../utils/api';
import { loadData, saveData } from '../../../config/redux/actions/storageActions';
import { clearCart } from '../../../config/redux/actions/cartActions';
import { GOOGLE_API_KEY } from '@env';

const GOOGLE_PLACES_API_KEY = GOOGLE_API_KEY;

const LocationSearch = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { data } = useSelector(state => state.local);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchLocation, setSearchLocation] = useState(false);
  const [manualLocation, setManualLocation] = useState({
    name: '',
    phone: '',
    description: '',
    flatNo: '',
    area: '',
    landmark: '',
    pincode: '',
    state: '',
    country: 'India',
    city: '',
    plusCode: '',
    locality: '',
    sublocality: '',
    isActive: false,
  });
  const googlePlacesRef = useRef(null);

  useEffect(() => {
    const loadLocalData = async () => {
      await dispatch(loadData('user'));
    };
    loadLocalData();

    if (route.params?.isEdit) {
      const { address } = route.params;

      setManualLocation({
        name: address.name,
        phone: address.phone,
        description: address.address,
        flatNo: address.houseNo || '',
        area: address.fullAddress || '',
        landmark: address.landmark,
        pincode: address.postalCode,
        state: address.state,
        country: address.country,
        city: address.city,
        latitude: address.latitude,
        longitude: address.longitude,
        plusCode: address.plusCode || '',
        locality: address.locality || '',
        sublocality: address.sublocality || '',
        isActive: address.isActive,
      });
      setSelectedLocation(address); // if using searchLocation as well
    }
  }, [route.params]);

  const handleLocation = async () => {
    try {
      const location = searchLocation ? selectedLocation : manualLocation;
      if (!location) {
        return;
      }

      const {
        description,
        flatNo,
        area,
        landmark,
        city,
        state,
        country,
        pincode,
        name,
        phone,
        latitude,
        longitude,
        plusCode,
        locality,
        sublocality,
        isActive,
      } = location;

      if (
        !name ||
        !phone ||
        !area ||
        !city ||
        !state ||
        !country ||
        !pincode
      ) {
        let missingFields = [];
        if (!name) missingFields.push('Full Name');
        if (!phone) missingFields.push('Mobile Number');
        if (!area) missingFields.push('Area/Street');
        if (!city) missingFields.push('City');
        if (!state) missingFields.push('State');
        if (!country) missingFields.push('Country');
        if (!pincode) missingFields.push('Pincode');

        Alert.alert(
          'Missing Information',
          `Please enter the following: ${missingFields.join(', ')}`,
        );
        return;
      }

      console.log('DEBUG: handleLocation - Current location object:', location);

      const availableLocalities = pincode;
      const user = data?.user;
      const userId = user?._id || user?.id;
      console.log('DEBUG: Manual Save. UserId:', userId);
      console.log('DEBUG: Payload - plusCode:', plusCode, 'locality:', locality, 'sublocality:', sublocality);
      const isEdit = route.params?.isEdit;
      const addressId = isEdit ? route.params?.address._id : null;
      let response;

      if (isEdit) {
        response = await api.put(`/address/${userId}/${addressId}`, {
          name,
          phone,
          houseNo: flatNo,
          plusCode: plusCode,
          locality: locality,
          sublocality: sublocality,
          fullAddress: area,
          landmark,
          city,
          state,
          country,
          postalCode: pincode,
          latitude,
          longitude,
          availableLocalities,
          isActive,
        });
      } else {
        response = await api.post(`/address/${userId}`, {
          name,
          phone,
          houseNo: flatNo,
          plusCode: plusCode,
          locality: locality,
          sublocality: sublocality,
          fullAddress: area,
          landmark,
          city,
          state,
          country,
          postalCode: pincode,
          latitude,
          longitude,
          availableLocalities,
          isActive: isActive,
        });
      }

      if (response.status === 200) {
        dispatch(saveData('user', response.data.user));
        dispatch(clearCart());
        if (route.params?.isSignin === false) {
          navigation.goBack();
        }
      }
    } catch (error) {
      const errorDetail = error.response ? JSON.stringify(error.response.data) : error.message;
      const userId = data?.user?._id || data?.user?.id || 'NO_ID';
      console.error('Error saving address and localities:', error);
      Alert.alert(
        'Save Error (Manual)',
        `Could not save address.\nUser: ${userId}\nError: ${errorDetail}`
      );
    }
  };

  const handleLocationSelect = async (data, details) => {
    console.log('details', details);
    const { geometry } = details;
    const { location } = geometry;
    const lat = location.lat;
    const lng = location.lng;

    let pincode = details.address_components.find(component =>
      component.types.includes('postal_code'),
    )?.long_name;

    const state = details.address_components.find(component =>
      component.types.includes('administrative_area_level_1'),
    )?.long_name;
    const country = details.address_components.find(component =>
      component.types.includes('country'),
    )?.long_name;
    const district = details.address_components.find(component =>
      component.types.includes('administrative_area_level_2'),
    )?.long_name;
    const subDistrict = details.address_components.find(component =>
      component.types.includes('administrative_area_level_3'),
    )?.long_name;
    const locality = details.address_components.find(component =>
      component.types.includes('locality'),
    )?.long_name;
    let city = subDistrict || district || locality || '';

    // SUPER ROBUST FALLBACK FOR INDIA
    if (details.formatted_address && state) {
      const addrParts = details.formatted_address.split(',').map(p => p.trim());
      const stateIndex = addrParts.findIndex(p => p.toLowerCase().includes(state.toLowerCase()));
      if (stateIndex > 0) {
        const inferredCity = addrParts[stateIndex - 1];
        if (inferredCity && inferredCity.length > 2) {
          city = inferredCity;
        }
      }
    }

    // Fallback 1: Extract pincode from formatted_address if not found in address_components
    if (!pincode && details.formatted_address) {
      const pincodeMatch = details.formatted_address.match(/\b\d{6}\b/);
      if (pincodeMatch) {
        pincode = pincodeMatch[0];
      }
    }

    // Fallback 2: If still no pincode, try Reverse Geocoding via Lat/Lng
    if (!pincode) {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_PLACES_API_KEY}`
        );
        const json = await response.json();
        if (json.results && json.results.length > 0) {
          const results = json.results;
          let locality = '';
          let district = '';
          let subDistrict = '';

          results.forEach(result => {
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
              if (component.types.includes('postal_code') && !pincode) {
                pincode = component.long_name;
              }
            });
          });
          const inferredCity = district || subDistrict || locality || '';
          if (inferredCity) setManualLocation(prev => ({ ...prev, city: inferredCity }));
        }
      } catch (error) {
        console.log("Error fetching pincode via reverse geocoding", error);
      }
    }

    // Ensure pincode is part of the address text
    let finalAddress = details.formatted_address;
    if (pincode && finalAddress && !finalAddress.includes(pincode)) {
      finalAddress = `${finalAddress}, ${pincode}`;
    }

    setSearchLocation(false);

    // if (!pincode) {
    //   alert('The selected location does not have a valid pincode. Please select another address.');
    //   googlePlacesRef.current?.clear();
    //   setSelectedLocation(null);
    //   return;
    // }

    // ROBUST Landmark detection from Places details
    const landmarkTypesList = [
      'point_of_interest', 'establishment', 'premise', 'place_of_worship',
      'park', 'natural_feature', 'shopping_mall', 'school', 'hospital', 'landmark'
    ];
    const detectedLandmark = details.address_components.find(c =>
      c.types.some(t => landmarkTypesList.includes(t)) && !c.long_name.includes('+')
    )?.long_name || '';
    let landmark = detectedLandmark ? `Near ${detectedLandmark}` : '';


    const sublocality = details.address_components.find(c => c.types.includes('sublocality_level_1'))?.long_name || '';

    // Deduplicate landmark if it's already in sublocality/locality
    if (landmark) {
      const landmarkTrimmed = landmark.replace('Near ', '').toLowerCase().trim();
      const sublocLower = (sublocality || '').toLowerCase().trim();
      const locLower = (locality || '').toLowerCase().trim();
      if (sublocLower.includes(landmarkTrimmed) || locLower.includes(landmarkTrimmed)) {
        landmark = '';
      }
    }

    // Construct custom fullAddress string strictly as: houseNo, sublocality, locality, landmark, city, state, country, postalCode
    const customAddress = [
      manualLocation.houseNo || '',
      sublocality,
      locality,
      landmark, // Include landmark
      city,
      state,
      country,
      pincode
    ].filter(part => part && String(part).trim() !== '').join(', ');

    const updatedLocation = {
      ...manualLocation,
      description: finalAddress,
      landmark: landmark, // Store detected landmark
      area: customAddress, // This 'area' is used as 'fullAddress' in the payload
      fullAddress: customAddress,
      pincode: pincode,
      state: state,
      country,
      city,
      plusCode: details.plus_code?.global_code || '',
      locality: locality || '',
      sublocality: details.address_components.find(c => c.types.includes('sublocality_level_1'))?.long_name || '',
      latitude: lat,
      longitude: lng,
    };
    console.log('DEBUG: handleLocationSelect - setting manualLocation:', updatedLocation);
    setManualLocation(updatedLocation);
  };

  const handleManualLocationChange = (field, value) => {
    const update = typeof field === 'object' && field !== null ? field : { [field]: value };

    setManualLocation(prevLocation => {
      const newLocation = { ...prevLocation, ...update };

      // List of fields that trigger a fullAddress (area) re-construction
      const triggerFields = ['houseNo', 'flatNo', 'sublocality', 'locality', 'landmark', 'city', 'state', 'country', 'pincode'];
      const shouldUpdateFullAddress = Object.keys(update).some(k => triggerFields.includes(k));

      if (shouldUpdateFullAddress) {
        // Construct custom fullAddress strictly as: houseNo, sublocality, locality, landmark, city, state, country, postalCode
        const components = [
          newLocation.houseNo || newLocation.flatNo || '',
          newLocation.sublocality,
          newLocation.locality,
          newLocation.landmark,
          newLocation.city,
          newLocation.state,
          newLocation.country,
          newLocation.pincode
        ].filter(part => part && String(part).trim() !== '');

        newLocation.area = components.join(', ');
        newLocation.fullAddress = newLocation.area;
      }

      return newLocation;
    });
  };

  console.log('manualLocation-->>>>', manualLocation);

  return (
    <View style={styles.container}>
      <View style={styles.switchContainer}>
        <Text style={styles.switchText}>Search Location</Text>
        <Switch value={searchLocation} onValueChange={setSearchLocation} />
      </View>
      {searchLocation ? (
        <GooglePlacesAutocomplete
          ref={googlePlacesRef}
          placeholder="Enter Location"
          fetchDetails={true}
          onPress={handleLocationSelect}
          query={{
            key: GOOGLE_PLACES_API_KEY,
            language: 'en',
            types: 'geocode',
          }}
          styles={autoCompleteStyles}
        />
      ) : (
        <ManualLocationSearch
          manualLocation={manualLocation}
          handleManualLocationChange={handleManualLocationChange}
        />
      )}
      {!searchLocation && (
        <View style={styles.defaultContainer}>
          <Text style={styles.defaultText}>Make this my default address</Text>
          <Switch
            value={manualLocation.isActive}
            onValueChange={value => handleManualLocationChange('isActive', value)}
          />
        </View>
      )}
      <View style={styles.buttonContainer}>
        <ButtonComponent title="Save Location" onPress={handleLocation} />
      </View>
    </View>
  );
};

const autoCompleteStyles = {
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 5,
  },
  textInput: {
    height: 50,
    color: '#333',
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  predefinedPlacesDescription: {
    color: '#333',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  switchText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  defaultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  defaultText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  buttonContainer: {
    padding: 15,
    backgroundColor: '#fff',
  },
});

export default LocationSearch;
