import { StyleSheet, View, Image, Text, useWindowDimensions } from 'react-native';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  useAnimatedRef,
} from 'react-native-reanimated';
import Pagination from './Pagination';
import { baseURL } from '../utils/api';

const CustomImageCarousalSquare = ({ data, autoPlay, pagination }) => {
  const scrollViewRef = useAnimatedRef(null);
  const interval = useRef();
  const [isAutoPlay, setIsAutoPlay] = useState(autoPlay);
  const [currentPage, setCurrentPage] = useState(0);
  const { width } = useWindowDimensions();
  const SIZE = width;
  const SPACER = (width - SIZE) / 2;
  const x = useSharedValue(0);
  const offSet = useSharedValue(0);

  useEffect(() => {
    if (isAutoPlay === true) {
      let _offSet = offSet.value;
      interval.current = setInterval(() => {
        if (_offSet >= Math.floor(SIZE * (data.length - 1))) {
          _offSet = 0;
        } else {
          _offSet += SIZE;
        }
        scrollViewRef.current.scrollTo({ x: _offSet, y: 0, animated: true });
        setCurrentPage(_offSet / SIZE);
      }, 2000);
    } else {
      clearInterval(interval.current);
    }

    return () => clearInterval(interval.current); // Clean up on unmount
  }, [SIZE, isAutoPlay, data.length, offSet.value, scrollViewRef]);

  // Update newData whenever data changes
  const newData = useMemo(() => {
    return [
      { key: 'spacer-left' },
      ...data,
      { key: 'spacer-right' },
    ];
  }, [data]);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      x.value = event.contentOffset.x;
    },
    onMomentumScrollEnd: (event) => {
      const index = Math.round(event.contentOffset.x / SIZE);
      setCurrentPage(index);
    },
  });

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollViewRef}
        onScroll={onScroll}
        onScrollBeginDrag={() => {
          setIsAutoPlay(false);
        }}
        onMomentumScrollEnd={(e) => {
          offSet.value = e.nativeEvent.contentOffset.x;
          setIsAutoPlay(autoPlay);
        }}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={SIZE}
        horizontal
        bounces={false}
        showsHorizontalScrollIndicator={false}
      >
        {newData.map((item, index) => {
          const style = useAnimatedStyle(() => {
            const scale = interpolate(
              x.value,
              [(index - 2) * SIZE, (index - 1) * SIZE, index * SIZE],
              [0.8, 1, 0.8]
            );
            return {
              transform: [{ scale }],
            };
          });
          if (!item.image) {
            return <View style={{ width: SPACER }} key={index} />;
          }
          return (
            <View style={{ width: SIZE }} key={index}>
              <View style={styles.imageContainer}>
                <Animated.View style={[style]}>
                  <Image source={{ uri: `${baseURL}${item.image}` }} style={styles.image} />
                  <Text style={styles.pageNumber}>
                    {index}/{data.length}
                  </Text>
                </Animated.View>
              </View>
            </View>
          );
        })}
      </Animated.ScrollView>
      {pagination && (
        <View style={styles.paginationContainer}>
          <Pagination data={data} x={x} size={SIZE} />
        </View>
      )}
    </View>
  );
};

export default CustomImageCarousalSquare;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  imageContainer: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    resizeMode: 'cover',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 10,
    right: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
});
