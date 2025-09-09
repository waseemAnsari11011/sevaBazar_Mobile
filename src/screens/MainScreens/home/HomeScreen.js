import React, {useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Loading from '../../../components/Loading';
import SearchBar from '../../../components/SearchBar';
import ProductCard from '../../../components/ProductCard';
import {useHomeScreenData} from './hooks/useHomeScreenData';
import {useInfiniteScroll} from './hooks/useInfiniteScroll';
import HomeScreenHeader from './components/HomeScreenHeader';

const HomeScreen = ({navigation}) => {
  const flatListRef = useRef(null);

  // Use custom hooks to abstract away logic
  const {
    user,
    categoryLoading,
    categories,
    categoryError,
    banners,
    onDiscountProducts,
    allCategoryProducts,
  } = useHomeScreenData();

  const {allProducts, allProductsLoading, fetchMoreProducts} =
    useInfiniteScroll(user);

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({animated: true, offset: 0});
  };

  const renderProductItem = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Details', {product: item})}>
      <ProductCard item={item} />
    </TouchableOpacity>
  );

  // Handle error state
  if (categoryError) {
    return (
      <View style={styles.centerContainer}>
        <Text>{categoryError}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {categoryLoading && <Loading />}

      <SearchBar scrollToTop={scrollToTop} />

      <FlatList
        ref={flatListRef}
        data={allProducts}
        keyExtractor={(item, index) => `${item._id}-${index}`}
        renderItem={renderProductItem}
        numColumns={2}
        onEndReached={fetchMoreProducts}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <HomeScreenHeader
            navigation={navigation}
            banners={banners}
            categories={categories}
            onDiscountProducts={onDiscountProducts}
            allCategoryProducts={allCategoryProducts}
          />
        }
        ListFooterComponent={
          allProductsLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : null
        }
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60, // For custom header/search bar
    backgroundColor: '#FFFFFF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  contentContainer: {
    padding: 15,
  },
});

export default HomeScreen;
