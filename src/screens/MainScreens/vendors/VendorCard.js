import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const FALLBACK_IMAGE_URL =
  'https://placehold.co/600x400/EEE/31343C?text=Vendor';

/**
 * Calculates the distance between two geographical coordinates.
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

  const isVendorOnline = vendor.isOnline;

  return (
    <TouchableOpacity
      style={[styles.card, !isVendorOnline && {backgroundColor: '#f5f5f5'}]}
      onPress={onPress}
      activeOpacity={0.8} // Higher opacity for a solid feel
      disabled={!isVendorOnline}>
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image source={{uri: imageUrl}} style={styles.vendorImage} />
        <View
          style={[
            styles.imageOverlay,
            !isVendorOnline && styles.offlineOverlay,
          ]}
        />
        {/* Status Badge - Top Right */}
        <View
          style={[
            styles.statusIndicator,
            {backgroundColor: isVendorOnline ? '#108915' : '#555'}, // Darker green like the image
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

      {/* Content Section */}
      <View style={[styles.cardContent, !isVendorOnline && {opacity: 0.6}]}>
        {/* Business Name - Uppercase & Bold */}
        <Text style={styles.businessName} numberOfLines={1}>
          {vendor.vendorInfo?.businessName?.toUpperCase() ||
            vendor.name?.toUpperCase()}
        </Text>

        {/* Address info if needed, kept subtle */}
        <Text style={styles.addressText} numberOfLines={1}>
          {vendor.location?.address?.city ||
            vendor.location?.address?.addressLine1}
        </Text>

        {/* Footer: Distance on Left, Details on Right */}
        <View style={styles.footerRow}>
          <View style={styles.distanceContainer}>
            {distance && (
              <>
                <Icon name="map-marker-distance" size={16} color="#7f8c8d" />
                <Text style={styles.distanceText}>{distance}</Text>
              </>
            )}
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.detailsText}>Details</Text>
            <Icon name="chevron-right" size={20} color="#e67e22" />
          </View>
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
      coordinates: PropTypes.arrayOf(PropTypes.number),
      address: PropTypes.shape({
        city: PropTypes.string,
        addressLine1: PropTypes.string,
      }),
    }),
    isOnline: PropTypes.bool,
  }).isRequired,
  userLocation: PropTypes.object,
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    // marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 12, // Matches the rounded look in image
    elevation: 4, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  imageContainer: {
    position: 'relative',
  },
  vendorImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
    backgroundColor: '#ecf0f1',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  offlineOverlay: {
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  statusIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
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
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  cardContent: {
    padding: 16,
    paddingBottom: 12,
  },
  businessName: {
    fontSize: 18,
    fontWeight: '800', // Extra bold
    color: '#2c3e50',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  addressText: {
    fontSize: 13,
    color: '#95a5a6',
    marginBottom: 12,
  },
  // New Footer Styles
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // This pushes Distance to left, Details to right
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f3f5',
    paddingTop: 12,
    marginTop: 4,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#34495e',
    fontWeight: '500',
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsText: {
    fontSize: 15,
    color: '#e67e22', // The Orange color from the "Details >" text
    fontWeight: '700',
    marginRight: 2,
  },
});

export default VendorCard;
