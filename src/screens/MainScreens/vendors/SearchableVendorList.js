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
        // You can make the search more comprehensive here if needed
        const businessName =
          vendor.vendorInfo?.businessName?.toLowerCase() || '';
        return businessName.includes(lowercasedQuery);
      });
      setFilteredVendors(newFilteredVendors);
    }
  }, [searchQuery, initialVendors]);

  return (
    <View style={styles.container}>
      {/* Search Bar UI */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Icon
            name="magnify"
            size={22}
            color="#ff6600"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for dukaan..."
            placeholderTextColor="#95a5a6"
            value={searchQuery}
            onChangeText={setSearchQuery} // Directly update the search query state
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}>
              <Icon name="close-circle" size={20} color="#95a5a6" />
            </TouchableOpacity>
          )}
        </View>

        {/* The result count now depends on the filtered list */}
        {!loading && initialVendors.length > 0 && (
          <Text style={styles.resultsCount}>
            {filteredVendors.length}{' '}
            {filteredVendors.length === 1 ? 'vendor' : 'vendors'} found
          </Text>
        )}
      </View>

      {/* The presentational list component receives the filtered data */}
      <VendorsList
        vendors={filteredVendors}
        loading={loading}
        error={error}
        userLocation={userLocation}
        onRetry={onRetry}
        onVendorPress={onVendorPress} // Pass down the handler from the parent
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
};

// Styles remain the same as before
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
    padding: 0,
  },
  clearButton: {
    padding: 4,
  },
  resultsCount: {
    fontSize: 13,
    color: '#7f8c8d',
    marginTop: 8,
    fontWeight: '500',
  },
});

export default SearchableVendorList;
