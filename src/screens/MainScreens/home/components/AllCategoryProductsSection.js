// AllCategoryProductsSection.js

import React, {useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchAllCategoryProducts,
  resetFetchAllCategoryProducts,
} from '../../../../config/redux/actions/getallCategoryProductsActions';
import ProductCard from '../../../../components/ProductCard';
import Icon from '../../../../components/Icons/Icon';

const AllCategoryProductsSection = ({navigation}) => {
  const dispatch = useDispatch();
  const {loading, data, error} = useSelector(
    state => state.allCategoryProducts,
  );

  useEffect(() => {
    dispatch(fetchAllCategoryProducts());
    return () => {
      dispatch(resetFetchAllCategoryProducts());
    };
  }, [dispatch]);

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Details', {product: item})}>
      <ProductCard item={item} />
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={{marginVertical: 10}}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: '700',
          marginVertical: 5,
          color: '#000000',
        }}>
        All Products
      </Text>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{justifyContent: 'space-between', marginBottom: 5}}
        contentContainerStyle={{padding: 15}}
      />
    </View>
  );
};

export default AllCategoryProductsSection;
