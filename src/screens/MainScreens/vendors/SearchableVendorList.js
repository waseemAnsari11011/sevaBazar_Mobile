// src/screens/MainScreens/vendors/SearchableVendorList.js

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import VendorsList from './VendorsList'; // We still use this for rendering the final list

/**
 * A flexible, controlled component that displays a search bar and filters a
 * provided list of vendors on the client-side.
 * The parent component is responsible for fetching the data.
 */
const SearchableVendorList = ({
  initialVendors,
  loading,
  error,
  onRetry,
  onVendorPress,
  userLocation,
  navigation, // Added navigation prop
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredVendors, setFilteredVendors] = useState(initialVendors);

  // Effect to filter vendors whenever the search query or the initial list changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredVendors(initialVendors);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const newFilteredVendors = initialVendors.filter(vendor => {
        const businessName =
          vendor.vendorInfo?.businessName?.toLowerCase() || '';
        return businessName.includes(lowercasedQuery);
      });
      setFilteredVendors(newFilteredVendors);
    }
  }, [searchQuery, initialVendors]);

  return (
    <View style={styles.container}>
      {/* Header with Back Button and Search Bar */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>

        <View style={styles.searchInputWrapper}>
          <Icon
            name="magnify"
            size={20}
            color="#ff6600"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for dukaan..."
            placeholderTextColor="#95a5a6"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}>
              <Icon name="close-circle" size={18} color="#95a5a6" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.resultsContainer}>
        {!loading && initialVendors.length > 0 && (
            <Text style={styles.resultsCount}>
              {filteredVendors.length}{' '}
              {filteredVendors.length === 1 ? 'vendor' : 'vendors'} found
            </Text>
          )}
      </View>

      <VendorsList
        vendors={filteredVendors}
        loading={loading}
        error={error}
        userLocation={userLocation}
        onRetry={onRetry}
        onVendorPress={onVendorPress}
      />
    </View>
  );
};

SearchableVendorList.propTypes = {
  initialVendors: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  onRetry: PropTypes.func.isRequired,
  onVendorPress: PropTypes.func.isRequired,
  userLocation: PropTypes.object,
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    marginRight: 12,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#2c3e50',
    padding: 0,
  },
  clearButton: {
    padding: 4,
  },
  resultsContainer: {
      paddingHorizontal: 16,
      paddingVertical: 8,
  },
  resultsCount: {
    fontSize: 13,
    color: '#7f8c8d',
    fontWeight: '500',
  },
});

export default SearchableVendorList;
