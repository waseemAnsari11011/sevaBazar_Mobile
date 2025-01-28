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
  const {category} = useSelector(state => state.categories);
  const {products: onDiscountProducts} = useSelector(
    state => state.discountedProducts,
  );

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
