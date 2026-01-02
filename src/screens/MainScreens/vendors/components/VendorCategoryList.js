import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const VendorCategoryList = ({categories, vendorId}) => {
  const navigation = useNavigation();

  const handleNavigateToCategory = item => {
    navigation.navigate('VendorCategoryProducts', {
      categoryId: item._id,
      categoryName: item.name,
      vendorId: vendorId,
    });
  };

  if (!categories || categories.length === 0) {
    return null;
  }

  // Calculate numColumns to create a grid-like horizontal scroll if many items
  // Similar to the "Explore Dukaans" logic
  const numColumns = categories.length === 2 ? 2 : Math.ceil(categories.length / 2);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore Categories</Text>
      </View>
      <FlatList
        key={4} // Fixed key for 4 columns
        data={categories}
        numColumns={4}
        scrollEnabled={false} // Disable scrolling as it's nested
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => handleNavigateToCategory(item)} style={styles.itemContainer}>
            <View style={styles.categoryItem}>
              <View style={styles.imageContainer}>
                <Image 
                  source={{uri: item?.images?.[0] || 'https://placehold.co/100x100'}} 
                  style={styles.image} 
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.categoryName} numberOfLines={2}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  columnWrapper: {
    justifyContent: 'flex-start', // Align logic
    marginBottom: 10,
  },
  itemContainer: {
    width: '25%',
    paddingHorizontal: 4,
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryItem: {
    alignItems: 'center',
    width: '100%',
  },
  imageContainer: {
    borderWidth: 1,
    padding: 2,
    borderRadius: 10,
    borderColor: '#ecf0f1',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  image: {
    width: 60, // Consistent with Home screen
    height: 60,
    borderRadius: 8,
  },
  categoryName: {
    marginTop: 5,
    fontSize: 11, // Slightly smaller text
    fontWeight: '500',
    color: '#34495e',
    textAlign: 'center',
    lineHeight: 14,
  },
});

export default VendorCategoryList;
