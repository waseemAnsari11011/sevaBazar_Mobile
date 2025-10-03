// VendorsByCategory.js
import React, {useEffect} from 'react';
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
} from '../../../config/redux/actions/vendorActions';
// 👇 Make sure you have this library installed for icons
// npm install react-native-vector-icons
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// A default image to show if the vendor has no shop photo
const FALLBACK_IMAGE_URL =
  'https://placehold.co/600x400/EEE/31343C?text=Vendor';

const VendorsByCategory = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const {categoryId, categoryTitle} = route.params;

  const {vendors, loading, error} = useSelector(
    state => state.vendorsByCategory,
  );

  useEffect(() => {
    const loadVendors = async () => {
      if (categoryId) {
        try {
          await dispatch(fetchVendorsByCategory(categoryId));
        } catch (e) {
          console.error('Failed to fetch vendors:', e);
        }
      }
    };

    loadVendors();

    return () => {
      dispatch(resetVendorsByCategory());
    };
  }, [dispatch, categoryId]);

  const renderContent = () => {
    if (loading) {
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
        renderItem={({item}) => (
          <VendorCard
            vendor={item}
            onPress={() =>
              // Navigate to a details screen on press
              navigation.navigate('VendorDetails', {vendorId: item._id})
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.centeredContainer}>
            <Icon name="store-search-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>
              No vendors found in this category.
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContainer}
      />
    );
  };

  return (
    <SafeScreen style={styles.screen}>
      <CustomHeader title={categoryTitle} navigation={navigation} />
      {renderContent()}
    </SafeScreen>
  );
};

// Revamped VendorCard component for a better look
const VendorCard = ({vendor, onPress}) => {
  // Correctly get the shop photo or use a fallback
  const imageUrl =
    vendor.documents?.shopPhoto?.length > 0
      ? vendor.documents.shopPhoto[0]
      : FALLBACK_IMAGE_URL;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{uri: imageUrl}} style={styles.vendorImage} />
      {/* Online Status Indicator */}
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
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#f4f6f8', // A light background for the whole screen
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
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
    overflow: 'hidden', // Ensures the image corners are rounded
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
    flexDirection: 'row',
    alignItems: 'center',
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
    flex: 1, // Allows text to shrink if rating is long
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbe6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
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
  },
  vendorAddress: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    flex: 1,
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
