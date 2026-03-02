import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import { baseURL } from '../../../../utils/api';

import { useDispatch, useSelector } from 'react-redux';
import {
  detectLocation,
  saveLocationToBackend,
} from '../../../../config/redux/actions/locationActions';
import { clearCart } from '../../../../config/redux/actions/cartActions';

const HomeHeader = ({ user }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [detectedAddress, setDetectedAddress] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);

  // Retrieve active address
  const activeAddress = user?.shippingAddresses?.find(addr => addr.isActive);

  // Format the location text for display
  const locationText = activeAddress
    ? activeAddress.address === 'Current Location'
      ? activeAddress.fullAddress || 'Current Location'
      : activeAddress.fullAddress || `${activeAddress.address}, ${activeAddress.city}`
    : 'Select Location';

  let profileUrl = user?.image;
  if (profileUrl?.startsWith('http:')) {
    profileUrl = profileUrl.replace('http:', 'https:');
  } else if (profileUrl && profileUrl.includes('uploads/customer')) {
    profileUrl = `${baseURL}${profileUrl}`;
  }

  const toggleBottomSheet = () => {
    setIsBottomSheetVisible(!isBottomSheetVisible);
    if (!isBottomSheetVisible) {
      setDetectedAddress(null); // Reset when opening
    }
  };

  const handleUseCurrentLocation = async () => {
    if (!detectedAddress) {
      setIsDetecting(true);
      try {
        const result = await dispatch(detectLocation());
        setDetectedAddress(result);
      } catch (error) {
        console.error('Detection failed:', error);
        const errorMessage = error.message || 'Unknown error';
        Alert.alert(
          'Location Error',
          `Failed to fetch your location: ${errorMessage}. Please check if GPS is on and try again.`
        );
      } finally {
        setIsDetecting(false);
      }
    } else {
      // Confirm and save
      try {
        const updatedUser = await dispatch(saveLocationToBackend(detectedAddress));
        dispatch(clearCart());
        setIsBottomSheetVisible(false);
        setDetectedAddress(null);
        if (updatedUser) {
          Alert.alert('Success', 'Location saved successfully.');
        }
      } catch (error) {
        const errorDetail = error.response ? JSON.stringify(error.response.data) : error.message;
        const userId = user?._id || user?.id || 'NO_ID';
        console.error('Save failed:', error);
        Alert.alert(
          'Save Error (Home)',
          `Failed to save location.\nUser: ${userId}\nError: ${errorDetail}`
        );
      }
    }
  };

  const handleSearchPress = () => {
    navigation.navigate('Search Your Products');
  };

  return (
    <LinearGradient
      colors={['#000066', '#ffffff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}>
      {/* Top Row: Brand, Time, Location, Profile */}
      <View style={styles.topRow}>
        <View style={styles.leftColumn}>
          <Text style={styles.brandText}>SevaBazar in</Text>
          <Text style={styles.deliveryTimeText}>15 minutes</Text>
          <TouchableOpacity
            style={styles.locationRow}
            onPress={toggleBottomSheet}
            activeOpacity={0.7}>
            <Text style={styles.locationText} numberOfLines={1}>
              {locationText}
            </Text>
            <Ionicons name="caret-down" size={12} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.rightColumn}>
          <Image
            source={require('../../../../assets/images/brandMain.png')}
            style={{ width: 60, height: 60, resizeMode: 'contain' }}
          />
        </View>
      </View>

      {/* Bottom Row: Search Bar */}
      <View style={styles.searchContainer}>
        <TouchableOpacity
          style={styles.searchBar}
          onPress={handleSearchPress}
          activeOpacity={1}>
          <Ionicons name="search" size={20} color="#ff6600" style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>Search "stationery"</Text>

        </TouchableOpacity>
      </View>

      {/* Bottom Sheet Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isBottomSheetVisible}
        onRequestClose={toggleBottomSheet}>
        <TouchableWithoutFeedback onPress={toggleBottomSheet}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.bottomSheetContent}>
                <View style={styles.bottomSheetHeader}>
                  <Text style={styles.bottomSheetTitle}>
                    Your Location
                  </Text>
                  <TouchableOpacity onPress={toggleBottomSheet}>
                    <Ionicons name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>

                {/* Show Current Location Details */}
                <View style={{ marginBottom: 20 }}>
                  {isDetecting && (
                    <Text style={{ color: '#666', fontSize: 14 }}>
                      Detecting your location...
                    </Text>
                  )}
                  {isDetecting ? (
                    <ActivityIndicator size="small" color="#27ae60" style={{ marginTop: 10, alignSelf: 'flex-start' }} />
                  ) : (
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', marginTop: 5 }}>
                      {detectedAddress
                        ? (detectedAddress.fullAddress || detectedAddress.city || 'Detected Location')
                        : activeAddress ? (
                          activeAddress.address === 'Current Location'
                            ? (activeAddress.fullAddress || 'Current GPS Location')
                            : `${activeAddress.fullAddress || activeAddress.address}, ${activeAddress.city}`
                        ) : 'No location selected'}
                    </Text>
                  )}

                  {detectedAddress && !isDetecting && (
                    <Text style={{ fontSize: 12, color: '#999', marginTop: 2 }}>
                      {detectedAddress.houseNo}
                    </Text>
                  )}

                  {activeAddress && activeAddress.address === 'Current Location' && !detectedAddress && !isDetecting && (
                    <Text style={{ fontSize: 12, color: '#999', marginTop: 2 }}>
                      {activeAddress.latitude?.toFixed(4)}, {activeAddress.longitude?.toFixed(4)}
                    </Text>
                  )}
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[
                      styles.locationButton,
                      styles.useCurrentLocationButton,
                      detectedAddress && { backgroundColor: '#000066' }
                    ]}
                    onPress={handleUseCurrentLocation}
                    disabled={isDetecting}>
                    <Ionicons name={detectedAddress ? "checkmark-circle" : "locate"} size={20} color="#fff" />
                    <Text style={[styles.buttonText, styles.useCurrentLocationText]} numberOfLines={1}>
                      {isDetecting ? 'Fetching...' : detectedAddress ? 'Confirm' : 'Current'}
                    </Text>
                  </TouchableOpacity>

                  {!isDetecting && (
                    <TouchableOpacity
                      style={[styles.locationButton, styles.changeAddressButton]}
                      onPress={() => {
                        setIsBottomSheetVisible(false);
                        navigation.navigate('Profile', { screen: 'Location List' });
                      }}>
                      <Ionicons name="map" size={20} color="#fff" />
                      <Text style={[styles.buttonText, styles.changeAddressText]} numberOfLines={1}>Change Address</Text>
                    </TouchableOpacity>
                  )}
                </View>

              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#2C2C2E', // Dark background like Blinkit
    paddingTop: 10, // Adjust based on status bar
    paddingBottom: 15,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  leftColumn: {
    flex: 1,
  },
  brandText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.9,
    marginBottom: 2,
  },
  deliveryTimeText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
    marginRight: 5,
    maxWidth: '85%',
  },
  rightColumn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  searchContainer: {
    width: '100%',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 45,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchPlaceholder: {
    flex: 1,
    color: '#666',
    fontSize: 15,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheetContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 200,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  locationButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  useCurrentLocationButton: {
    backgroundColor: '#27ae60',
  },
  changeAddressButton: {
    backgroundColor: '#000066',
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  useCurrentLocationText: {
    color: '#fff',
  },
  changeAddressText: {
    color: '#fff',
  },
});

export default HomeHeader;
