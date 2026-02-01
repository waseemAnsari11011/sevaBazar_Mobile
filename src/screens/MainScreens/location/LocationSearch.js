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
        flatNo: '', // DB address field is now empty
        area: address.addressLine2, // DB addressLine2 has the merged content
        landmark: address.landmark,
        pincode: address.postalCode,
        state: address.state,
        country: address.country,
        city: address.city,
        latitude: address.latitude,
        longitude: address.longitude,
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
        isActive,
      } = location;

      console.log('isActive-->', isActive);

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

      const availableLocalities = pincode;
      const userId = data?.user?._id;
      const isEdit = route.params?.isEdit;
      const addressId = isEdit ? route.params?.address._id : null;
      let response;

      const finalAddressLine2 = flatNo && area
        ? `${flatNo}, ${area}`
        : flatNo || area;

      if (isEdit) {
        response = await api.put(`/address/${userId}/${addressId}`, {
          name,
          phone,
          addressLine2: finalAddressLine2,
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
        response = await api.post(`/address/${userId}/`, {
          name,
          phone,
          addressLine2: finalAddressLine2,
          landmark,
          city,
          state,
          country,
          postalCode: pincode,
          latitude,
          longitude,
          availableLocalities,
          isActive: isActive, // Use the user's selection
        });
      }

      if (response.status === 200) {
        dispatch(saveData('user', response.data.user));
        if (route.params?.isSignin === false) {
          navigation.goBack();
        }
      }
    } catch (error) {
      console.error('Error saving address and localities:', error);
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
    const city = details.address_components.find(component =>
      component.types.includes('locality'),
    )?.long_name;

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
          const addressComponents = json.results[0].address_components;
          const postalCodeComponent = addressComponents.find(c => c.types.includes('postal_code'));
          if (postalCodeComponent) {
            pincode = postalCodeComponent.long_name;
          }
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

    setManualLocation({
      ...manualLocation,
      description: finalAddress,
      flatNo: '',
      area: finalAddress,
      pincode: pincode,
      state: state,
      country,
      city,
      latitude: lat,
      longitude: lng,
    });
  };

  const handleManualLocationChange = (field, value) => {
    if (typeof field === 'object' && field !== null) {
      setManualLocation(prevLocation => ({
        ...prevLocation,
        ...field,
      }));
    } else {
      setManualLocation(prevLocation => ({
        ...prevLocation,
        [field]: value,
      }));
    }
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
