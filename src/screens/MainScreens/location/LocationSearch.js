import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
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
    pincode: '',
    state: '',
    country: '',
    city: '',
    isActive:false
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
        pincode: address.postalCode,
        state: address.state,
        country: address.country,
        city: address.city,
        isActive: address.isActive
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

      const { description, city, state, country, pincode, name, phone, isActive } = location;

      console.log("isActive-->", isActive)

      if (!description || !city || !state || !country || !pincode) {
        let missingFields = [];
        if (!description) missingFields.push('description');
        if (!city) missingFields.push('city');
        if (!state) missingFields.push('state');
        if (!country) missingFields.push('country');
        if (!pincode) missingFields.push('pincode');

        Alert.alert('Missing Information', `Please enter the following: ${missingFields.join(', ')}`);
        return;
      }

      const availableLocalities = pincode;
      const userId = data?.user?._id;
      const isEdit = route.params?.isEdit;
      const addressId = isEdit ? route.params?.address._id : null;
      let response;

      if (isEdit) {
        response = await api.put(`/address/${userId}/${addressId}`, {
          name,
          phone,
          addressLine1: description,
          city,
          state,
          country,
          postalCode: pincode,
          availableLocalities,
          isActive
        });
      } else {
        response = await api.post(`/address/${userId}/`, {
          name,
          phone,
          addressLine1: description,
          city,
          state,
          country,
          postalCode: pincode,
          availableLocalities,
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

  const handleLocationSelect = (data, details) => {
    const pincode = details.address_components.find(
      (component) => component.types.includes('postal_code')
    )?.long_name;
    const state = details.address_components.find(
      (component) => component.types.includes('administrative_area_level_1')
    )?.long_name;
    const country = details.address_components.find(
      (component) => component.types.includes('country')
    )?.long_name;
    const city = details.address_components.find(
      (component) => component.types.includes('locality')
    )?.long_name;

    if (!pincode) {
      alert('The selected location does not have a valid pincode. Please select another address.');
      googlePlacesRef.current?.clear();
      setSelectedLocation(null);
      return;
    }

    setSelectedLocation({
      description: data.description,
      pincode: pincode,
      state: state,
      country,
      city,
    });
  };

  const handleManualLocationChange = (field, value) => {
    setManualLocation((prevLocation) => ({
      ...prevLocation,
      [field]: value,
    }));
  };

  console.log("manualLocation-->>>>", manualLocation)

  return (
    <View style={styles.container}>
      <View style={styles.switchContainer}>
        {/* <Text style={styles.switchText}>Search Location</Text> */}
        {/* <Switch
          value={searchLocation}
          onValueChange={setSearchLocation}
        /> */}
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
      <ButtonComponent title="Save Location" onPress={handleLocation} />
    </View>
  );
};

const autoCompleteStyles = {
  container: {
    flex: 1,
  },
  textInput: {
    height: 38,
    color: '#5d5d5d',
    fontSize: 16,
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
  },
});

export default LocationSearch;
