// src/components/VendorDetailsCarousel.js

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
  Pressable,
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
import Slider from '@react-native-community/slider';

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

// Enhanced Video Player Component with improved controls
const VideoPlayer = ({visible, videoUrl, onClose}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeking, setIsSeeking] = useState(false);
  const videoRef = useRef(null);
  const controlsTimeout = useRef(null);

  useEffect(() => {
    if (visible) {
      setIsPlaying(true);
      setShowControls(true);
      setCurrentTime(0);
      setIsLoading(true);
      hideControlsAfterDelay();
    } else {
      // Reset state when modal closes
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setIsLoading(true);
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
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const toggleControls = () => {
    const newShowControls = !showControls;
    setShowControls(newShowControls);
    if (newShowControls && isPlaying) {
      hideControlsAfterDelay();
    }
  };

  const togglePlayPause = () => {
    const newPlayingState = !isPlaying;
    setIsPlaying(newPlayingState);
    setShowControls(true);
    if (newPlayingState) {
      hideControlsAfterDelay();
    } else {
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
    }
  };

  const handleSeek = value => {
    if (videoRef.current) {
      videoRef.current.seek(value);
      setCurrentTime(value);
    }
  };

  const handleSlidingStart = () => {
    setIsSeeking(true);
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
  };

  const handleSlidingComplete = value => {
    setIsSeeking(false);
    handleSeek(value);
    if (isPlaying) {
      hideControlsAfterDelay();
    }
  };

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setShowControls(true);
    setCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.seek(0);
    }
  };

  const handleVideoError = error => {
    console.log('Video error:', error);
    setIsLoading(false);
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
        <Pressable style={styles.videoWrapper} onPress={toggleControls}>
          <Video
            ref={videoRef}
            source={{uri: videoUrl}}
            style={styles.fullscreenVideo}
            resizeMode="contain"
            paused={!isPlaying}
            repeat={false}
            onLoad={data => {
              setDuration(data.duration);
              setIsLoading(false);
            }}
            onProgress={data => {
              if (!isSeeking) {
                setCurrentTime(data.currentTime);
              }
            }}
            onEnd={handleVideoEnd}
            onError={handleVideoError}
            playInBackground={false}
            playWhenInactive={false}
            ignoreSilentSwitch="ignore"
          />

          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.loadingText}>Loading video...</Text>
            </View>
          )}

          {showControls && !isLoading && (
            <View style={styles.videoControls}>
              {/* Close Button */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <Icon name="close" size={30} color="#fff" />
              </TouchableOpacity>

              {/* Center Play/Pause Button */}
              <View style={styles.playPauseContainer}>
                <TouchableOpacity
                  onPress={togglePlayPause}
                  style={styles.playPauseButton}
                  hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
                  <View style={styles.playPauseIconContainer}>
                    <Icon
                      name={isPlaying ? 'pause' : 'play-arrow'}
                      size={60}
                      color="#fff"
                    />
                  </View>
                </TouchableOpacity>
              </View>

              {/* Bottom Controls */}
              <View style={styles.bottomControls}>
                <View style={styles.controlsRow}>
                  <TouchableOpacity
                    onPress={togglePlayPause}
                    style={styles.smallPlayButton}
                    hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                    <Icon
                      name={isPlaying ? 'pause' : 'play-arrow'}
                      size={30}
                      color="#fff"
                    />
                  </TouchableOpacity>

                  <Text style={styles.timeText}>{formatTime(currentTime)}</Text>

                  <View style={styles.sliderContainer}>
                    <Slider
                      style={styles.slider}
                      minimumValue={0}
                      maximumValue={duration}
                      value={currentTime}
                      onValueChange={handleSeek}
                      onSlidingStart={handleSlidingStart}
                      onSlidingComplete={handleSlidingComplete}
                      minimumTrackTintColor="#ff6600"
                      maximumTrackTintColor="#666"
                      thumbTintColor="#ff6600"
                    />
                  </View>

                  <Text style={styles.timeText}>{formatTime(duration)}</Text>
                </View>
              </View>
            </View>
          )}
        </Pressable>
      </View>
    </Modal>
  );
};

