import React, { useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Loading from '../../../components/Loading';
// import SearchBar from '../../../components/SearchBar'; // Removed
import HomeHeader from './components/HomeHeader'; // Added
// import ProductCard from '../../../components/ProductCard'; // Removed
import { useHomeScreenData } from './hooks/useHomeScreenData';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';
import { useVendorInfiniteScroll } from './hooks/useVendorInfiniteScroll';
import { useSelector } from 'react-redux'; // Added
import HomeScreenHeader from './components/HomeScreenHeader';
import VendorCard from '../vendors/VendorCard';
import VendorsWithDiscounts from './components/VendorsWithDiscounts';
import { VendorCategorySection } from './components/GroupedVendorSections';
import Icon from '../../../components/Icons/Icon';
import BannerCarousel from './components/BannerCarousel';
import CategoryList from './components/CategoryList';
import DealOfDay from './DealOfDay';
import VendorCarousel from './components/VendorCarousel';

const HomeScreen = ({ navigation }) => {
  const flatListRef = useRef(null);

  // Use custom hooks to abstract away logic
  const {
    user,
    categoryLoading,
    categories,
    categoryError,
    banners,
    vendorsWithDiscounts,
    vendorsWithDiscountsLoading,
    groupedVendors,
    groupedVendorsLoading,
  } = useHomeScreenData();

  const { vendors = [], fetchMoreVendors, vendorsLoading } = useVendorInfiniteScroll();

  const { location: userLocation } = useSelector(state => state.location || {});

  // Build the unified data feed for full virtualization
  const combinedData = React.useMemo(() => {
    const feed = [];

    // 1. Banners
    if (banners && banners.length > 0) {
      feed.push({ type: 'BANNERS', id: 'banners-section' });
    }

    // 2. Categories
    if (categories && categories.length > 0) {
      feed.push({ type: 'CATEGORIES', id: 'categories-section' });
    }

    // 3. Deal of Day
    feed.push({ type: 'DEAL_OF_DAY', id: 'deal-of-day-section' });

    // 4. New Dukaans (Recently Added)
    feed.push({ type: 'SECTION_HEADER', id: 'new-dukans-header', title: 'New Dukaan' });
    feed.push({ type: 'NEW_DUKAAN_CAROUSEL', id: 'new-dukan-carousel' });

    // 5. Vendors with Discounts Section
    if (vendorsWithDiscounts && vendorsWithDiscounts.length > 0) {
      feed.push({ type: 'DISCOUNTS', id: 'discounts-section' });
    }

    // 6. Grouped Vendor Sections (Categories)
    if (groupedVendors && groupedVendors.length > 0) {
      groupedVendors.forEach((group) => {
        feed.push({
          type: 'GROUPED_SECTION',
          id: `group-${group.category?._id || 'unknown'}`,
          data: group,
        });
      });
    }

    // 7. All Dukaans Header
    feed.push({ type: 'SECTION_HEADER', id: 'all-vendors-header', title: 'All Dukaans' });

    // 8. All Individual Vendors
    vendors.forEach((vendor) => {
      feed.push({
        type: 'VENDOR',
        id: vendor._id,
        data: vendor,
      });
    });

    return feed;
  }, [banners, categories, vendorsWithDiscounts, groupedVendors, vendors]);

  const renderItem = React.useCallback(({ item }) => {
    switch (item.type) {
      case 'BANNERS':
        return <BannerCarousel banners={banners} />;

      case 'CATEGORIES':
        return (
          <View style={{ paddingHorizontal: 15 }}>
            <CategoryList categories={categories} navigation={navigation} />
          </View>
        );

      case 'DEAL_OF_DAY':
        return (
          <View style={{ marginBottom: 15 }}>
            <DealOfDay navigation={navigation} />
          </View>
        );

      case 'NEW_DUKAAN_CAROUSEL':
        return (
          <View style={{ marginBottom: 15 }}>
            <VendorCarousel navigation={navigation} />
          </View>
        );

      case 'DISCOUNTS':
        return (
          <View style={{ paddingHorizontal: 15 }}>
            <VendorsWithDiscounts
              vendors={vendorsWithDiscounts}
              loading={vendorsWithDiscountsLoading}
              navigation={navigation}
            />
          </View>
        );

      case 'GROUPED_SECTION':
        return (
          <View style={{ paddingHorizontal: 15 }}>
            <VendorCategorySection group={item.data} />
          </View>
        );

      case 'SECTION_HEADER':
        return (
          <View style={[styles.header, { paddingHorizontal: 15 }]}>
            <Text style={styles.title}>{item.title}</Text>
            {item.title !== 'All Dukaans' && (
              <TouchableOpacity
                onPress={() => navigation.navigate('New Dukaans')}
                style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>View all</Text>
                <Icon.AntDesign name="right" color="#ffffff" size={13} />
              </TouchableOpacity>
            )}
          </View>
        );

      case 'VENDOR': {
        const vendor = item.data;
        if (!vendor || !vendor._id) return null;
        return (
          <View style={{ paddingHorizontal: 15 }}>
            <VendorCard
              vendor={vendor}
              userLocation={userLocation}
              onPress={() =>
                navigation.navigate('VendorDetails', { vendorId: vendor._id })
              }
            />
          </View>
        );
      }
      default:
        return null;
    }
  }, [banners, categories, navigation, vendorsWithDiscounts, vendorsWithDiscountsLoading, userLocation]);

  const keyExtractor = React.useCallback((item) => item.id || item._id, []);

  // Handle error state
  if (categoryError) {
    return (
      <View style={styles.centerContainer}>
        <Text>{categoryError}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {categoryLoading && <Loading />}

      <HomeHeader user={user} />

      <FlatList
        ref={flatListRef}
        data={combinedData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onEndReached={fetchMoreVendors}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          vendorsLoading ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="large" color="#000066" />
            </View>
          ) : null
        }
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        windowSize={3}
        removeClippedSubviews={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 60, // Removed padding for custom header
    backgroundColor: '#FFFFFF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  footerLoader: {
    marginVertical: 20,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000066',
    borderWidth: 1,
    borderColor: '#000066',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
  },
  viewAllText: {
    color: '#ffffff',
    marginRight: 2,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default HomeScreen;
