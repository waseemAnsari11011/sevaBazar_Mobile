import React from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import Icon from '../../../../components/Icons/Icon';
import ProductCard from '../../../../components/ProductCard';

const ProductSection = ({title, products, navigation, navigateToScreen}) => {
  const renderItems = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Details', {product: item})}>
      <ProductCard item={item} />
    </TouchableOpacity>
  );

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate(navigateToScreen)}
          style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View all</Text>
          <Icon.AntDesign name="right" color="#000066" size={13} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={products}
        keyExtractor={(item, index) => `${item._id}-${index}`}
        renderItem={renderItems}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={{paddingVertical: 5}}
        scrollEnabled={false} // Important for FlatList inside ScrollView
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginVertical: 5,
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
    justifyContent: 'space-between',
    marginBottom: 5,
  },
});

export default ProductSection;
