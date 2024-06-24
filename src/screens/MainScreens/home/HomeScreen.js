import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Dimensions,
  FlatList
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Card from '../../../components/Card';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../../config/redux/actions/cartActions';

import Loading from '../../../components/Loading';
import Icon from '../../../components/Icons/Icon';
import CardProducts from '../../../components/CardProducts';
import SearchBar from '../../../components/SearchBar';
import CustomImageCarousal from '../../../components/CustomImageCarousalLandscape';
import ProductCard from '../../../components/ProductCard';
import { baseURL } from '../../../utils/api';
import { fetchRecentlyAddedProducts, updateRecentlyAddedProductsPage, resetRecentlyAddedProducts } from '../../../config/redux/actions/recentlyAddedActions';
import { fetchCategories } from '../../../config/redux/actions/categoryAction';
import { fetchDiscountedProducts, updateDiscountedProductsPage, resetDiscountedProducts } from '../../../config/redux/actions/discountedProductsActions';
import { getBanners } from '../../../config/redux/actions/bannerActions';
import DealOfDay from './DealOfDay';
import ProductCarousel from './ProductCarousel';
import { fetchProductsByCategory, resetProductsByCategory } from '../../../config/redux/actions/productsByCategoryActions';


const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading: categoryLoading, category, error: categoryError } = useSelector(
    state => state.categories,
  );
  const { loading: bannerLoading, banners, error: bannerError } = useSelector(state => state.banners);

  const { data } = useSelector(state => state?.local);

  const { loading: recentlyAddedLoading, products: recentlyAddedProducts, error: recentlyAddedError, } = useSelector(state => state.recentlyAddedProducts);
  const { loading: onDiscountLoading, products: onDiscountProducts, error: onDiscountError, } = useSelector(state => state.discountedProducts);
  const { loading: firstCategoryLoading, products: firstCategoryProducts, error: firstCategoryError, } = useSelector(state => state.categoryProducts);

  // console.log("onDiscountProducts-->>", onDiscountProducts)

  useEffect(() => {
    dispatch(getBanners());
  }, [dispatch]);




  useEffect(() => {
    if (!categoryLoading) {
      dispatch(fetchCategories());
    }
    if (!categoryLoading) {
      dispatch(fetchRecentlyAddedProducts(1, 4, data?.user.availableLocalities))
    }
    if (!onDiscountLoading) {
      dispatch(fetchDiscountedProducts(1, 4, data?.user.availableLocalities))
    }


  }, [dispatch]);

  useEffect(() => {
    if (!firstCategoryLoading && category.length > 0) {
      dispatch(fetchProductsByCategory(category[0]?._id, 1, 4, data?.user.availableLocalities))
    }
  }, [category]);

  // useEffect(() => {
  //   return () => {
  //     dispatch(resetProductsByCategory());
  //   };
  // }, [dispatch]);

  // useEffect(() => {
  //   return () => {
  //     dispatch(resetRecentlyAddedProducts());
  //   };
  // }, [dispatch]);

  const handleCategoryNavigate = async() => {
   await dispatch(resetProductsByCategory());
    navigation.navigate('CategoryProducts', {
      categoryId: category[0]?._id,
      categoryTitle: category[0]?.name,
    })
  }

  if (categoryError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{categoryError}</Text>
      </View>
    );
  }


  const renderCategory = ({ item }) => (
    <View>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('CategoryProducts', {
            categoryId: item._id,
            categoryTitle: item.name,
          })
        }>
        <View
          style={{
            alignSelf: 'baseline',
            alignItems: 'center',
            padding: 10,
            // elevation: 10,
          }}>
          <Image
            source={{ uri: `${baseURL}${item?.images[0]}` }}
            style={{ width: 85, height: 85, borderRadius: 10, }}
          />
          <Text style={{ marginTop: 10, fontSize: 13, fontWeight: '400', color: "#000000" }}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderItems = ({ item }) => (

    <TouchableOpacity style={{}} onPress={() =>
      navigation.navigate('Details', { product: item })
    }>
      <ProductCard item={item} />
    </TouchableOpacity>

  );

  const ListHeaderComponent = () => (
    <View style={{

    }}>
      <View style={{ marginTop: 15 }}>
        <View style={{ marginHorizontal: -20 }}>
          <CustomImageCarousal data={banners} autoPlay={true} pagination={true} />
        </View>
      </View>
      <View style={{ marginBottom: 5, }}>
        <Text style={{ fontSize: 18, fontWeight: '700', marginVertical: 5, color: "#000000" }}>Explore Categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          directionalLockEnabled={true}
          alwaysBounceVertical={false}
          style={{ marginHorizontal: -20 }}
        >
          <FlatList
            contentContainerStyle={{ alignSelf: "flex-start" }}
            numColumns={Math.ceil(category.length / 2)}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={category}
            directionalLockEnabled={true}
            alwaysBounceVertical={false}
            renderItem={renderCategory}
          />
        </ScrollView>
        <View style={{ marginBottom: 15 }}>
          <DealOfDay navigation={navigation} />

        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: '700', marginVertical: 5, color: "#000000" }}>Latest Products</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('New Arrivals')
            }
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Text style={{ color: 'green', marginRight: 5, fontSize: 15, fontWeight: 600 }}>View all</Text>
            <Icon.AntDesign name="right" color="green" size={13} />
          </TouchableOpacity>
        </View>
        <View style={{ marginHorizontal: -20 }}>

          <ProductCarousel navigation={navigation} />
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: '700', marginVertical: 5, color: "#000000" }}>On Sale</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Discounted Products')
          }
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <Text style={{ color: 'green', marginRight: 5, fontSize: 15, fontWeight: 600 }}>View all</Text>
          <Icon.AntDesign name="right" color="green" size={13} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={onDiscountProducts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItems}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'space-between', // Adjusts spacing between items horizontally
          marginBottom: 5, // Adjusts spacing between rows
        }}
        contentContainerStyle={{ padding: 15 }}

      />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: '700', marginVertical: 5, color: "#000000" }}>{category[0]?.name}</Text>
        <TouchableOpacity
          onPress={handleCategoryNavigate}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <Text style={{ color: 'green', marginRight: 5, fontSize: 15, fontWeight: 600 }}>View all</Text>
          <Icon.AntDesign name="right" color="green" size={13} />
        </TouchableOpacity>
      </View>
    </View>
  );


  return (
    <View style={{ flex: 1, paddingTop: 60 }}>
      {categoryLoading && <Loading />}
      <SearchBar />

      <FlatList
        data={firstCategoryProducts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItems}
        ListHeaderComponent={ListHeaderComponent}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'space-between', // Adjusts spacing between items horizontally
          marginBottom: 5, // Adjusts spacing between rows
        }}
        contentContainerStyle={{ padding: 15 }}

      />

    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#F0F8FF50",
  },
  wrapper: {
    height: 160,
  },
  itemContainer: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10,
  },
});
