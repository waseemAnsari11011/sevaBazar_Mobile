import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect} from 'react';
import SafeScreen from '../../components/SafeScreen';
import Icon from '../../components/Icons/Icon';
// import CategoryProductsCard from '../../components/CategoryProductsCard'; // Replaced with VendorCard
import {useSelector, useDispatch} from 'react-redux';
import Loading from '../../components/Loading';
import StickyButton from '../../components/stickyBottomCartBtn';
// Import the new vendor actions
import {
  fetchRecentlyAddedVendors,
  updateRecentlyAddedVendorsPage,
  resetRecentlyAddedVendors,
} from '../../config/redux/actions/recentlyAddedVendorsActions';

// New component for displaying vendor info
const VendorCard = ({item, onPressNavigation}) => {
  return (
    <TouchableOpacity
      style={styles.vendorCardContainer}
      onPress={onPressNavigation}>
      <Image
        source={{uri: item.documents?.shopPhoto[0]}}
        style={styles.vendorImage}
        resizeMode="cover"
        // Add a placeholder in case of error
        onError={e => console.log('Failed to load image', e.nativeEvent.error)}
      />
      <View style={styles.vendorInfo}>
        <Text style={styles.vendorName}>{item.vendorInfo?.businessName}</Text>
        <Text style={styles.vendorLocation} numberOfLines={1}>
          {item.location?.address?.city}, {item.location?.address?.state}
        </Text>
        <Text style={styles.vendorCategory} numberOfLines={1}>
          {/* Note: 'category' may need to be populated in your API response to show the name */}
          Category: {item.category?.name || 'N/A'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const RecentlyAddedVendors = ({navigation, route}) => {
  const {cartItems} = useSelector(state => state.cart);
  const {data} = useSelector(state => state?.local);

  const dispatch = useDispatch();

  // Select state from the recentlyAddedVendors reducer
  const {loading, vendors, error, page, limit, reachedEnd} = useSelector(
    state => state.recentlyAddedVendors,
  );

  useEffect(() => {
    // We're using page to fetch, so we depend on it
    if (!reachedEnd && !loading) {
      if (page === 1) {
        // Reset on first page load (in case of re-focus)
        // We do this here instead of a separate effect to ensure page 1 is fetched clean
        dispatch(resetRecentlyAddedVendors());
      }
      dispatch(
        fetchRecentlyAddedVendors(page, limit, data?.user.availableLocalities),
      );
    }
    // Note: 'loading' is removed from deps to prevent potential loops if state updates quickly
  }, [page, dispatch, data?.user.availableLocalities, reachedEnd]);

  // Reset vendor store when leaving the screen
  useEffect(() => {
    return () => {
      dispatch(resetRecentlyAddedVendors());
    };
  }, [dispatch]);

  const fetchMoreVendors = () => {
    if (!loading && !reachedEnd) {
      dispatch(updateRecentlyAddedVendorsPage(page + 1)); // Increment the page number
    }
  };

  if (vendors.length === 0 && loading) {
    // Show a full-screen loader on initial load
    return <Loading />;
  }

  if (vendors.length === 0 && !loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>No Vendors Found</Text>
      </View>
    );
  }

  const renderSeparator = () => <View style={styles.separator} />;

  const renderItem = ({item, index}) => {
    return (
      <View
        style={[
          // Adjust bottom margin for sticky cart button
          index === vendors.length - 1 && cartItems.length > 0
            ? styles.lastItem
            : null,
          // Add margin for last item if cart is empty
          index === vendors.length - 1 && cartItems.length === 0
            ? {marginBottom: 15}
            : null,
          // Add margin for first item
          index === 0 && {marginTop: 15},
        ]}>
        <VendorCard
          item={item}
          onPressNavigation={() =>
            // Navigate to VendorDetails, not product Details
            navigation.navigate('VendorDetails', {vendor: item})
          }
        />
      </View>
    );
  };

  return (
    <>
      <View style={{flex: 1, backgroundColor: '#F0F8FF50'}}>
        <View
          style={{
            flex: 1,
          }}>
          <View style={{paddingHorizontal: 15}}>
            <FlatList
              data={vendors} // Use vendors data
              keyExtractor={(item, index) => item._id.toString() + index} // Use a more stable key
              renderItem={renderItem}
              onEndReached={fetchMoreVendors} // Fetch more vendors
              onEndReachedThreshold={0.5} // Trigger earlier for smoother scroll
              ListFooterComponent={
                loading && vendors.length > 0 ? (
                  <ActivityIndicator size="large" color="#0000ff" />
                ) : null
              } // Show footer loader only when loading more
              ItemSeparatorComponent={({highlighted}) =>
                highlighted ? null : renderSeparator()
              }
            />
          </View>
        </View>
      </View>
      {cartItems.length > 0 && <StickyButton navigation={navigation} />}
    </>
  );
};

export default RecentlyAddedVendors;

const styles = StyleSheet.create({
  separator: {
    marginBottom: 15, // Space between cards
  },
  lastItem: {
    marginBottom: 100, // For sticky cart button
  },
  // Styles for the new VendorCard
  vendorCardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    flexDirection: 'row',
    overflow: 'hidden',
    // Add shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  vendorImage: {
    width: 100,
    height: 100,
    backgroundColor: '#eee', // Placeholder bg color
  },
  vendorInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  vendorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  vendorLocation: {
    fontSize: 14,
    color: 'gray',
    marginTop: 4,
  },
  vendorCategory: {
    fontSize: 13,
    color: '#555',
    marginTop: 4,
  },
});
