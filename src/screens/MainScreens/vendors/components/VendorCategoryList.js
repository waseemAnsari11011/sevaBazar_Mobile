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
  const numColumns = Math.ceil(categories.length / 2);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore Categories</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        style={styles.scrollView}>
        <FlatList
          contentContainerStyle={{alignSelf: 'flex-start'}}
          numColumns={numColumns}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={categories}
          scrollEnabled={false} // Parent ScrollView handles scrolling
          key={numColumns} // Force re-render if columns change
          keyExtractor={(item) => item._id}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => handleNavigateToCategory(item)}>
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
        />
      </ScrollView>
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
  scrollView: {
    marginHorizontal: -16,
  },
  scrollViewContent: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 16, // Increased spacing between items
    maxWidth: 80, // Constrain width for text wrapping
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
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  categoryName: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: '500',
    color: '#34495e',
    textAlign: 'center',
  },
});

export default VendorCategoryList;
