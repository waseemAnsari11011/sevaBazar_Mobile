import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Icon from 'react-native-vector-icons/Ionicons'; // Assume using Ionicons from react-native-vector-icons
import { useDispatch, useSelector } from 'react-redux';
import ManualLocationSearch from './ManualLocationSearch'; // Import the new component
import ButtonComponent from '../../../components/Button';
import api from '../../../utils/api';
import { loadData, saveData } from '../../../config/redux/actions/storageActions';
import { GOOGLE_API_KEY } from '@env';

const GOOGLE_PLACES_API_KEY = GOOGLE_API_KEY;

const LocationSearch = ({ navigation, route }) => {
  const dispatch = useDispatch()
  const { data } = useSelector(state => state?.local);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchLocation, setSearchLocation] = useState(false);
  const [manualLocation, setManualLocation] = useState({
    description: '',
    pincode: '',
    state: '',
    country: '',
    city: '',
  });
  const googlePlacesRef = useRef(null);

  useEffect(() => {
    const loadLocalData = async () => {
      await dispatch(loadData('user'));
    };
    loadLocalData();
  }, []);

  const handleLocation = async () => {
    try {
      const location = searchLocation ? selectedLocation : manualLocation;
      if (!location) {
        return; // If no location is selected, exit the function
      }

      const { description, city, state, country, pincode } = location;

      // Check for missing fields
      if (!description || !city || !state || !country || !pincode) {
        let missingFields = [];
        if (!description) missingFields.push('description');
        if (!city) missingFields.push('city');
        if (!state) missingFields.push('state');
        if (!country) missingFields.push('country');
        if (!pincode) missingFields.push('pincode');

        Alert.alert('Missing Information', `Please enter the following: ${missingFields.join(', ')}`);
        return; // Exit the function if any field is missing
      }

      const availableLocalities = pincode;

      console.log("pincode-->>", pincode);

      // Get the userId from your application's state or context
      const userId = data?.user?._id; // Replace 'user_id_here' with the actual userId

      // Make a POST request to your server endpoint
      const response = await api.post(`/address/${userId}/`, {
        addressLine1: description,
        city,
        state,
        country,
        postalCode: pincode,
        availableLocalities
      });

      if (response.status === 200) {
        dispatch(saveData('user', response.data.user));
        if (route?.params?.isCheckOut || route?.params?.goBack) {
          console.log("Checkout location ran");
          dispatch(loadData('user'));
          navigation.goBack();
        } else {
          // Navigate to the "Main" screen or any other screen as needed
          navigation.navigate('Main');
        }
      }
    } catch (error) {
      console.error('Error saving address and localities:', error);
      // Handle error
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
      // Alert the user and clear the search input and selected location
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
      city
    });
  };

  const handleManualLocationChange = (field, value) => {
    setManualLocation((prevLocation) => ({
      ...prevLocation,
      [field]: value,
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Select location</Text>
      <View style={styles.switchContainer}>
        <Text>Search Location</Text>
        <Switch
          value={searchLocation}
          onValueChange={setSearchLocation}
        />
      </View>
      {searchLocation ? (
        <GooglePlacesAutocomplete
          ref={googlePlacesRef}
          placeholder="Search for a location"
          minLength={2}
          fetchDetails={true}
          onPress={handleLocationSelect}
          query={{
            key: GOOGLE_PLACES_API_KEY,
            language: 'en',
          }}
          styles={{
            container: styles.autocompleteContainer,
            textInputContainer: styles.textInputContainer,
            textInput: styles.textInput,
            listView: styles.listView,
            row: styles.row,
            description: styles.description,
          }}
          renderLeftButton={() => (
            <View style={styles.leftIconContainer}>
              <Icon name="search" size={20} color="#555" />
            </View>
          )}
          renderRightButton={() => (
            <TouchableOpacity onPress={() => googlePlacesRef.current?.clear()} style={styles.rightIconContainer}>
              <Icon name="close" size={20} color="#555" />
            </TouchableOpacity>
          )}
        />
      ) : (
        <ManualLocationSearch
          manualLocation={manualLocation}
          handleManualLocationChange={handleManualLocationChange}
        />
      )}
      {(selectedLocation || (!searchLocation && manualLocation.description)) && (
        <View style={styles.selectedLocationContainer}>
          <Text style={styles.locationText}>Location: {!searchLocation ? manualLocation.description : selectedLocation.description}</Text>
          <Text style={styles.pincodeText}>Pincode: {!searchLocation ? manualLocation.pincode : selectedLocation.pincode}</Text>
          <View style={{ marginTop: 30 }}>
            <ButtonComponent title={'Confirm Location'} color={'#ff6600'} onPress={handleLocation} />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  autocompleteContainer: {
    flex: 0,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    padding: 5,
    paddingLeft: 10,
  },
  textInput: {
    height: 40,
    flex: 1,
    color: '#5d5d5d',
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  listView: {
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  description: {
    marginLeft: 10,
    fontSize: 14,
    color: '#000',
  },
  selectedLocationContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
  locationText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pincodeText: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  leftIconContainer: {
    marginRight: 10,
  },
  rightIconContainer: {
    marginLeft: 10,
  },
});

export default LocationSearch;
