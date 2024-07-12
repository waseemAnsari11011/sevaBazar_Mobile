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
import { fetchAllProducts, updateAllProductsPage, resetAllProducts } from '../../../config/redux/actions/fetchAllProductsActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateFcm } from '../../../config/redux/actions/customerActions';


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

  ////////////FETCH ALL PRODUCTS/////////////
  const { loading: allProductsLoading, products: allProducts, error: allProductsError, page, limit, reachedEnd } = useSelector(state => state.allProducts);


  useEffect(() => {
    const fetchAndUpdateFcm = async () => {
      const deviceToken = await AsyncStorage.getItem('deviceToken');
      console.log("home deviceToken-->>", deviceToken)
      const deviceTokenData = JSON.parse(deviceToken);
      await updateFcm(data?.user?._id, deviceTokenData);
    };

    fetchAndUpdateFcm();
  }, []);


  useEffect(() => {
    if (!reachedEnd && !allProductsLoading) {

      console.log("more is calling it #####")
      dispatch(fetchAllProducts(page, limit, data?.user.availableLocalities));

    }
  }, [page]);

  // Reset similar products store when leaving the screen
  useEffect(() => {
    return () => {
      dispatch(resetAllProducts());
      // dispatch(fetchAllProducts(1, 4, data?.user.availableLocalities));
    };
  }, [dispatch]);


  const fetchMoreProducts = () => {
    if (!allProductsLoading && !reachedEnd) {
      dispatch(updateAllProductsPage(page + 1)); // Increment the page number
    }
  };

  /////////////////////

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


  const handleCategoryNavigate = async () => {
    await dispatch(resetProductsByCategory());
    navigation.navigate('CategoryProducts', {
      categoryId: category[0]?._id,
      categoryTitle: category[0]?.name,
    })
  }

  const handleAllProductsNavigate = async () => {
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

  const handleNavigateProductsByCategory = async (item) => {
    await dispatch(resetProductsByCategory());
    navigation.navigate('CategoryProducts', {
      categoryId: item._id,
      categoryTitle: item.name,
    })
  }


  const renderCategory = ({ item }) => (
    <View>
      <TouchableOpacity
        onPress={() => handleNavigateProductsByCategory(item)}>
        <View
          style={{
            alignSelf: 'baseline',
            alignItems: 'center',
            padding: 10,
            // elevation: 10,
          }}>
          <View style={{ borderWidth: 1, padding: 10, borderRadius: 5, borderColor: '#00006680' }}>
            <Image
              source={{ uri: `${baseURL}${item?.images[0]}` }}
              style={{
                width: 75, height: 75, borderRadius: 10,
              }}
            />
          </View>

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
      <View style={{ marginTop: 20 }}>
        <View style={{ marginHorizontal: -20 }}>
          <CustomImageCarousal data={banners} autoPlay={true} pagination={true} />
        </View>
      </View>
      <View style={{ marginBottom: 10, }}>
        {/* <Text style={{ fontSize: 18, fontWeight: '700', marginVertical: 5, color: "#000000" }}>Explore Categories</Text> */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: '700', marginVertical: 5, color: "#000000" }}>Explore Categories</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('All Categories', { categoriesData: category })
            }
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Text style={{ color: '#000066', marginRight: 5, fontSize: 15, fontWeight: 600 }}>View all</Text>
            <Icon.AntDesign name="right" color="#000066" size={13} />
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          directionalLockEnabled={true}
          alwaysBounceVertical={false}
          style={{ marginHorizontal: -10 }}
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
            <Text style={{ color: '#000066', marginRight: 5, fontSize: 15, fontWeight: 600 }}>View all</Text>
            <Icon.AntDesign name="right" color="#000066" size={13} />
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
          <Text style={{ color: '#000066', marginRight: 5, fontSize: 15, fontWeight: 600 }}>View all</Text>
          <Icon.AntDesign name="right" color="#000066" size={13} />
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
          <Text style={{ color: '#000066', marginRight: 5, fontSize: 15, fontWeight: 600 }}>View all</Text>
          <Icon.AntDesign name="right" color="#000066" size={13} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={firstCategoryProducts}
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
        <Text style={{ fontSize: 18, fontWeight: '700', marginVertical: 5, color: "#000000" }}>All Products</Text>
        {/* <TouchableOpacity
          onPress={handleAllProductsNavigate}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <Text style={{ color: '#ff6600', marginRight: 5, fontSize: 15, fontWeight: 600 }}>View all</Text>
          <Icon.AntDesign name="right" color="#ff6600" size={13} />
        </TouchableOpacity> */}
      </View>
    </View>
  );


  return (
    <View style={{ flex: 1, paddingTop: 60 }}>
      {categoryLoading && <Loading />}

      <SearchBar />


      <FlatList
        data={allProducts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItems}
        onEndReached={fetchMoreProducts}
        onEndReachedThreshold={0}
        ListFooterComponent={allProductsLoading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
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

});
