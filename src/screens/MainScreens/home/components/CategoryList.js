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
import {useDispatch} from 'react-redux';
import {resetProductsByCategory} from '../../../../config/redux/actions/productsByCategoryActions';
import {baseURL} from '../../../../utils/api';
import Icon from '../../../../components/Icons/Icon';

const CategoryList = ({categories}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleNavigateToVendors = item => {
    navigation.navigate('VendorsByCategory', {
      categoryId: item._id,
      categoryTitle: item.name,
    });
  };

  // Calculate the number of columns based on the categories array length.
  // This will be 0 initially and change when data arrives.
  const numColumns = categories.length === 2 ? 2 : Math.ceil(categories.length / 2);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore Dukaans</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('All Categories', {categoriesData: categories})
          }
          style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View all</Text>
          <Icon.AntDesign name="right" color="#000066" size={13} />
        </TouchableOpacity>
      </View>
      <FlatList
        key={4} // Fixed key for 4 columns
        data={categories}
        numColumns={4}
        scrollEnabled={false} // Disable scrolling as it's nested
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => handleNavigateToVendors(item)} style={styles.itemContainer}>
            <View style={styles.categoryItem}>
              <View style={styles.imageContainer}>
                <Image source={{uri: item?.images[0]}} style={styles.image} />
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
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
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
  columnWrapper: {
    justifyContent: 'flex-start', // Align to start
    marginBottom: 10,
  },
  itemContainer: {
    width: '25%', // Strictly 25% width
    paddingHorizontal: 5, // Gutter
    alignItems: 'center',
  },
  categoryItem: {
    alignItems: 'center',
    width: '100%',
  },
  imageContainer: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
    borderColor: '#e0e0e0', // Lighter border
    backgroundColor: '#fff',
  },
  image: {
    width: 60, // Slightly smaller to fit 4 columns better
    height: 60,
    borderRadius: 5,
    resizeMode: 'contain',
  },
  categoryName: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: '500',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default CategoryList;
