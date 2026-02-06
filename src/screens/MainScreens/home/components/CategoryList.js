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
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { resetProductsByCategory } from '../../../../config/redux/actions/productsByCategoryActions';
import { baseURL } from '../../../../utils/api';
import Icon from '../../../../components/Icons/Icon';

const CategoryList = React.memo(({ categories }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleNavigateToVendors = item => {
    navigation.navigate('VendorsByCategory', {
      categoryId: item._id,
      categoryTitle: item.name,
    });
  };

  // Use a fixed 4-column grid for standard display
  const numColumns = 4;

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore Dukaans</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('All Categories', { categoriesData: categories })
          }
          style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View all</Text>
          <Icon.AntDesign name="right" color="#ffffff" size={13} />
        </TouchableOpacity>
      </View>
      <FlatList
        key={numColumns}
        data={categories}
        numColumns={numColumns}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleNavigateToVendors(item)} style={styles.itemContainer}>
            <View style={styles.categoryItem}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: item?.images[0] }} style={styles.image} />
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
});

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
