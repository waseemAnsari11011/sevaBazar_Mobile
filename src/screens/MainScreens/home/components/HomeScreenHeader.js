import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
const HomeScreenHeader = () => {
  return null;
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
