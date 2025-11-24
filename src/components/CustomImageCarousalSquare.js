// src/components/CustomImageCarousalSquare.js

import {
  StyleSheet,
  View,
  Image,
  Text,
  useWindowDimensions,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  StatusBar,
  Platform,
} from 'react-native';
import React, {useState, useEffect, useRef, useMemo, useCallback} from 'react';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  useAnimatedRef,
  runOnJS,
} from 'react-native-reanimated';
import ImageViewing from 'react-native-image-viewing';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Pagination from './Pagination';

// Helper function to determine if URL is a video
const isVideoUrl = url => {
  if (!url) return false;
  const videoExtensions = [
    '.mp4',
    '.mov',
    '.avi',
    '.webm',
    '.mkv',
    '.m4v',
    '.3gp',
  ];
  const lowercaseUrl = url.toLowerCase();
  return videoExtensions.some(ext => lowercaseUrl.includes(ext));
};

// Video Player Component for fullscreen
const VideoPlayer = ({visible, videoUrl, onClose}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef(null);
  const controlsTimeout = useRef(null);

  useEffect(() => {
    if (visible) {
      setIsPlaying(true);
      setShowControls(true);
      hideControlsAfterDelay();
    }
    return () => {
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
    };
  }, [visible]);

  const hideControlsAfterDelay = () => {
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
    controlsTimeout.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const toggleControls = () => {
    setShowControls(!showControls);
    if (!showControls) {
      hideControlsAfterDelay();
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    hideControlsAfterDelay();
  };

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent>
      <StatusBar hidden />
      <View style={styles.videoModalContainer}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.videoWrapper}
          onPress={toggleControls}>
          <Video
            ref={videoRef}
            source={{uri: videoUrl}}
            style={styles.fullscreenVideo}
            resizeMode="contain"
            paused={!isPlaying}
            onLoad={data => {
              setDuration(data.duration);
              setIsLoading(false);
            }}
            onProgress={data => {
              setCurrentTime(data.currentTime);
            }}
            onEnd={() => setIsPlaying(false)}
            repeat={false}
          />

          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}

          {showControls && (
            <View style={styles.videoControls}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Icon name="close" size={30} color="#fff" />
              </TouchableOpacity>

              <View style={styles.playPauseContainer}>
                <TouchableOpacity
                  onPress={togglePlayPause}
                  style={styles.playPauseButton}>
                  <Icon
                    name={isPlaying ? 'pause' : 'play-arrow'}
                    size={50}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </Text>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

// Main Carousel Component
const CustomImageCarousalSquare = ({images = [], autoPlay, pagination}) => {
  const scrollViewRef = useAnimatedRef(null);
  const interval = useRef();
  const [isAutoPlay, setIsAutoPlay] = useState(autoPlay);
  const [isVisible, setIsVisible] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [currentVisibleIndex, setCurrentVisibleIndex] = useState(0);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
  const {width} = useWindowDimensions();
  const SIZE = width;
  const SPACER = (width - SIZE) / 2;
  const x = useSharedValue(0);
  const offSet = useSharedValue(0);

  // Transform URLs into media objects with type information
  const formattedMedia = useMemo(
    () =>
      images.map(url => ({
        url: url,
        type: isVideoUrl(url) ? 'video' : 'image',
      })),
    [images],
  );

  // Track current visible index for video playback control
  const updateVisibleIndex = useCallback(
    scrollX => {
      const index = Math.round(scrollX / SIZE);
      setCurrentVisibleIndex(index);
    },
    [SIZE],
  );

  useEffect(() => {
    if (isAutoPlay && formattedMedia.length > 1) {
      let _offSet = offSet.value;
      interval.current = setInterval(() => {
        if (_offSet >= Math.floor(SIZE * (formattedMedia.length - 1))) {
          _offSet = 0;
        } else {
          _offSet += SIZE;
        }
        scrollViewRef.current?.scrollTo({x: _offSet, y: 0, animated: true});
      }, 4000);
    } else {
      clearInterval(interval.current);
    }
    return () => clearInterval(interval.current);
  }, [SIZE, isAutoPlay, formattedMedia.length, offSet.value, scrollViewRef]);

  // Add spacers for carousel effect
  const newData = useMemo(
    () => [{key: 'spacer-left'}, ...formattedMedia, {key: 'spacer-right'}],
    [formattedMedia],
  );

  const onScroll = useAnimatedScrollHandler({
    onScroll: event => {
      x.value = event.contentOffset.x;
      runOnJS(updateVisibleIndex)(event.contentOffset.x);
    },
  });

  // Handle media item press
  const handleMediaPress = (item, index) => {
    if (item.type === 'video') {
      setSelectedVideoUrl(item.url);
      setVideoModalVisible(true);
    } else {
      setCurrentMediaIndex(index);
      setIsVisible(true);
    }
  };

  // Return placeholder if no media
  if (!images || images.length === 0) {
    return (
      <View style={[styles.imageContainer, styles.placeholder]}>
        <Text style={styles.placeholderText}>No Media</Text>
      </View>
    );
  }

  // Filter only images for ImageViewing component
  const imageOnlyData = formattedMedia
    .map((item, index) =>
      item.type === 'image' ? {uri: item.url, originalIndex: index} : null,
    )
    .filter(Boolean);

  const currentImageIndex = formattedMedia
    .slice(0, currentMediaIndex)
    .filter(item => item.type === 'image').length;

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
              [0.9, 1, 0.9],
            );
            return {transform: [{scale}]};
          });

          // Render spacers
          if (!item.url) {
            return <View style={{width: SPACER}} key={index} />;
          }

          const actualIndex = index - 1; // Adjust for left spacer
          const isCurrentlyVisible = actualIndex === currentVisibleIndex;

          // Render media item
          return (
            <View style={{width: SIZE}} key={index}>
              <Animated.View style={[styles.imageContainer, style]}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => handleMediaPress(item, actualIndex)}>
                  {item.type === 'video' ? (
                    <View style={styles.videoContainer}>
                      <Video
                        source={{uri: item.url}}
                        style={styles.image}
                        resizeMode="cover"
                        paused={!isCurrentlyVisible || !isAutoPlay}
                        muted={true}
                        repeat={true}
                        onError={error => console.log('Video error:', error)}
                      />
                      <View style={styles.videoOverlay}>
                        <Icon
                          name="play-circle-outline"
                          size={50}
                          color="#fff"
                        />
                      </View>
                      <View style={styles.videoIndicator}>
                        <Icon name="videocam" size={20} color="#fff" />
                      </View>
                    </View>
                  ) : (
                    <Image source={{uri: item.url}} style={styles.image} />
                  )}
                </TouchableOpacity>
              </Animated.View>
            </View>
          );
        })}
      </Animated.ScrollView>

      {/* Page number indicator */}
      <View style={styles.pageNumberContainer}>
        <Text style={styles.pageNumber}>
          {Math.round(x.value / SIZE) + 1} / {formattedMedia.length}
        </Text>
      </View>

      {/* Optional Pagination dots */}
      {pagination && <Pagination data={formattedMedia} x={x} size={SIZE} />}

      {/* Full-screen image viewer */}
      <ImageViewing
        images={imageOnlyData.map(item => ({uri: item.uri}))}
        imageIndex={currentImageIndex}
        visible={isVisible}
        onRequestClose={() => setIsVisible(false)}
      />

      {/* Full-screen video player */}
      <VideoPlayer
        visible={videoModalVisible}
        videoUrl={selectedVideoUrl}
        onClose={() => {
          setVideoModalVisible(false);
          setSelectedVideoUrl(null);
        }}
      />
    </View>
  );
};

export default CustomImageCarousalSquare;

const styles = StyleSheet.create({
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 10,
    backgroundColor: '#f0f0f0',
    // --- BORDER ADDED HERE ---
    borderWidth: 1.5,
    borderColor: 'grey', // Light gray color
    // -------------------------
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    resizeMode: 'cover',
  },
  videoContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  videoIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    padding: 5,
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
  // Video Player Modal Styles
  videoModalContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoWrapper: {
    flex: 1,
    width: '100%',
  },
  fullscreenVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  videoControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    right: 20,
    padding: 10,
    zIndex: 1,
  },
  playPauseContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playPauseButton: {
    padding: 20,
  },
  timeContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  timeText: {
    color: '#fff',
    fontSize: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
});
