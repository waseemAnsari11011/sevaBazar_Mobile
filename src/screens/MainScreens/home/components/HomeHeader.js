import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

import {baseURL} from '../../../../utils/api';

const HomeHeader = ({user}) => {
  const navigation = useNavigation();
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  const activeAddress = user?.shippingAddresses?.find(addr => addr.isActive);
  const locationText = activeAddress
    ? `${activeAddress.city}, ${activeAddress.postalCode}`
    : 'Select Location';

  let profileUrl = user?.image;
  if (profileUrl?.startsWith('http:')) {
    profileUrl = profileUrl.replace('http:', 'https:');
  } else if (profileUrl && profileUrl.includes('uploads/customer')) {
    profileUrl = `${baseURL}${profileUrl}`;
  }

  const toggleBottomSheet = () => {
    setIsBottomSheetVisible(!isBottomSheetVisible);
  };

  const handleUpdateLocation = () => {
    setIsBottomSheetVisible(false);
    navigation.navigate('Location List');
  };

  const handleAddLocation = () => {
    setIsBottomSheetVisible(false);
    navigation.navigate('Add Location', {isSignin: false});
  };

  const handleSearchPress = () => {
    navigation.navigate('Search Your Products');
  };

  return (
    <View style={styles.container}>
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
              HOME - {locationText}
            </Text>
            <Ionicons name="caret-down" size={12} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.rightColumn}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <View style={styles.profileIconContainer}>
              {profileUrl ? (
                <Image
                  source={{uri: profileUrl}}
                  style={{width: 36, height: 36, borderRadius: 18}}
                />
              ) : (
                <Ionicons name="person" size={20} color="#000" />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Row: Search Bar */}
      <View style={styles.searchContainer}>
        <TouchableOpacity
          style={styles.searchBar}
          onPress={handleSearchPress}
          activeOpacity={1}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>Search "stationery"</Text>
          <View style={styles.micIconContainer}>
             <Ionicons name="mic" size={18} color="#666" />
          </View>
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
                    Select Location Option
                  </Text>
                  <TouchableOpacity onPress={toggleBottomSheet}>
                    <Ionicons name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.bottomSheetOption}
                  onPress={handleUpdateLocation}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="map" size={22} color="#000066" />
                  </View>
                  <Text style={styles.optionText}>Update Location</Text>
                  <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.bottomSheetOption}
                  onPress={handleAddLocation}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="add-circle" size={22} color="#000066" />
                  </View>
                  <Text style={styles.optionText}>Add New Location</Text>
                  <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2C2C2E', // Dark background like Blinkit
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
  micIconContainer: {
      borderLeftWidth: 1,
      borderLeftColor: '#eee',
      paddingLeft: 10,
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
  bottomSheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
});

export default HomeHeader;
