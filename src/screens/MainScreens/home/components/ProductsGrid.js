import React from 'react';
import {View, FlatList, TouchableOpacity} from 'react-native';
import ProductCard from '../../../../components/ProductCard';

const ProductsGrid = ({products, navigation}) => {
  const renderItems = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Details', {product: item})}>
      <ProductCard item={item} />
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={products}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItems}
      numColumns={2}
      columnWrapperStyle={{
        justifyContent: 'space-between',
        marginBottom: 5,
      }}
      contentContainerStyle={{padding: 15}}
    />
  );
};

export default ProductsGrid;
