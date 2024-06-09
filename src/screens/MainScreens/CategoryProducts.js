import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import React, { useEffect } from 'react';
import SafeScreen from '../../components/SafeScreen';
import Icon from '../../components/Icons/Icon';
import CategoryProductsCard from '../../components/CategoryProductsCard';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductByCategory } from '../../config/redux/actions/orderTrackingActions';
import Loading from '../../components/Loading';
import StickyButton from '../../components/stickyBottomCartBtn';
import { fetchProductsByCategory, updateProductsByCategoryPage, resetProductsByCategory } from '../../config/redux/actions/productsByCategoryActions';


const CategoryProducts = ({ navigation, route }) => {
  const { cartItems } = useSelector(state => state.cart);
  const {data} = useSelector(state => state?.local);

  const dispatch = useDispatch();


  const { loading, products, error, page, limit, reachedEnd } = useSelector(state => state.categoryProducts);

  useEffect(() => {
    if (!reachedEnd && !loading) {
      dispatch(fetchProductsByCategory(route.params?.categoryId, page, limit, data?.user.availableLocalities));
    }
  }, [page]);

  // Reset similar products store when leaving the screen
  useEffect(() => {
    return () => {
      dispatch(resetProductsByCategory());
    };
  }, [dispatch]);


  const fetchMoreProducts = () => {
    if (!loading && !reachedEnd) {
      dispatch(updateProductsByCategoryPage(page + 1)); // Increment the page number
    }
  };


  if (products.length === 0 && !loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No Products Found For this Category</Text>
      </View>
    );
  }
  const renderSeparator = () => <View style={styles.separator} />;

  const renderItem = ({ item, index }) => {
    return (
      <View style={[index === products.length - 1 && cartItems.length > 0 ? styles.lastItem : index === products.length - 1 && { marginBottom: 15 }, index===0&&{marginTop:15}]}>
        <CategoryProductsCard
          item={item}
          onPressNavigation={() =>
            navigation.navigate('Details', { product: item })
          }
        />
      </View>
    );
  };

  return (
    <>
      <View style={{ flex: 1, backgroundColor: '#F0F8FF50', }}>

        <View
          style={{
            flex: 1,
          }}>
          <View style={{ paddingHorizontal: 15 }}>
            <FlatList
              data={products}
              keyExtractor={(item) => item._id.toString()}
              renderItem={renderItem}
              onEndReached={fetchMoreProducts}
              onEndReachedThreshold={0}
              ListFooterComponent={loading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
              ItemSeparatorComponent={({ highlighted }) =>
                highlighted ? null : renderSeparator()
              }
            />
            {/* <FlatList keyExtractor={item => item._id.toString()} data={data} renderItem={renderItem} ItemSeparatorComponent={({ highlighted }) =>
              highlighted ? null : renderSeparator()
            } /> */}

          </View>
        </View>
      </View>
      {cartItems.length > 0 && <StickyButton navigation={navigation} />}

    </>

  );
};

export default CategoryProducts;

const styles = StyleSheet.create({
  separator: {
    // borderBottomWidth: 1,
    // borderBottomColor: 'lightgray',
    marginBottom:15
  },
  lastItem: {
    marginBottom: 100,
  },
});
