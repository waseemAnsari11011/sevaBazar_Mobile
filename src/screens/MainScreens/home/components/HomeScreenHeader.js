import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import BannerCarousel from './BannerCarousel';
import CategoryList from './CategoryList';
import DealOfDay from '../DealOfDay';
import ProductCarousel from '../ProductCarousel';
import VendorCarousel from '../components/VendorCarousel'; // 👈 Import new component
import ProductSection from './ProductSection';
import AllCategoryProducts from '../../../../components/AllCategoryProducts';
import Icon from '../../../../components/Icons/Icon';

/**
 * The header component for the HomeScreen's main FlatList.
 * It composes various sections like banners, categories, and product showcases.
 */
const HomeScreenHeader = ({
  banners,
  categories,
  onDiscountProducts,
  allCategoryProducts,
  navigation,
}) => {
  return (
    <View>
      <BannerCarousel banners={banners} />
      <CategoryList categories={categories} navigation={navigation} />

      <View style={{marginBottom: 15}}>
        <DealOfDay navigation={navigation} />
      </View>

      {/* Recently added Section */}
      <View style={styles.header}>
        <Text style={styles.title}>New Dukaan</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('New Dukaans')}
          style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View all</Text>
          <Icon.AntDesign name="right" color="#000066" size={13} />
        </TouchableOpacity>
      </View>
      <View style={{marginHorizontal: -20, marginBottom: 15}}>
        <VendorCarousel navigation={navigation} />
      </View>

      {/* On Sale Section */}
      {/* <ProductSection
        title="On Sale"
        products={onDiscountProducts}
        navigation={navigation}
        navigateToScreen="Discounted Products"
      /> */}

      {/* <AllCategoryProducts allCategoryProducts={allCategoryProducts} /> */}

      {/* All Products Title */}
      {/* <View style={styles.header}>
        <Text style={styles.title}>All Products</Text>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginVertical: 5,
    color: '#000000',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    color: '#000066',
    marginRight: 5,
    fontSize: 15,
    fontWeight: '600',
  },
});

export default HomeScreenHeader;
