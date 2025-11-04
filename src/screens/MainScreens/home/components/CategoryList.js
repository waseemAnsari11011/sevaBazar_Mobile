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
  const numColumns = Math.ceil(categories.length / 2);

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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        style={styles.scrollView}>
        <FlatList
          // 👇 FIX: Add a key that changes with numColumns.
          // This forces a re-render and avoids the invariant violation error.
          key={numColumns}
          contentContainerStyle={{alignSelf: 'flex-start'}}
          numColumns={numColumns}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={categories}
          scrollEnabled={false} // The parent ScrollView handles scrolling
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => handleNavigateToVendors(item)}>
              <View style={styles.categoryItem}>
                <View style={styles.imageContainer}>
                  <Image source={{uri: item?.images[0]}} style={styles.image} />
                </View>
                <Text style={styles.categoryName}>{item.name}</Text>
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
  scrollView: {
    marginHorizontal: -15, // Negative margin to extend to screen edges
  },
  scrollViewContent: {
    paddingHorizontal: 15, // Add padding back inside the ScrollView
  },
  categoryItem: {
    alignItems: 'center',
    padding: 10,
    width: 100, // Fixed width for consistent item size
  },
  imageContainer: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: '#00006680',
  },
  image: {
    width: 75,
    height: 75,
    borderRadius: 10,
  },
  categoryName: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '400',
    color: '#000000',
    textAlign: 'center',
  },
});

export default CategoryList;
