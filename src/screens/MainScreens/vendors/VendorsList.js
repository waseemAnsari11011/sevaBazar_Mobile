import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import VendorCard from './VendorCard';

// Removed getDistance function from here

/**
 * A generic component to render a list of vendors.
 * Handles loading, error, and empty states.
 */
const VendorsList = ({
  vendors,
  loading,
  error,
  onRetry,
  onVendorPress,
  userLocation,
}) => {
  if (loading && vendors.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#ff6600" />
        <Text style={styles.loadingText}>Finding vendors...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Icon name="alert-circle-outline" size={64} color="#e74c3c" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={vendors}
      keyExtractor={item => item._id}
      numColumns={1}
      renderItem={({item}) => {
        // All distance logic is removed from here
        return (
          <VendorCard
            vendor={item}
            userLocation={userLocation} // Pass userLocation directly
            onPress={() => onVendorPress(item)}
          />
        );
      }}
      ListEmptyComponent={
        !loading && (
          <View style={styles.centeredContainer}>
            <Icon name="store-search-outline" size={80} color="#bdc3c7" />
            <Text style={styles.emptyText}>No vendors found</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your search or check back later
            </Text>
          </View>
        )
      }
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );
};

VendorsList.propTypes = {
  vendors: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  onRetry: PropTypes.func.isRequired,
  onVendorPress: PropTypes.func.isRequired,
  userLocation: PropTypes.object,
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 8,
    paddingTop: 8,
    flexGrow: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#2c3e50',
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    textAlign: 'center',
    fontSize: 14,
    color: '#95a5a6',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#e74c3c',
    marginTop: 16,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#ff6600',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default VendorsList;
