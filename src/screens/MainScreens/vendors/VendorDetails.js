// src/screens/MainScreens/vendors/VendorDetails.js

import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import SafeScreen from '../../../components/SafeScreen';
import CustomHeader from '../../../components/CustomHeader';
import {
  fetchVendorDetails,
  resetVendorDetails,
} from '../../../config/redux/actions/vendorActions';
import {fetchProductsByVendor} from '../../../config/redux/actions/productAction';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProductCard from '../../../components/ProductCard';

const FALLBACK_IMAGE_URL =
  'https://placehold.co/600x400/EEE/31343C?text=Vendor';
const {width: SCREEN_WIDTH} = Dimensions.get('window');
const IMAGE_HEIGHT = 200;
const AUTO_SCROLL_INTERVAL = 3000; // 3 seconds

const VendorDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const {vendorId} = route.params;

  const {vendor, loading, error} = useSelector(state => state.vendors.details);
  const {products, loading: productsLoading} = useSelector(
    state => state.productsByVendor,
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (vendorId) {
      dispatch(fetchVendorDetails(vendorId));
      dispatch(fetchProductsByVendor(vendorId));
    }

    return () => {
      dispatch(resetVendorDetails());
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [dispatch, vendorId]);

  // ✅ FIX: Proper auto-scroll with fresh reference to images
  useEffect(() => {
    const images = vendor?.documents?.shopPhoto || [];

    if (images.length > 1) {
      // Clear any previous interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      let currentIndex = 0;
      intervalRef.current = setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        setActiveIndex(currentIndex);

        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({
            x: currentIndex * SCREEN_WIDTH,
            animated: true,
          });
        }
      }, AUTO_SCROLL_INTERVAL);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [vendor?.documents?.shopPhoto]);

  const onScrollEnd = event => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  const renderImageSlider = () => {
    const images =
      vendor?.documents?.shopPhoto?.length > 0
        ? vendor.documents.shopPhoto
        : [FALLBACK_IMAGE_URL];

    return (
      <View style={styles.sliderContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onScrollEnd}
          scrollEventThrottle={16}>
          {images.map((imageUrl, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image
                source={{uri: imageUrl}}
                style={styles.vendorImage}
                resizeMode="cover"
              />
            </View>
          ))}
        </ScrollView>

        {images.length > 1 && (
          <View style={styles.paginationContainer}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  activeIndex === index && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderHeader = () => {
    if (!vendor) return null;

    return (
      <View>
        {renderImageSlider()}
        <View style={styles.vendorInfoContainer}>
          <Text style={styles.vendorName}>
            {vendor.vendorInfo?.businessName}
          </Text>
          <View style={styles.addressContainer}>
            <Icon name="map-marker" size={16} color="#7f8c8d" />
            <Text style={styles.vendorAddress}>
              {vendor.location?.address?.addressLine1 ||
                'Address not available'}
            </Text>
          </View>
        </View>
        <View style={styles.separator} />
        <Text style={styles.productsHeader}>Products</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeScreen style={styles.screen}>
        <CustomHeader title={'Vendor Details'} navigation={navigation} />
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color="#ff6600" />
        </View>
      </SafeScreen>
    );
  }

  if (error) {
    return (
      <SafeScreen style={styles.screen}>
        <CustomHeader title={'Vendor Details'} navigation={navigation} />
        <View style={styles.centeredContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen style={styles.screen}>
      <CustomHeader title={'Vendor Details'} navigation={navigation} />
      <FlatList
        data={products}
        keyExtractor={item => item._id}
        ListHeaderComponent={renderHeader}
        numColumns={2}
        renderItem={({item}) => (
          <View style={styles.productCardContainer}>
            <ProductCard item={item} navigation={navigation} />
          </View>
        )}
        ListEmptyComponent={
          !productsLoading && (
            <View style={styles.centeredContainer}>
              <Text style={styles.emptyText}>
                No products found for this vendor.
              </Text>
            </View>
          )
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#f8f9fa',
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  sliderContainer: {
    height: IMAGE_HEIGHT,
    width: SCREEN_WIDTH,
  },
  imageWrapper: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
  },
  vendorImage: {
    width: '100%',
    height: '100%',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#fff',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  vendorInfoContainer: {
    padding: 16,
  },
  vendorName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  vendorAddress: {
    fontSize: 14,
    color: '#7f8c8d',
    marginLeft: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#ecf0f1',
    marginHorizontal: 16,
  },
  productsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    padding: 16,
  },
  listContainer: {
    paddingHorizontal: 5,
    paddingBottom: 20,
  },
  productCardContainer: {
    flex: 1 / 2,
    padding: 5,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#95a5a6',
    marginTop: 20,
  },
});

export default VendorDetails;
