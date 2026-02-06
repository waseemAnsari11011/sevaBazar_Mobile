import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from '../../../../components/Icons/Icon';

const VENDOR_PLACEHOLDER_IMAGE = 'https://via.placeholder.com/150';

/**
 * Renders a single vendor card for the grid.
 */
const VendorCard = React.memo(({ item, navigation }) => {
  const imageUrl = item.documents?.shopPhoto?.[0] || VENDOR_PLACEHOLDER_IMAGE;

  const isOnline = item.isOnline;

  return (
    <TouchableOpacity
      style={[
        styles.cardContainer,
        !isOnline && { backgroundColor: '#f5f5f5' },
      ]}
      disabled={!isOnline}
      activeOpacity={0.9}
      onPress={() =>
        navigation.navigate('VendorDetails', { vendorId: item._id })
      }>
      <View style={{ position: 'relative' }}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        {!isOnline && <View style={styles.offlineOverlay} />}
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: isOnline ? '#108915' : '#555' },
          ]}>
          {!isOnline && <Icon.MaterialCommunityIcons name="lock" size={10} color="#fff" />}
          {isOnline && <View style={styles.statusDot} />}
        </View>
      </View>
      <View style={styles.discountBadge}>
        <Text style={styles.discountText}>{item.maxDiscount}% OFF</Text>
      </View>
      <View style={[styles.infoContainer, !isOnline && { opacity: 0.6 }]}>
        <Text style={styles.vendorName} numberOfLines={1}>
          {item.vendorInfo?.businessName || item.name}
        </Text>
        <View style={styles.locationRow}>
          <Icon.Ionicons name="location-sharp" size={10} color="#7f8c8d" style={{ marginRight: 2 }} />
          <Text style={styles.vendorCity} numberOfLines={1}>
            {item.location?.address?.addressLine1 || item.location?.address?.city}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

/**
 * A 2x2 grid component to display the top 4 vendors offering discounts.
 */
const VendorsWithDiscounts = React.memo(({ vendors, loading, navigation }) => {
  if (!loading && (!vendors || vendors.length === 0)) {
    return null;
  }

  // Slice the array to only get the first 4 vendors for the grid
  const gridVendors = vendors.slice(0, 4);

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Top Deals from Dukaans</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Top Deals from Dukaans')}
          style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View all</Text>
          <Icon.AntDesign name="right" color="#ffffff" size={13} />
        </TouchableOpacity>
      </View>

      {/* Grid */}
      {loading ? (
        <ActivityIndicator size="large" color="#000066" style={{ height: 160 }} />
      ) : (
        <View style={styles.gridContainer}>
          {/* Render cards in rows of 2 to mirror numColumns={2} behavior */}
          {Array.from({ length: Math.ceil(gridVendors.length / 2) }).map((_, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.row}>
              {gridVendors.slice(rowIndex * 2, rowIndex * 2 + 2).map((item) => (
                <VendorCard key={item._id} item={item} navigation={navigation} />
              ))}
              {/* Add an empty placeholder if the row has only 1 item to preserve spacing */}
              {gridVendors.slice(rowIndex * 2, rowIndex * 2 + 2).length === 1 && (
                <View style={{ flex: 1, maxWidth: '48.5%' }} />
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  gridContainer: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000066',
    borderWidth: 1,
    borderColor: '#000066',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
  },
  viewAllText: {
    color: '#ffffff',
    marginRight: 2,
    fontSize: 12,
    fontWeight: '600',
  },
  cardContainer: {
    width: '48.5%', // Precise width for 2 columns
    marginBottom: 15,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FF4136',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  infoContainer: {
    padding: 10,
  },
  vendorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vendorCity: {
    fontSize: 11,
    color: '#7f8c8d',
    flex: 1,
  },
  offlineOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  statusIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
});

export default VendorsWithDiscounts;
