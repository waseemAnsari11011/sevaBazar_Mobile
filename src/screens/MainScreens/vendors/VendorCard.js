import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
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
const VendorCard = ({vendor, userLocation, onPress}) => {
  const imageUrl =
    vendor.documents?.shopPhoto?.length > 0
      ? vendor.documents.shopPhoto[0]
      : FALLBACK_IMAGE_URL;

  // --- Logic moved here ---
  const vendorCoords =
    vendor.location?.coordinates?.length === 2
      ? {
          longitude: vendor.location.coordinates[0],
          latitude: vendor.location.coordinates[1],
        }
      : null;
  const distance = userLocation
    ? getDistance(userLocation, vendorCoords)
    : null;

  // Use isOnline as the source of truth. 
  // The 'status' field might be 'online' even if isOnline is false (user toggled off).
  const isVendorOnline = vendor.isOnline;
  // --- End of moved logic ---

  return (
    <TouchableOpacity
      style={[styles.card, !isVendorOnline && {backgroundColor: '#f5f5f5'}]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!isVendorOnline}>
      <View style={styles.imageContainer}>
        <Image source={{uri: imageUrl}} style={styles.vendorImage} />
        <View style={[styles.imageOverlay, !isVendorOnline && styles.offlineOverlay]} />
        <View
          style={[
            styles.statusIndicator,
            {backgroundColor: isVendorOnline ? 'green' : '#2c3e50'},
          ]}>
          <View style={isVendorOnline ? styles.statusDot : null} />
          {isVendorOnline ? (
            <Text style={styles.statusText}>Open</Text>
          ) : (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon
                name="lock"
                size={12}
                color="#fff"
                style={{marginRight: 4}}
              />
              <Text style={styles.statusText}>Closed</Text>
            </View>
          )}
        </View>
      </View>
      <View style={[styles.cardContent, !isVendorOnline && {opacity: 0.5}]}>
        <View style={styles.headerRow}>
          <Text style={styles.businessName} numberOfLines={1}>
            {vendor.vendorInfo?.businessName || vendor.name}
          </Text>
          {distance && (
            <View style={styles.distanceBadge}>
              <Icon name="map-marker" size={12} color="#ff6600" />
              <Text style={styles.distanceText}>{distance}</Text>
            </View>
          )}
        </View>

        <View style={styles.infoRow}>
          <Icon name="map-marker-outline" size={14} color="#7f8c8d" />
          <Text style={styles.addressText} numberOfLines={1}>
            {vendor.location?.address?.city ||
              vendor.location?.address?.addressLine1}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

VendorCard.propTypes = {
  vendor: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    vendorInfo: PropTypes.shape({
      businessName: PropTypes.string.isRequired,
    }).isRequired,
    documents: PropTypes.shape({
      shopPhoto: PropTypes.arrayOf(PropTypes.string),
    }),
    location: PropTypes.shape({
      // Added location to prop types
      coordinates: PropTypes.arrayOf(PropTypes.number),
    }),
    isOnline: PropTypes.bool,
  }).isRequired,
  userLocation: PropTypes.object, // Changed from distance
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
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
    height: 180,
    backgroundColor: '#ecf0f1',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  offlineOverlay: {
    backgroundColor: 'rgba(255,255,255,0.8)', // Heavy white overlay to simulate "faded/disabled" look
    // Or use black if preferred: 'rgba(0,0,0,0.6)'
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
    padding: 12,
  },
  vendorName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f3f5',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  viewDetailsText: {
    fontSize: 14,
    color: '#ff6600',
    fontWeight: '600',
    marginRight: 4,
  },
});

export default VendorCard;
