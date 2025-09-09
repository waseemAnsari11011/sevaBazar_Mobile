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
import {baseURL} from '../../../utils/api';
import {
  fetchVendorsByCategory,
  resetVendorsByCategory,
} from '../../../config/redux/actions/vendorActions';

// A simple card component to display vendor information
const VendorCard = ({vendor, onPress}) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Image
      // Using a placeholder, you can replace with vendor.profileImage or similar if available
      source={{uri: 'https://placehold.co/600x400/EEE/31343C?text=Vendor'}}
      style={styles.vendorImage}
    />
    <View style={styles.cardContent}>
      <Text style={styles.vendorName}>{vendor.vendorInfo.businessName}</Text>
      <Text style={styles.vendorAddress}>
        {vendor.location?.address?.addressLine1 || 'Address not available'}
      </Text>
    </View>
  </TouchableOpacity>
);

const VendorsByCategory = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const {categoryId, categoryTitle} = route.params;

  // Get the state from the Redux store
  const {vendors, loading, error} = useSelector(
    state => state.vendorsByCategory,
  );

  useEffect(() => {
    // Fetch vendors when the screen mounts
    if (categoryId) {
      dispatch(fetchVendorsByCategory(categoryId));
    }

    // Cleanup function to reset the state when the screen is left
    return () => {
      dispatch(resetVendorsByCategory());
    };
  }, [dispatch, categoryId]);

  // Render a loading indicator while fetching data
  if (loading) {
    return (
      <SafeScreen>
        <CustomHeader title={categoryTitle} navigation={navigation} />
        <ActivityIndicator size="large" style={{flex: 1}} />
      </SafeScreen>
    );
  }

  // Render an error message if the API call fails
  if (error) {
    return (
      <SafeScreen>
        <CustomHeader title={categoryTitle} navigation={navigation} />
        <Text style={styles.emptyText}>{error}</Text>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen>
      <CustomHeader title={categoryTitle} navigation={navigation} />
      <FlatList
        data={vendors}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <VendorCard
            vendor={item}
            onPress={() =>
              console.log(
                'Navigate to vendor details:',
                item.vendorInfo.businessName,
              )
            }
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No vendors found for this category.
          </Text>
        }
        contentContainerStyle={styles.listContainer}
      />
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  vendorImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardContent: {
    padding: 10,
  },
  vendorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  vendorAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
});

export default VendorsByCategory;
