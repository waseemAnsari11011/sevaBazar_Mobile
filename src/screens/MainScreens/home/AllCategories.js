//home/AllCategories.js
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import {baseURL} from '../../../utils/api';
import {resetProductsByCategory} from '../../../config/redux/actions/productsByCategoryActions';
import {useDispatch} from 'react-redux';

const AllCategories = ({route, navigation}) => {
  const dispatch = useDispatch();
  const {categoriesData} = route.params;
  console.log('categoriesData', categoriesData);

  const handleNavigateProductsByCategory = async item => {
    await dispatch(resetProductsByCategory());

    navigation.navigate('VendorsByCategory', {
      categoryId: item._id,
      categoryTitle: item.name,
    });
  };

  const renderCategory = ({item}) => (
    <View style={styles.categoryContainer}>
      <TouchableOpacity onPress={() => handleNavigateProductsByCategory(item)}>
        <View style={styles.categoryContent}>
          <View style={styles.imageContainer}>
            <Image
              source={{uri: item?.images[0]}}
              style={styles.categoryImage}
            />
          </View>
          <Text style={styles.categoryName}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>All Categories</Text>
      <FlatList
        contentContainerStyle={styles.flatListContent}
        numColumns={3}
        data={categoriesData}
        directionalLockEnabled={true}
        alwaysBounceVertical={false}
        renderItem={renderCategory}
        keyExtractor={item => item._id.toString()}
      />
    </View>
  );
};

export default AllCategories;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: 'black',
  },
  flatListContent: {
    alignItems: 'center',
  },
  categoryContainer: {
    flex: 1,
    flexBasis: '30%', // Ensures three items per row
    margin: 5,
    alignItems: 'center',
  },
  categoryContent: {
    alignItems: 'center',
    padding: 10,
  },
  imageContainer: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: '#00006680',
  },
  categoryImage: {
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
