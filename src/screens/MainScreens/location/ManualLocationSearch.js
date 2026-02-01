import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Button,
  Platform,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { request, PERMISSIONS } from 'react-native-permissions';
import { GOOGLE_API_KEY } from '@env';

// const GOOGLE_API_KEY = 'AIzaSyBtcD7utCMCNfVxGvn9CWoKSH-BJ068uw0'

import { Picker } from '@react-native-picker/picker';

const ManualLocationSearch = ({ manualLocation, handleManualLocationChange }) => {
  console.log('manualLocation-->>', manualLocation);
  const [loading, setLoading] = useState(false);

  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];

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
        const { latitude, longitude } = position.coords;
        console.log('latitude, longitude-->>', latitude, longitude);
        const location = await getPhysicalAddress(latitude, longitude);

        if (location) {
          handleManualLocationChange({
            description: location.description,
            flatNo: '',
            area: location.description,
            landmark: location.landmark || '',
            city: location.city,
            state: location.state,
            country: location.country,
            pincode: location.pincode,
            latitude: latitude,
            longitude: longitude,
          });
        }
        setLoading(false);
      },
      error => {
        setLoading(false);
        Alert.alert('Error', 'Unable to fetch current location');
        console.error(error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
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
          landmark: addressComponents.find(component =>
            component.types.includes('sublocality_level_1'),
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
        <View style={styles.formContainer}>
          <View style={styles.autofillContainer}>
            <Button title="Autofill your current location" onPress={getCurrentLocation} color="#007bff" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Country/Region</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={manualLocation?.country || 'India'}
                onValueChange={(itemValue) => handleManualLocationChange('country', itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="India" value="India" />
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full name (First and Last name)</Text>
            <TextInput
              style={styles.textInput}
              placeholder=""
              value={manualLocation?.name}
              onChangeText={text => handleManualLocationChange('name', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile number</Text>
            <TextInput
              style={styles.textInput}
              placeholder=""
              keyboardType="phone-pad"
              value={manualLocation?.phone}
              onChangeText={text => handleManualLocationChange('phone', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Pincode</Text>
            <TextInput
              style={styles.textInput}
              placeholder="6-digit Pincode"
              keyboardType="number-pad"
              value={manualLocation?.pincode}
              onChangeText={text => handleManualLocationChange('pincode', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Flat, House no., Building, Company, Apartment</Text>
            <TextInput
              style={styles.textInput}
              placeholder=""
              value={manualLocation?.flatNo}
              onChangeText={text => handleManualLocationChange('flatNo', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Area, Street, Sector, Village</Text>
            <TextInput
              style={styles.textInput}
              placeholder=""
              value={manualLocation?.area}
              onChangeText={text => handleManualLocationChange('area', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Landmark</Text>
            <TextInput
              style={styles.textInput}
              placeholder="E.g. near apollo hospital"
              value={manualLocation?.landmark}
              onChangeText={text => handleManualLocationChange('landmark', text)}
            />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={[styles.inputGroup, { flex: 0.48 }]}>
              <Text style={styles.label}>Town/City</Text>
              <TextInput
                style={styles.textInput}
                placeholder=""
                value={manualLocation?.city}
                onChangeText={text => handleManualLocationChange('city', text)}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 0.48 }]}>
              <Text style={styles.label}>State</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={manualLocation?.state}
                  onValueChange={(itemValue) => handleManualLocationChange('state', itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select State" value="" />
                  {states.map((state) => (
                    <Picker.Item key={state} label={state} value={state} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};



const styles = StyleSheet.create({
  manualInputContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    padding: 15,
  },
  autofillContainer: {
    backgroundColor: '#f0faff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#bce8f1',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  textInput: {
    height: 45,
    color: '#333',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  picker: {
    height: 45,
    width: '100%',
  },
});

export default ManualLocationSearch;
