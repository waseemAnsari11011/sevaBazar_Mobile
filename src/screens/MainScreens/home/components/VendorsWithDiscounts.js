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
const VendorCard = ({item, navigation}) => {
  const imageUrl = item.documents?.shopPhoto?.[0] || VENDOR_PLACEHOLDER_IMAGE;

  const isOnline = item.isOnline;
  
  return (
    <TouchableOpacity
      style={[
        styles.cardContainer,
        !isOnline && {backgroundColor: '#f5f5f5'},
      ]}
      disabled={!isOnline}
      onPress={() =>
        navigation.navigate('VendorDetails', {vendorId: item._id})
      }>
      <View style={{position: 'relative'}}>
        <Image source={{uri: imageUrl}} style={styles.image} />
        {!isOnline && <View style={styles.offlineOverlay} />}
        <View
          style={[
            styles.statusIndicator,
            {backgroundColor: isOnline ? 'green' : '#2c3e50'},
          ]}>
          {!isOnline && <Icon.MaterialCommunityIcons name="lock" size={10} color="#fff" />}
          {isOnline && <View style={styles.statusDot} />}
        </View>
      </View>
      <View style={styles.discountBadge}>
        <Text style={styles.discountText}>UPTO {item.maxDiscount}% OFF</Text>
      </View>
      <View style={[styles.infoContainer, !isOnline && {opacity: 0.5}]}>
        <Text style={styles.vendorName} numberOfLines={1}>
          {item.vendorInfo?.businessName || item.name}
        </Text>
        <Text style={styles.vendorCity} numberOfLines={1}>
          {item.location?.address?.city}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

/**
 * A 2x2 grid component to display the top 4 vendors offering discounts.
 */
const VendorsWithDiscounts = ({vendors, loading, navigation}) => {
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
          <Icon.AntDesign name="right" color="#000066" size={13} />
        </TouchableOpacity>
      </View>

      {/* Grid */}
      {loading ? (
        <ActivityIndicator size="large" color="#000066" style={{height: 160}} />
      ) : (
        <FlatList
          data={gridVendors}
          renderItem={({item}) => (
            <VendorCard item={item} navigation={navigation} />
          )}
          keyExtractor={item => item._id}
          numColumns={2} // Arrange items in 2 columns
          scrollEnabled={false} // Disable scrolling for the grid
          columnWrapperStyle={{justifyContent: 'space-between'}} // Add space between columns
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    color: '#000066',
    marginRight: 5,
    fontSize: 15,
    fontWeight: '600',
  },
  cardContainer: {
    flex: 1,
    maxWidth: '48%', // Ensures a gap between the two columns
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  image: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FF4136',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  infoContainer: {
    padding: 8,
  },
  vendorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  vendorCity: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  offlineOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
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
