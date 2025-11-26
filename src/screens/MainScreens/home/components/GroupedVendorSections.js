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
import {useNavigation} from '@react-navigation/native';

const VENDOR_PLACEHOLDER_IMAGE = 'https://via.placeholder.com/150';

/**
 * Renders a single vendor card.
 * (Re-used from VendorsWithDiscounts, but removed discount badge for general use)
 */
const VendorCard = ({item, navigation}) => {
  const shopPhoto = item.documents?.shopPhoto;
  const imageUrl = Array.isArray(shopPhoto)
    ? shopPhoto[0] // It's an array, get the first item
    : shopPhoto || // It's a string, use it directly
      VENDOR_PLACEHOLDER_IMAGE; // Fallback if it's null/undefined

  const isOnline = item.isOnline;
  
  return (
    <TouchableOpacity
      style={[
        cardStyles.cardContainer,
        !isOnline && {backgroundColor: '#f5f5f5'},
      ]}
      disabled={!isOnline}
      activeOpacity={0.9}
      onPress={() =>
        navigation.navigate('VendorDetails', {vendorId: item._id})
      }>
      <View style={{position: 'relative'}}>
        <Image source={{uri: imageUrl}} style={cardStyles.image} />
        {!isOnline && <View style={cardStyles.offlineOverlay} />}
        <View
          style={[
            cardStyles.statusIndicator,
            {backgroundColor: isOnline ? '#108915' : '#555'},
          ]}>
          {!isOnline && <Icon.MaterialCommunityIcons name="lock" size={10} color="#fff" />}
          {isOnline && <View style={cardStyles.statusDot} />}
        </View>
      </View>
      <View style={[cardStyles.infoContainer, !isOnline && {opacity: 0.6}]}>
        <Text style={cardStyles.vendorName} numberOfLines={1}>
          {item.vendorInfo?.businessName || item.name}
        </Text>
        <View style={cardStyles.locationRow}>
           <Icon.Ionicons name="location-sharp" size={10} color="#7f8c8d" style={{marginRight: 2}} />
           <Text style={cardStyles.vendorCity} numberOfLines={1}>
             {item.location?.address?.addressLine1 || item.location?.address?.city}
           </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

/**
 * Renders a single category section with a grid of 4 vendors.
 */
const VendorCategorySection = ({group}) => {
  const navigation = useNavigation();

  // Skip rendering if the category has no vendors
  if (!group.vendors || group.vendors.length === 0) {
    return null;
  }

  // Per requirement: only show first 4 vendors
  const gridVendors = group.vendors.slice(0, 4);

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{group.category.name}</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('VendorsByCategory', {
              categoryId: group.category._id,
              categoryTitle: group.category.name,
            })
          }
          style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View all</Text>
          <Icon.AntDesign name="right" color="#000066" size={13} />
        </TouchableOpacity>
      </View>

      {/* Grid of 4 vendors */}
      <FlatList
        data={gridVendors}
        renderItem={({item}) => (
          <VendorCard item={item} navigation={navigation} />
        )}
        keyExtractor={item => item._id}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={{justifyContent: 'space-between'}}
      />
    </View>
  );
};

/**
 * Renders the list of all grouped vendor sections.
 */
const GroupedVendorSections = ({groupedVendors, loading}) => {
  if (loading && (!groupedVendors || groupedVendors.length === 0)) {
    return (
      <ActivityIndicator
        size="large"
        color="#000066"
        style={{marginVertical: 20}}
      />
    );
  }

  if (!groupedVendors || groupedVendors.length === 0) {
    return null; // Don't render anything if no data
  }

  return (
    <View>
      {groupedVendors.map(group => (
        <VendorCategorySection key={group.category._id} group={group} />
      ))}
    </View>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
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
  },
  viewAllText: {
    color: '#000066',
    marginRight: 5,
    fontSize: 14,
    fontWeight: '600',
  },
});

// Styles for the re-used VendorCard
const cardStyles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    maxWidth: '48%', // Ensures a gap between the two columns
    marginBottom: 15,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
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

export default GroupedVendorSections;
