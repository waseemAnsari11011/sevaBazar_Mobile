import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { useSelector } from 'react-redux';

const windowWidth = Dimensions.get('window').width;
const FALLBACK_IMAGE_URL = 'https://placehold.co/150x150/EEE/31343C?text=Photo';

import Icon from '../../../../components/Icons/Icon';

const CarouselItem = React.memo(({ item, navigation, width }) => {
  const imageUrl =
    item?.documents?.shopPhoto?.length > 0
      ? item.documents.shopPhoto[0]
      : FALLBACK_IMAGE_URL;

  const isOnline = item.isOnline;

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('VendorDetails', { vendorId: item._id })
      }
      style={[
        styles.vendorContainer,
        { width: width },
        !isOnline && { backgroundColor: '#f5f5f5' },
      ]}
      activeOpacity={0.9}
      disabled={!isOnline}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: imageUrl }} style={styles.vendorImage} />
        {!isOnline && <View style={styles.offlineOverlay} />}
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: isOnline ? '#108915' : '#555' },
          ]}>
          {!isOnline && (
            <Text style={styles.statusText}>Closed</Text>
          )}
          {isOnline && <View style={styles.statusDot} />}
          {isOnline && <Text style={styles.statusText}>Open</Text>}
        </View>
      </View>

      <View style={styles.contentContainer}>
        <Text
          style={[styles.vendorName, !isOnline && { opacity: 0.6 }]}
          numberOfLines={1}>
          {item.vendorInfo.businessName}
        </Text>

        <View style={[styles.locationRow, !isOnline && { opacity: 0.6 }]}>
          <Icon.Ionicons name="location-sharp" size={12} color="#666" style={{ marginRight: 2 }} />
          <Text style={styles.vendorLocation} numberOfLines={1}>
            {item.location?.address?.addressLine1 || item.location?.address?.city}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const VendorCarousel = React.memo(({ navigation }) => {
  const {
    loading: vendorsLoading,
    vendors,
    error: vendorsError,
  } = useSelector(state => state.recentlyAddedVendors);

  const carouselItemWidth = windowWidth * 0.75; // peeking effect

  const renderItem = React.useCallback(({ item }) => (
    <CarouselItem item={item} navigation={navigation} width={carouselItemWidth} />
  ), [navigation, carouselItemWidth]);

  const keyExtractor = React.useCallback((item) => item._id, []);

  if (vendorsLoading && vendors.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Loading new vendors...</Text>
      </View>
    );
  }

  if (vendorsError) {
    return (
      <View style={styles.container}>
        <Text>Error: {vendorsError}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={vendors}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={carouselItemWidth + 16} // item width + marginRight
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 15 }}
        removeClippedSubviews={true}
        initialNumToRender={3}
      />
    </View>
  );
});

export default VendorCarousel;

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
  },
  vendorContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 5,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  imageWrapper: {
    width: '100%',
    height: 140,
    position: 'relative',
  },
  vendorImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    backgroundColor: '#f0f0f0',
  },
  contentContainer: {
    padding: 12,
  },
  vendorName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vendorLocation: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  offlineOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  statusIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
    marginRight: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});
