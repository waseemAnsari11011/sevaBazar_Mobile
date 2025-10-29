// src/screens/MainScreens/vendors/VendorsList.js

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const FALLBACK_IMAGE_URL =
  'https://placehold.co/600x400/EEE/31343C?text=Vendor';

/**
 * Calculates the distance between two geographical coordinates.
 * @param {object} start - The starting coordinates {latitude, longitude}.
 * @param {object} end - The ending coordinates {latitude, longitude}.
 * @returns {string|null} The distance in kilometers or null if coordinates are invalid.
 */
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

/**
 * A reusable card component to display individual vendor information.
 */
const VendorCard = ({vendor, distance, onPress}) => {
  const imageUrl =
    vendor.documents?.shopPhoto?.length > 0
      ? vendor.documents.shopPhoto[0]
      : FALLBACK_IMAGE_URL;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.imageContainer}>
        <Image source={{uri: imageUrl}} style={styles.vendorImage} />
        <View style={styles.imageOverlay} />
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

      <View style={styles.cardContent}>
        <Text style={styles.vendorName} numberOfLines={1}>
          {vendor.vendorInfo.businessName}
        </Text>
        <View style={styles.addressContainer}>
          <Icon name="map-marker" size={16} color="#7f8c8d" />
          <Text style={styles.vendorAddress} numberOfLines={1}>
            {vendor.location?.address?.addressLine1 || 'Address not available'}
          </Text>
        </View>
        {distance && (
          <View style={styles.distanceContainer}>
            <Icon name="navigation" size={14} color="#ff6600" />
            <Text style={styles.distanceText}>{distance} away</Text>
          </View>
        )}
        <View style={styles.viewDetailsContainer}>
          <Text style={styles.viewDetailsText}>Details</Text>
          <Icon name="chevron-right" size={18} color="#ff6600" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

/**
 * A generic component to render a list of vendors.
 * Handles loading, error, and empty states.
 */
const VendorsList = ({
  vendors,
  loading,
  error,
  onRetry,
  onVendorPress,
  userLocation,
}) => {
  if (loading && vendors.length === 0) {
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
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={vendors}
      keyExtractor={item => item._id}
      numColumns={2} // <-- This creates the 2-column layout
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
            onPress={() => onVendorPress(item)}
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

VendorsList.propTypes = {
  vendors: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  onRetry: PropTypes.func.isRequired,
  onVendorPress: PropTypes.func.isRequired,
  userLocation: PropTypes.object,
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 8, // Adjusted for grid spacing
    paddingTop: 8,
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
    flex: 1, // Added to make cards take up equal column space
    margin: 8, // Changed from marginBottom to provide all-around spacing
    backgroundColor: '#fff',
    borderRadius: 16,
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
    height: 140, // Reduced height for a more compact grid card
    backgroundColor: '#ecf0f1',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
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
    padding: 12, // Reduced padding for a more compact card
  },
  vendorName: {
    fontSize: 17, // Reduced font size
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
    fontSize: 13, // Slightly smaller font
    color: '#7f8c8d',
    marginLeft: 6,
    flex: 1,
    lineHeight: 18,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: '#fff3e6',
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  distanceText: {
    marginLeft: 6,
    fontSize: 12,
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

export default VendorsList;
