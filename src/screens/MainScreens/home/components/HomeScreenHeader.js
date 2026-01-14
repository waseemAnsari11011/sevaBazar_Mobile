import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import BannerCarousel from './BannerCarousel';
import CategoryList from './CategoryList';
import DealOfDay from '../DealOfDay';
import VendorCarousel from '../components/VendorCarousel';

import VendorsWithDiscounts from './VendorsWithDiscounts';
import Icon from '../../../../components/Icons/Icon';
// 👇 IMPORT THE NEW COMPONENT
import GroupedVendorSections from './GroupedVendorSections';
import AllVendorList from './AllVendorList';

/**
 * The header component for the HomeScreen's main FlatList.
 * It composes various sections like banners, categories, and vendor showcases.
 */
const HomeScreenHeader = ({
  banners,
  categories,
  vendorsWithDiscounts,
  vendorsWithDiscountsLoading,
  navigation,
  // 👇 RECEIVE THE NEW PROPS
  groupedVendors,
  groupedVendorsLoading,
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
          <Icon.AntDesign name="right" color="#ffffff" size={13} />
        </TouchableOpacity>
      </View>
      <View style={{marginHorizontal: -20, marginBottom: 15}}>
        <VendorCarousel navigation={navigation} />
      </View>

      {/* Vendors with discounts Section */}
      <VendorsWithDiscounts
        vendors={vendorsWithDiscounts}
        loading={vendorsWithDiscountsLoading}
        navigation={navigation}
      />

      {/* 👇 RENDER THE NEW COMPONENT HERE */}
      <GroupedVendorSections
        groupedVendors={groupedVendors}
        loading={groupedVendorsLoading}
      />

      {/*All Dukaans Section */}
      <View style={styles.header}>
        <Text style={styles.title}>All Dukaans</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('New Dukaans')}
          style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View all</Text>
          <Icon.AntDesign name="right" color="#ffffff" size={13} />
        </TouchableOpacity>
      </View>
      <View>
        <AllVendorList navigation={navigation} />
      </View>


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

export default HomeScreenHeader;
