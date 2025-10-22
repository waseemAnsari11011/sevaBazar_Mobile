import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {useSelector} from 'react-redux';

const FALLBACK_IMAGE_URL = 'https://placehold.co/150x150/EEE/31343C?text=Photo';

const VendorCarousel = ({navigation}) => {
  // Select state from the new vendors reducer
  const {
    loading: vendorsLoading,
    vendors,
    error: vendorsError,
  } = useSelector(state => state.recentlyAddedVendors);

  const autoPlay = true;
  const loop = true;
  const pagingEnabled = false;
  const snapEnabled = false;

  // Handle loading or error states if needed
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
      <Carousel
        style={styles.carousel}
        width={300} // Adjust width as needed
        height={210}
        pagingEnabled={pagingEnabled}
        snapEnabled={snapEnabled}
        enabled
        loop={loop}
        autoPlay={autoPlay}
        data={vendors}
        renderItem={({item}) => {
          const imageUrl =
            item?.documents?.shopPhoto?.length > 0
              ? item.documents.shopPhoto[0]
              : FALLBACK_IMAGE_URL;

          return (
            <TouchableOpacity
              // --- FIX IS HERE ---
              // Changed to pass `vendorId` which VendorDetails screen expects
              onPress={() =>
                navigation.navigate('VendorDetails', {vendorId: item._id})
              }
              style={styles.vendorContainer}
              key={item._id}>
              <Image source={{uri: imageUrl}} style={styles.vendorImage} />
              <Text style={styles.vendorName} numberOfLines={1}>
                {item.vendorInfo.businessName}
              </Text>
              <Text style={styles.vendorLocation} numberOfLines={1}>
                {item.location.address.city}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default VendorCarousel;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  carousel: {
    width: '100%',
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vendorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    margin: 10,
    // Add shadow for better appearance
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
    width: 150,
    height: 150,
    resizeMode: 'contain',
    borderRadius: 8, // Optional: round corners
    backgroundColor: '#f0f0f0',
  },
  vendorName: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  vendorLocation: {
    fontSize: 14,
    color: 'gray',
  },
});
