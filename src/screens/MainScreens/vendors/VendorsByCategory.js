// src/screens/MainScreens/vendors/VendorsByCategory.js

import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import SafeScreen from '../../../components/SafeScreen';
import CustomHeader from '../../../components/CustomHeader';
import {
  fetchVendorsByCategory,
  resetVendorsByCategory,
  searchVendors,
} from '../../../config/redux/actions/vendorActions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SearchBar from '../../../components/SearchBar';
import {debounce} from 'lodash';

const FALLBACK_IMAGE_URL =
  'https://placehold.co/600x400/EEE/31343C?text=Vendor';

const getDistance = (start, end) => {
  if (
    !start?.latitude ||
    !start?.longitude ||
    !end?.latitude ||
    !end?.longitude
  ) {
    return null;
  }
  const toRad = x => (x * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(end.latitude - start.latitude);
  const dLon = toRad(end.longitude - start.longitude);
  const lat1 = toRad(start.latitude);
  const lat2 = toRad(end.latitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return `${distance.toFixed(1)} km`;
};

const VendorsByCategory = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const {categoryId, categoryTitle} = route.params;

  const {vendors, loading, error} = useSelector(
    state => state.vendorsByCategory,
  );
  const {location: userLocation} = useSelector(state => state.location);
  const [searchQuery, setSearchQuery] = useState('');

  // Initial fetch on component mount
  useEffect(() => {
    dispatch(fetchVendorsByCategory(categoryId));

    // Cleanup on unmount
    return () => {
      dispatch(resetVendorsByCategory());
    };
  }, [dispatch, categoryId]);

  // Debounced search handler to avoid excessive API calls
  const debouncedSearch = useCallback(
    debounce((id, query) => {
      if (query.length > 1) {
        dispatch(searchVendors(id, query));
      } else if (query.length === 0) {
        // If search is cleared, fetch all vendors again
        dispatch(fetchVendorsByCategory(id));
      }
    }, 500), // 500ms delay
    [dispatch],
  );

  const handleSearch = text => {
    setSearchQuery(text);
    debouncedSearch(categoryId, text);
  };

  const renderContent = () => {
    if (loading && vendors.length === 0) {
      // Show loader only on initial load
      return (
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color="#4a90e2" />
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.centeredContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }
    return (
      <FlatList
        data={vendors}
        keyExtractor={item => item._id}
        renderItem={({item}) => {
          const vendorCoords =
            item.location?.coordinates?.length === 2
              ? {
                  longitude: item.location.coordinates[0],
                  latitude: item.location.coordinates[1],
                }
              : null;
          const distance = userLocation
            ? getDistance(userLocation, vendorCoords)
            : null;

          return (
            <VendorCard
              vendor={item}
              distance={distance}
              onPress={() =>
                navigation.navigate('VendorDetails', {vendorId: item._id})
              }
            />
          );
        }}
        ListEmptyComponent={
          !loading && ( // Hide "no vendors" message while loading
            <View style={styles.centeredContainer}>
              <Icon name="store-search-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No vendors found.</Text>
            </View>
          )
        }
        contentContainerStyle={styles.listContainer}
      />
    );
  };

  return (
    <SafeScreen style={styles.screen}>
      <CustomHeader title={categoryTitle} navigation={navigation} />
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Search for services or vendors..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      {/* This View ensures the FlatList takes the remaining space */}
      <View style={{flex: 1, marginTop: 60}}>{renderContent()}</View>
    </SafeScreen>
  );
};

const VendorCard = ({vendor, distance, onPress}) => {
  // ... (This component remains unchanged)
  const imageUrl =
    vendor.documents?.shopPhoto?.length > 0
      ? vendor.documents.shopPhoto[0]
      : FALLBACK_IMAGE_URL;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{uri: imageUrl}} style={styles.vendorImage} />
      <View
        style={[
          styles.statusIndicator,
          {backgroundColor: vendor.isOnline ? '#2ecc71' : '#95a5a6'},
        ]}>
        <Text style={styles.statusText}>
          {vendor.isOnline ? 'Online' : 'Offline'}
        </Text>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.vendorName} numberOfLines={1}>
            {vendor.vendorInfo.businessName}
          </Text>
        </View>
        <View style={styles.addressContainer}>
          <Icon name="map-marker-outline" size={16} color="#888" />
          <Text style={styles.vendorAddress} numberOfLines={1}>
            {vendor.location?.address?.addressLine1 || 'Address not available'}
          </Text>
        </View>
        {distance && (
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Icon name="map-marker-distance" size={16} color="#4a90e2" />
              <Text style={styles.infoText}>{distance} away</Text>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#f4f6f8',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 5,
    backgroundColor: '#f4f6f8',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
    flexGrow: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  vendorImage: {
    width: '100%',
    height: 160,
  },
  statusIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardContent: {
    padding: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  vendorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbe6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#f39c12',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  vendorAddress: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    flex: 1,
  },
  infoRow: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 5,
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 10,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#e74c3c',
  },
});

export default VendorsByCategory;
