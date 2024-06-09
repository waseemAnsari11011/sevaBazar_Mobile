import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import CustomImageCarousal from '../../components/CustomImageCarousalSquare';
import StickyButton from '../../components/stickyBottomCartBtn';
import { useDispatch, useSelector } from 'react-redux';
import QuantityUpdater from '../../components/QuantityUpdater';
import ProductCard from '../../components/ProductCard';
import AddToCartBtn from '../../components/AddToCartBtn';
import { baseURL } from '../../utils/api';
import calculateDiscountedPrice from '../../utils/calculateDiscountedPrice';
import { fetchSimilarProducts, updateSimilarProductsPage, resetSimilarProducts } from '../../config/redux/actions/similiarProductsActions';


const Details = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const {data} = useSelector(state => state?.local);
  const { loading, products, error, page, limit, reachedEnd } = useSelector(state => state.similarProducts);
  const { name, images, description, price, _id, rating, discount } = route.params.product;
  const cartItems = useSelector(state => state.cart.cartItems);
  const existingItemIndex = cartItems.findIndex(i => i._id === _id);
  const quantity = existingItemIndex !== -1 ? cartItems[existingItemIndex].quantity : 0;
  const flatListRef = useRef(null); // Ref for FlatList

  const productId = _id
  const product =route.params.product


  useEffect(() => {
    if (!reachedEnd && !loading) {
      dispatch(fetchSimilarProducts(productId, page, limit, data?.user.availableLocalities));
    }
  }, [page]);

  // Reset similar products store when leaving the screen
  useEffect(() => {
    return () => {
      dispatch(resetSimilarProducts());
    };
  }, [dispatch]);

  const fetchMoreProducts = () => {
    if (!loading && !reachedEnd) {
      dispatch(updateSimilarProductsPage(page + 1)); // Increment the page number
    }
  };



  const imagesData = images.map(item => ({
    image: `${baseURL}${item}`
  }));



  const renderItems = ({ item }) => (
    <TouchableOpacity
    onPress={() => {
      navigation.navigate('Details', { product: item });
      flatListRef.current.scrollToOffset({ offset: 0, animated: true }); // Scroll to top
    }}

    >
      <ProductCard item={item} />
    </TouchableOpacity>
  );

  const ListHeaderComponent = () => (
    <View style={styles.headerContainer} >
      <View style={styles.carousel}>
        <CustomImageCarousal data={imagesData} autoPlay={true} pagination={true} />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.name}>{name}</Text>
        <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
          <View style={styles.priceContainer}>
            <Text style={styles.discountedPrice}>₹{calculateDiscountedPrice(price, discount)}</Text>
            <Text style={styles.originalPrice}>₹{price}</Text>
          </View>
          {existingItemIndex === -1 ?
            <AddToCartBtn product={product} /> :
            <QuantityUpdater quantity={quantity} item={product} />
          }
        </View>
        <Text style={styles.details}>{description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef} // Set the ref here
        data={products}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderItems}
        onEndReached={fetchMoreProducts}
        onEndReachedThreshold={0}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={loading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          marginBottom: 5,
        }}
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

export default Details;
