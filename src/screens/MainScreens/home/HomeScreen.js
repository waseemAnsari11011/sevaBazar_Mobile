import React, {useEffect, useRef} from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchAllProducts,
  updateAllProductsPage,
  resetAllProducts,
} from '../../../config/redux/actions/fetchAllProductsActions';
import Header from './components/Header';
import CarouselBanner from './components/CarouselBanner';
import CategoriesList from './components/CategoriesList';
import LatestProducts from './components/LatestProducts';
import OnSaleProducts from './components/OnSaleProducts';
import DealOfDaySection from './components/DealOfDaySection';
import ProductCard from '../../../components/ProductCard';
import {getBanners} from '../../../config/redux/actions/bannerActions';
import {fetchCategories} from '../../../config/redux/actions/categoryAction';
import {fetchRecentlyAddedProducts} from '../../../config/redux/actions/recentlyAddedActions';
import {fetchDiscountedProducts} from '../../../config/redux/actions/discountedProductsActions';
import {fetchAllCategoryProducts} from '../../../config/redux/actions/getallCategoryProductsActions';

const HomeScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const flatListRef = useRef(null);

  // Redux selectors
  const {
    loading: allProductsLoading,
    products: allProducts,
    page,
    reachedEnd,
  } = useSelector(state => state.allProducts);
  const {banners} = useSelector(state => state.banners);
  const {
    loading: onDiscountLoading,
    products: onDiscountProducts,
    error: onDiscountError,
  } = useSelector(state => state.discountedProducts);
  const {
    loading: categoryLoading,
    category,
    error: categoryError,
  } = useSelector(state => state.categories);
  const {
    loading: allCategoryProductsLoading,
    data: allCategoryProducts,
    error: allCategoryProductsError,
  } = useSelector(state => state.allCategoryProducts);

  const {data} = useSelector(state => state?.local);
  const scrollToTop = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({animated: true, offset: 0});
    }
  };

  useEffect(() => {
    if (!reachedEnd && !allProductsLoading) {
      dispatch(fetchAllProducts(page));
    }
  }, [page]);

  useEffect(() => {
    dispatch(getBanners());
  }, [dispatch]);

  useEffect(() => {
    if (!categoryLoading) {
      dispatch(fetchCategories());
    }
    if (!categoryLoading) {
      dispatch(
        fetchRecentlyAddedProducts(1, 4, data?.user.availableLocalities),
      );
    }
    if (!onDiscountLoading) {
      dispatch(fetchDiscountedProducts(1, 4, data?.user.availableLocalities));
    }

    if (!allCategoryProductsLoading) {
      dispatch(fetchAllCategoryProducts());
    }
  }, [dispatch]);

  const fetchMoreProducts = () => {
    if (!allProductsLoading && !reachedEnd) {
      dispatch(updateAllProductsPage(page + 1));
    }
  };

  const ListHeaderComponent = () => (
    <View>
      <CarouselBanner banners={banners} />
      <CategoriesList category={category} navigation={navigation} />
      <DealOfDaySection navigation={navigation} />
      <LatestProducts navigation={navigation} />
      <OnSaleProducts products={onDiscountProducts} navigation={navigation} />
    </View>
  );

  return (
    <View style={{flex: 1}}>
      <Header scrollToTop={scrollToTop} />
      <FlatList
        ref={flatListRef}
        data={allProducts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Details', {product: item})}>
            <ProductCard item={item} />
          </TouchableOpacity>
        )}
        onEndReached={fetchMoreProducts}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          allProductsLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : null
        }
        ListHeaderComponent={ListHeaderComponent}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'space-between', // Adjusts spacing between items horizontally
          marginBottom: 5, // Adjusts spacing between rows
        }}
        contentContainerStyle={{padding: 15}}
      />
    </View>
  );
};

export default HomeScreen;
