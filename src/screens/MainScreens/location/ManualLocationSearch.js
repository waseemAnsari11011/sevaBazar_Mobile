import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Button,
  Platform,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {request, PERMISSIONS} from 'react-native-permissions';
import {GOOGLE_API_KEY} from '@env';

// const GOOGLE_API_KEY = 'AIzaSyBtcD7utCMCNfVxGvn9CWoKSH-BJ068uw0'

const ManualLocationSearch = ({manualLocation, handleManualLocationChange}) => {
  console.log('manualLocation-->>', manualLocation);
  const [loading, setLoading] = useState(false);
  const [name, setname] = useState('');
  const [phone, setphone] = useState('');

  const requestLocationPermission = async () => {
    const result = await request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    );
    return result === 'granted';
  };

  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission denied',
        'Location permission is required to fetch your current location',
      );
      return;
    }
    setLoading(true);
    Geolocation.getCurrentPosition(
      async position => {
        const {latitude, longitude} = position.coords;
        console.log('latitude, longitude-->>', latitude, longitude);
        const location = await getPhysicalAddress(latitude, longitude);

        if (location) {
          handleManualLocationChange('description', location.description);
          handleManualLocationChange('landmark', location.landmark);
          handleManualLocationChange('city', location.city);
          handleManualLocationChange('state', location.state);
          handleManualLocationChange('country', location.country);
          handleManualLocationChange('pincode', location.pincode);
        }
        setLoading(false);
      },
      error => {
        setLoading(false);
        Alert.alert('Error', 'Unable to fetch current location');
        console.error(error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const getPhysicalAddress = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`,
      );
      if (response.status === 200) {
        const addressComponents = response.data.results[0].address_components;
        const location = {
          description: response.data.results[0].formatted_address,
          city: addressComponents.find(component =>
            component.types.includes('locality'),
          )?.long_name,
          state: addressComponents.find(component =>
            component.types.includes('administrative_area_level_1'),
          )?.long_name,
          country: addressComponents.find(component =>
            component.types.includes('country'),
          )?.long_name,
          pincode: addressComponents.find(component =>
            component.types.includes('postal_code'),
          )?.long_name,
        };
        return location;
      } else {
        Alert.alert('Error', 'Unable to fetch address from coordinates');
        return null;
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to fetch address from coordinates');
      console.error(error);
      return null;
    }
  };

  return (
    <ScrollView style={styles.manualInputContainer}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <TextInput
            style={styles.textInput}
            placeholder="Name"
            value={manualLocation?.name}
            onChangeText={text => handleManualLocationChange('name', text)}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Phone"
            value={manualLocation?.phone}
            onChangeText={text => handleManualLocationChange('phone', text)}
          />
          <View style={{marginVertical: 10}}>
            <Button title="Get Address" onPress={getCurrentLocation} />
          </View>

          <TextInput
            style={styles.textInput}
            placeholder="Address"
            value={manualLocation?.description}
            onChangeText={text =>
              handleManualLocationChange('description', text)
            }
          />
          <TextInput
            style={styles.textInput}
            placeholder="Landmark"
            value={manualLocation?.landmark}
            onChangeText={text => handleManualLocationChange('landmark', text)}
          />
          <TextInput
            style={styles.textInput}
            placeholder="City"
            value={manualLocation?.city}
            onChangeText={text => handleManualLocationChange('city', text)}
          />
          <TextInput
            style={styles.textInput}
            placeholder="State"
            value={manualLocation?.state}
            onChangeText={text => handleManualLocationChange('state', text)}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Country"
            value={manualLocation?.country}
            onChangeText={text => handleManualLocationChange('country', text)}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Pincode"
            value={manualLocation?.pincode}
            onChangeText={text => handleManualLocationChange('pincode', text)}
          />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  manualInputContainer: {
    flex: 1,
  },
  textInput: {
    height: 40,
    color: '#5d5d5d',
    fontSize: 16,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default ManualLocationSearch;
