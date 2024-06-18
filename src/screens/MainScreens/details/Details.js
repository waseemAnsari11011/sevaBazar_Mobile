import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';
import CustomImageCarousal from '../../../components/CustomImageCarousalLandscape';
import AddToCartBtn from '../../../components/AddToCartBtn';
import QuantityUpdater from '../../../components/QuantityUpdater';
import StickyButton from '../../../components/stickyBottomCartBtn';
import ProductCard from '../../../components/ProductCard';
import calculateDiscountedPrice from '../../../utils/calculateDiscountedPrice';
import useProductVariations from './useProductVariations';
import { getProductById } from '../../../config/redux/actions/productAction';
import { getFirstElementOfEachVariationType } from './utils';

const ProductDetails = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const [productId, setProductId] = useState(route.params.product._id);

  const { product: productDetails, loading: productDetailsLoading, error: productDetailsError } = useSelector((state) => state.product);

  useEffect(() => {
    setProductId(route.params.product._id);
    dispatch(getProductById(route.params.product._id));
  }, [dispatch, route.params.product._id]);

  const {
    product,
    selectedVariations,
    handleVariationChange,
    getVariationOptions,
    flatListRef,
    existingItemIndex,
    quantity,
    loading,
    products,
    fetchMoreProducts
  } = useProductVariations(productDetails, route);

  console.log("selectedVariations-->>", selectedVariations)

  if (productDetailsLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (productDetailsError) {
    return <Text>Error: {productDetailsError}</Text>;
  }

  if (!productDetails || !product) {
    return null
  }

  console.log("product-->>", product)
  console.log("productDetails-->>", productDetails)


  const { name, images, description, price, discount, variations } = product ;
  const imagesData = images.map(item => ({
    image: item
  }));

  // console.log("selectedVariations-->>", selectedVariations)

  // let filteredVariationsArr = getFirstElementOfEachVariationType(productDetails.variations)


  // filteredVariationsArr = filteredVariationsArr.map(variation => ({
  //   ...variation,
  //   quantity: quantity + 1
  // }));

  // const totalPrice = filteredVariationsArr.reduce((sum, variation) =>
  //   sum + variation.price, 0);

  // console.log("totalPrice-->>", totalPrice)

  // const totalDiscount = filteredVariationsArr.reduce((sum, variation) =>
  //   sum + variation.discount, 0);

  // console.log("totalDiscount-->>", totalDiscount)

  // const modifiedProduct = { ...productDetails, variations: filteredVariationsArr, price: totalPrice, discount: totalDiscount };


  const ListHeaderComponent = () => (
    <View style={styles.headerContainer}>
      <View style={styles.carousel}>
        <CustomImageCarousal data={imagesData} autoPlay pagination />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.name}>{name}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={styles.priceContainer}>
            <Text style={styles.discountedPrice}>₹{calculateDiscountedPrice(price, discount)}</Text>
            <Text style={styles.originalPrice}>₹{price}</Text>
          </View>
          {existingItemIndex === -1 ? (
            <AddToCartBtn product={product} />
          ) : (
            <QuantityUpdater quantity={quantity} item={product} />
          )}
        </View>
        <Text style={styles.details}>{description}</Text>
        {getVariationTypes().map(type => (
          <View key={type} style={styles.variationContainer}>
            <Text style={styles.variationLabel}>{type}</Text>
            <Picker
              selectedValue={selectedVariations[type]}
              onValueChange={(value) => handleVariationChange(type, value)}
              style={styles.variationPicker}
            >
              {getVariationOptions(type).map(option => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>
        ))}
      </View>
    </View>
  );

  const getVariationTypes = () => {
    return [...new Set(productDetails.variations.map(v => v.attributes.selected))];
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={products}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Details', { product: item });
              flatListRef.current.scrollToOffset({ offset: 0, animated: true });
            }}
          >
            <ProductCard item={item} />
          </TouchableOpacity>
        )}
        onEndReached={fetchMoreProducts}
        onEndReachedThreshold={0}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={loading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 5 }}
        numColumns={2}
        contentContainerStyle={{ padding: 15, paddingBottom: existingItemIndex !== -1 ? 100 : 10 }}
      />
      {existingItemIndex !== -1 && <StickyButton navigation={navigation} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  carousel: {
    marginVertical: 15,
  },
  contentContainer: {
    padding: 15,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 8,
    color: "black"
  },
  price: {
    fontSize: 15,
    color: 'green',
    marginTop: 8,
    fontWeight: '800'
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    marginTop: 4,
  },
  rating: {
    fontSize: 13,
    color: '#FDCC0D',
  },
  details: {
    fontSize: 13,
    color: '#757575',
    marginTop: 10,
  },
  frequentlyBoughtTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginVertical: 5,
    color: "#000000"
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 7
  },
  discountedPrice: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 15,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    marginLeft: 15,
    fontSize: 17
  },
});

export default ProductDetails;
