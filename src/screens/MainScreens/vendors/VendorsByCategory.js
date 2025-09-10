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

const VendorsByCategory = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const {categoryId, categoryTitle} = route.params;

  const {vendors, loading, error} = useSelector(
    state => state.vendorsByCategory,
  );

  useEffect(() => {
    // 👇 Define an async function inside the useEffect hook
    const loadVendors = async () => {
      if (categoryId) {
        console.log('Fetching vendors for categoryId==>>', categoryId);
        try {
          // Await the dispatch of the async thunk action
          await dispatch(fetchVendorsByCategory(categoryId));
        } catch (e) {
          console.error('Failed to fetch vendors:', e);
        }
      }
    };

    // Call the async function
    loadVendors();

    // Cleanup function to reset the state when the screen unmounts
    return () => {
      dispatch(resetVendorsByCategory());
    };
    // 👇 FIX: Add dispatch and categoryId to the dependency array
  }, [dispatch, categoryId]);

  if (loading) {
    return (
      <SafeScreen>
        <CustomHeader title={categoryTitle} navigation={navigation} />
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </SafeScreen>
    );
  }

  if (error) {
    return (
      <SafeScreen>
        <CustomHeader title={categoryTitle} navigation={navigation} />
        <View style={styles.centeredContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
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
          <View style={styles.centeredContainer}>
            <Text style={styles.emptyText}>
              No vendors found for this category.
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContainer}
      />
    </SafeScreen>
  );
};

const VendorCard = ({vendor, onPress}) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Image
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

const styles = StyleSheet.create({
  listContainer: {
    padding: 15,
    flexGrow: 1, // Ensures the container can grow to fill space
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'red',
  },
});

export default VendorsByCategory;
