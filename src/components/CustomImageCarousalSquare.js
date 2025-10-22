// src/components/CustomImageCarousalSquare.js

import {
  StyleSheet,
  View,
  Image,
  Text,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect, useRef, useMemo} from 'react';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  useAnimatedRef,
} from 'react-native-reanimated';
import ImageViewing from 'react-native-image-viewing';
import Pagination from './Pagination'; // Assuming this component exists

// --- FIX 1: Rename 'data' prop to 'images' and provide a default empty array ---
const CustomImageCarousalSquare = ({images = [], autoPlay, pagination}) => {
  const scrollViewRef = useAnimatedRef(null);
  const interval = useRef();
  const [isAutoPlay, setIsAutoPlay] = useState(autoPlay);
  const [isVisible, setIsVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const {width} = useWindowDimensions();
  const SIZE = width;
  const SPACER = (width - SIZE) / 2;
  const x = useSharedValue(0);
  const offSet = useSharedValue(0);

  // --- FIX 2: Transform the array of strings into an array of objects ---
  // This memoized value converts ['url1', 'url2'] into [{ image: 'url1' }, { image: 'url2' }]
  // so the rest of the component's logic works without changes.
  const formattedImages = useMemo(
    () => images.map(url => ({image: url})),
    [images],
  );

  useEffect(() => {
    if (isAutoPlay && formattedImages.length > 1) {
      let _offSet = offSet.value;
      interval.current = setInterval(() => {
        if (_offSet >= Math.floor(SIZE * (formattedImages.length - 1))) {
          _offSet = 0;
        } else {
          _offSet += SIZE;
        }
        scrollViewRef.current?.scrollTo({x: _offSet, y: 0, animated: true});
      }, 3000); // Increased interval for better user experience
    } else {
      clearInterval(interval.current);
    }
    return () => clearInterval(interval.current);
  }, [SIZE, isAutoPlay, formattedImages.length, offSet.value, scrollViewRef]);

  // Add spacers for the carousel effect
  const newData = useMemo(
    () => [{key: 'spacer-left'}, ...formattedImages, {key: 'spacer-right'}],
    [formattedImages],
  );

  const onScroll = useAnimatedScrollHandler({
    onScroll: event => {
      x.value = event.contentOffset.x;
    },
  });

  // Return a placeholder if there are no images
  if (!images || images.length === 0) {
    return (
      <View style={[styles.imageContainer, styles.placeholder]}>
        <Text style={styles.placeholderText}>No Image</Text>
      </View>
    );
  }

  return (
    <View>
      <Animated.ScrollView
        ref={scrollViewRef}
        onScroll={onScroll}
        onScrollBeginDrag={() => setIsAutoPlay(false)}
        onMomentumScrollEnd={e => {
          offSet.value = e.nativeEvent.contentOffset.x;
          setIsAutoPlay(autoPlay);
        }}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={SIZE}
        horizontal
        bounces={false}
        showsHorizontalScrollIndicator={false}>
        {newData.map((item, index) => {
          // Animated style for scaling effect
          const style = useAnimatedStyle(() => {
            const scale = interpolate(
              x.value,
              [(index - 2) * SIZE, (index - 1) * SIZE, index * SIZE],
              [0.9, 1, 0.9], // Adjusted scale for a subtler effect
            );
            return {transform: [{scale}]};
          });

          // Render spacers
          if (!item.image) {
            return <View style={{width: SPACER}} key={index} />;
          }

          // Render the actual image item
          return (
            <View style={{width: SIZE}} key={index}>
              <Animated.View style={[styles.imageContainer, style]}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    setCurrentImageIndex(index - 1); // Adjust for spacer
                    setIsVisible(true);
                  }}>
                  <Image source={{uri: item.image}} style={styles.image} />
                </TouchableOpacity>
              </Animated.View>
            </View>
          );
        })}
      </Animated.ScrollView>

      {/* Page number indicator */}
      <View style={styles.pageNumberContainer}>
        <Text style={styles.pageNumber}>
          {Math.round(x.value / SIZE) + 1} / {formattedImages.length}
        </Text>
      </View>

      {/* Optional Pagination dots */}
      {pagination && <Pagination data={formattedImages} x={x} size={SIZE} />}

      {/* Full-screen image viewer */}
      <ImageViewing
        images={images.map(url => ({uri: url}))} // ImageViewing expects { uri: '...' }
        imageIndex={currentImageIndex}
        visible={isVisible}
        onRequestClose={() => setIsVisible(false)}
      />
    </View>
  );
};

export default CustomImageCarousalSquare;

const styles = StyleSheet.create({
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 10, // Add some spacing
    backgroundColor: '#f0f0f0', // Background for images
  },
  image: {
    width: '100%',
    aspectRatio: 1, // Make it a perfect square
    resizeMode: 'cover',
  },
  pageNumberContainer: {
    position: 'absolute',
    bottom: 15,
    right: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  pageNumber: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  placeholder: {
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
  },
  placeholderText: {
    color: '#adb5bd',
    fontSize: 16,
  },
});
