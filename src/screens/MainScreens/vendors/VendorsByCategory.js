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
  TextInput,
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
          <ActivityIndicator size="large" color="#ff6600" />
          <Text style={styles.loadingText}>Finding vendors...</Text>
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.centeredContainer}>
          <Icon name="alert-circle-outline" size={64} color="#e74c3c" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => dispatch(fetchVendorsByCategory(categoryId))}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
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
          !loading && (
            <View style={styles.centeredContainer}>
              <Icon name="store-search-outline" size={80} color="#bdc3c7" />
              <Text style={styles.emptyText}>No vendors found</Text>
              <Text style={styles.emptySubtext}>
                Try adjusting your search or check back later
              </Text>
            </View>
          )
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <SafeScreen style={styles.screen}>
      <CustomHeader title={categoryTitle} navigation={navigation} />

      {/* Search Bar with Modern Design */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Icon
            name="magnify"
            size={22}
            color="#ff6600"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for dukaan..."
            placeholderTextColor="#95a5a6"
            value={searchQuery}
            onChangeText={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => handleSearch('')}
              style={styles.clearButton}>
              <Icon name="close-circle" size={20} color="#95a5a6" />
            </TouchableOpacity>
          )}
        </View>

        {/* Results Count */}
        {!loading && vendors.length > 0 && (
          <Text style={styles.resultsCount}>
            {vendors.length} {vendors.length === 1 ? 'vendor' : 'vendors'} found
          </Text>
        )}
      </View>

      {/* Content */}
      <View style={{flex: 1}}>{renderContent()}</View>
    </SafeScreen>
  );
};

const VendorCard = ({vendor, distance, onPress}) => {
  const imageUrl =
    vendor.documents?.shopPhoto?.length > 0
      ? vendor.documents.shopPhoto[0]
      : FALLBACK_IMAGE_URL;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {/* Image with Gradient Overlay */}
      <View style={styles.imageContainer}>
        <Image source={{uri: imageUrl}} style={styles.vendorImage} />
        <View style={styles.imageOverlay} />

        {/* Online Status Badge */}
        <View
          style={[
            styles.statusIndicator,
            {backgroundColor: vendor.isOnline ? '#2ecc71' : '#95a5a6'},
          ]}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>
            {vendor.isOnline ? 'Open' : 'Closed'}
          </Text>
        </View>
      </View>

      {/* Card Content */}
      <View style={styles.cardContent}>
        {/* Vendor Name */}
        <Text style={styles.vendorName} numberOfLines={1}>
          {vendor.vendorInfo.businessName}
        </Text>

        {/* Address */}
        <View style={styles.addressContainer}>
          <Icon name="map-marker" size={16} color="#7f8c8d" />
          <Text style={styles.vendorAddress} numberOfLines={2}>
            {vendor.location?.address?.addressLine1 || 'Address not available'}
          </Text>
        </View>

        {/* Distance Info */}
        {distance && (
          <View style={styles.distanceContainer}>
            <Icon name="navigation" size={14} color="#ff6600" />
            <Text style={styles.distanceText}>{distance} away</Text>
          </View>
        )}

        {/* View Details Button */}
        <View style={styles.viewDetailsContainer}>
          <Text style={styles.viewDetailsText}>View Details</Text>
          <Icon name="chevron-right" size={18} color="#ff6600" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#f8f9fa',
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
    padding: 0,
  },
  clearButton: {
    padding: 4,
  },
  resultsCount: {
    fontSize: 13,
    color: '#7f8c8d',
    marginTop: 8,
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    flexGrow: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  vendorImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#ecf0f1',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  statusIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
    marginRight: 6,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cardContent: {
    padding: 16,
  },
  vendorName: {
    fontSize: 19,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  vendorAddress: {
    fontSize: 14,
    color: '#7f8c8d',
    marginLeft: 6,
    flex: 1,
    lineHeight: 20,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff3e6',
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  distanceText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#ff6600',
    fontWeight: '600',
  },
  viewDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f3f5',
  },
  viewDetailsText: {
    fontSize: 14,
    color: '#ff6600',
    fontWeight: '600',
    marginRight: 4,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#2c3e50',
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    textAlign: 'center',
    fontSize: 14,
    color: '#95a5a6',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#e74c3c',
    marginTop: 16,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#ff6600',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default VendorsByCategory;