// Main Carousel Component
const VendorDetailsCarousel = ({
  images = [],
  autoPlay = false,
  pagination = true,
}) => {
  const scrollViewRef = useAnimatedRef(null);
  const interval = useRef();
  const [isAutoPlay, setIsAutoPlay] = useState(autoPlay);
  const [isVisible, setIsVisible] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [currentVisibleIndex, setCurrentVisibleIndex] = useState(0);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
  const {width} = useWindowDimensions();

  const ITEM_WIDTH = width - 32;
  const ITEM_HEIGHT = 240;

  const x = useSharedValue(0);
  const offSet = useSharedValue(0);

  const formattedMedia = useMemo(
    () =>
      images.map(url => ({
        url: url,
        type: isVideoUrl(url) ? 'video' : 'image',
      })),
    [images],
  );

  const updateVisibleIndex = useCallback(
    scrollX => {
      const index = Math.round(scrollX / ITEM_WIDTH);
      setCurrentVisibleIndex(index);
    },
    [ITEM_WIDTH],
  );

  useEffect(() => {
    if (isAutoPlay && formattedMedia.length > 1) {
      let _offSet = offSet.value;
      interval.current = setInterval(() => {
        if (_offSet >= Math.floor(ITEM_WIDTH * (formattedMedia.length - 1))) {
          _offSet = 0;
        } else {
          _offSet += ITEM_WIDTH;
        }
        scrollViewRef.current?.scrollTo({x: _offSet, y: 0, animated: true});
      }, 4000);
    } else {
      clearInterval(interval.current);
    }
    return () => clearInterval(interval.current);
  }, [
    ITEM_WIDTH,
    isAutoPlay,
    formattedMedia.length,
    offSet.value,
    scrollViewRef,
  ]);

  const onScroll = useAnimatedScrollHandler({
    onScroll: event => {
      x.value = event.contentOffset.x;
      runOnJS(updateVisibleIndex)(event.contentOffset.x);
    },
  });

  const handleMediaPress = (item, index) => {
    if (item.type === 'video') {
      setSelectedVideoUrl(item.url);
      setVideoModalVisible(true);
      setIsAutoPlay(false); // Stop autoplay when video opens
    } else {
      setCurrentMediaIndex(index);
      setIsVisible(true);
      setIsAutoPlay(false); // Stop autoplay when image opens
    }
  };

  const handleVideoClose = () => {
    setVideoModalVisible(false);
    setSelectedVideoUrl(null);
    setIsAutoPlay(autoPlay); // Resume autoplay when video closes
  };

  const handleImageViewerClose = () => {
    setIsVisible(false);
    setIsAutoPlay(autoPlay); // Resume autoplay when image viewer closes
  };

  if (!images || images.length === 0) {
    return (
      <View style={[styles.landscapeContainer, styles.placeholder]}>
        <Text style={styles.placeholderText}>No Media</Text>
      </View>
    );
  }

  const imageOnlyData = formattedMedia
    .map((item, index) =>
      item.type === 'image' ? {uri: item.url, originalIndex: index} : null,
    )
    .filter(Boolean);

  const currentImageIndex = formattedMedia
    .slice(0, currentMediaIndex)
    .filter(item => item.type === 'image').length;

  return (
    <View style={styles.carouselWrapper}>
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
        snapToInterval={ITEM_WIDTH}
        horizontal
        bounces={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {formattedMedia.map((item, index) => {
          const style = useAnimatedStyle(() => {
            const scale = interpolate(
              x.value,
              [
                (index - 1) * ITEM_WIDTH,
                index * ITEM_WIDTH,
                (index + 1) * ITEM_WIDTH,
              ],
              [0.92, 1, 0.92],
            );
            return {transform: [{scale}]};
          });

          const isCurrentlyVisible = index === currentVisibleIndex;

          return (
            <View style={[styles.itemWrapper, {width: ITEM_WIDTH}]} key={index}>
              <Animated.View style={[styles.landscapeContainer, style]}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => handleMediaPress(item, index)}>
                  {item.type === 'video' ? (
                    <View style={styles.videoContainer}>
                      <Video
                        source={{uri: item.url}}
                        style={styles.landscapeMedia}
                        resizeMode="cover"
                        paused={!isCurrentlyVisible || !isAutoPlay}
                        muted={true}
                        repeat={true}
                        onError={error =>
                          console.log('Thumbnail video error:', error)
                        }
                      />
                      <View style={styles.videoOverlay}>
                        <Icon
                          name="play-circle-outline"
                          size={60}
                          color="#fff"
                        />
                      </View>
                      <View style={styles.videoIndicator}>
                        <Icon name="videocam" size={20} color="#fff" />
                      </View>
                    </View>
                  ) : (
                    <Image
                      source={{uri: item.url}}
                      style={styles.landscapeMedia}
                    />
                  )}
                </TouchableOpacity>
              </Animated.View>
            </View>
          );
        })}
      </Animated.ScrollView>

      {pagination && (
        <View style={styles.pageNumberContainer}>
          <Text style={styles.pageNumber}>
            {currentVisibleIndex + 1} / {formattedMedia.length}
          </Text>
        </View>
      )}

      {pagination && formattedMedia.length > 1 && (
        <View style={styles.paginationContainer}>
          {formattedMedia.map((_, index) => {
            const dotStyle = useAnimatedStyle(() => {
              const scrollPosition = x.value / ITEM_WIDTH;
              const distance = Math.abs(scrollPosition - index);
              const opacity = interpolate(distance, [0, 1], [1, 0.3], 'clamp');
              const scale = interpolate(distance, [0, 1], [1.2, 0.8], 'clamp');
              return {
                opacity,
                transform: [{scale}],
              };
            });
            return (
              <Animated.View
                key={`dot-${index}`}
                style={[styles.paginationDot, dotStyle]}
              />
            );
          })}
        </View>
      )}

      <ImageViewing
        images={imageOnlyData.map(item => ({uri: item.uri}))}
        imageIndex={currentImageIndex}
        visible={isVisible}
        onRequestClose={handleImageViewerClose}
      />

      <VideoPlayer
        visible={videoModalVisible}
        videoUrl={selectedVideoUrl}
        onClose={handleVideoClose}
      />
    </View>
  );
};

export default VendorDetailsCarousel;

const styles = StyleSheet.create({
  carouselWrapper: {
    marginVertical: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  itemWrapper: {
    paddingHorizontal: 0,
  },
  landscapeContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    height: 240,
  },
  landscapeMedia: {
    width: '100%',
    height: 240,
    resizeMode: 'cover',
  },
  videoContainer: {
    position: 'relative',
    width: '100%',
    height: 240,
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
    top: 10,
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
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff6600',
    marginHorizontal: 4,
  },
  placeholder: {
    width: '100%',
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    marginHorizontal: 16,
    borderRadius: 12,
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 14,
  },
  videoControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    right: 20,
    padding: 10,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  playPauseContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playPauseButton: {
    padding: 20,
  },
  playPauseIconContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 50,
    padding: 10,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    paddingTop: 20,
    backgroundColor: 'linear-gradient(transparent, rgba(0, 0, 0, 0.7))',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallPlayButton: {
    padding: 5,
    marginRight: 10,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
    minWidth: 40,
    textAlign: 'center',
  },
  sliderContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  slider: {
    flex: 1,
    height: 40,
  },
});
