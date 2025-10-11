import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useDispatch, useSelector} from 'react-redux';
import CustomImageCarousal from '../../../components/CustomImageCarousalLandscape';

import AddToCartBtn from '../../../components/AddToCartBtn';
import QuantityUpdater from '../../../components/QuantityUpdater';
import StickyButton from '../../../components/stickyBottomCartBtn';
import ProductCard from '../../../components/ProductCard';
import calculateDiscountedPrice from '../../../utils/calculateDiscountedPrice';
import useProductVariations from './useProductVariations';
import {getProductById} from '../../../config/redux/actions/productAction';
import {
  getFirstElementOfEachVariationType,
  getImages,
  isImagePresent,
} from './utils';
import DropDownPicker from 'react-native-dropdown-picker';
import HorizontalSelector from './HorizontalSelector';
import CustomImageCarousalSquare from '../../../components/CustomImageCarousalSquare';
import Icon from '../../../components/Icons/Icon';

const ProductDetails = ({route, navigation}) => {
  console.log('oute.params.product-->>', route.params.product);
  const dispatch = useDispatch();
  const [productId, setProductId] = useState(route.params.product._id);

  const {
    product: productDetails,
    loading: productDetailsLoading,
    error: productDetailsError,
  } = useSelector(state => state.product);

  useEffect(() => {
    setProductId(route.params.product._id);
    dispatch(getProductById(route.params.product._id));
  }, [dispatch, route.params.product._id]);

  const {
    product,
    selectedVariations,
    handleVariationChange,
    getVariationOptions,
    getColorVariationOptions,
    flatListRef,
    existingItemIndex,
    quantity,
    loading,
    products,
    fetchMoreProducts,
  } = useProductVariations(productDetails, route);

  // console.log("selectedVariations color, selectedVariations-->>",getVariationOptions('color', selectedVariations) )

  if (productDetailsLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (productDetailsError) {
    return <Text>Error: {productDetailsError}</Text>;
  }

  if (!productDetails || !product) {
    return null;
  }

  const {
    name,
    images,
    description,
    price,
    discount,
    variations,
    isReturnAllowed,
  } = product;
  let imagesData = [];
  let productimages = [];
  let variationImages = getImages(
    productDetails.variations,
    Object.values(selectedVariations),
  );

  // imagesData = images.concat(variationImages).map(item => {
  //   return { image: item }
  // });

  console.log(variationImages);
  if (variationImages.length > 0 && variationImages[0] !== undefined) {
    imagesData = variationImages.map(item => {
      return {image: item};
    });
  }

  if (images.length > 0 && images[0] !== undefined) {
    productimages = images.map(item => {
      return {image: item};
    });
  }

  const ListHeaderComponent = () => (
    <View style={styles.headerContainer}>
      <View style={styles.carousel}>
        <CustomImageCarousalSquare data={productimages} pagination />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.name}>{name}</Text>
        {isReturnAllowed && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 5,
              paddingTop: 10,
            }}>
            <Icon.FontAwesome6
              name="people-carry-box"
              size={25}
              color={'#ff6600'}
            />
            <Text
              style={{
                // width: windowWidth - 210,
                marginLeft: 10,
                fontWeight: '700',
                color: 'black',
              }}>
              Hand-To-Hand Return
            </Text>
          </View>
        )}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
            alignItems: 'center',
          }}>
          <View style={styles.priceContainer}>
            <Text style={styles.discountedPrice}>
              ₹{calculateDiscountedPrice(price, discount)}
            </Text>
            <Text style={styles.originalPrice}>₹{price}</Text>
          </View>
          {existingItemIndex === -1 ? (
            <AddToCartBtn product={product} />
          ) : (
            <QuantityUpdater quantity={quantity} item={product} />
          )}
        </View>
        {getVariationTypes().map(type => (
          <View key={type} style={styles.variationContainer}>
            <Text style={styles.variationLabel}>{type}</Text>
            {isImagePresent(productDetails.variations, type) ? (
              <HorizontalSelector
                items={getColorVariationOptions(type, selectedVariations)}
                selectedValue={selectedVariations[type]}
                onValueChange={value => handleVariationChange(type, value)}
              />
            ) : (
              <View style={styles.pickercontainer}>
                <Picker
                  selectedValue={selectedVariations[type]}
                  onValueChange={value => handleVariationChange(type, value)}
                  style={styles.variationPicker}>
                  {selectedVariations &&
                    getVariationOptions(type, selectedVariations).map(
                      option => (
                        <Picker.Item
                          key={option}
                          label={option}
                          value={option}
                        />
                      ),
                    )}
                </Picker>
                <Icon.MaterialIcons
                  name="arrow-drop-down"
                  size={35}
                  color="#ff6600"
                  style={styles.icon}
                />
              </View>
            )}
          </View>
        ))}

        <Text style={styles.details}>{description}</Text>
        <Text style={styles.frequentlyBoughtTitle}>Similar Products</Text>
      </View>
    </View>
  );

  const getVariationTypes = () => {
    return [
      ...new Set(productDetails.variations.map(v => v.attributes.selected)),
    ];
  };

  // console.log("getColorVariationOptions(type, selectedVariations)->", getColorVariationOptions('color', selectedVariations))

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={products}
        keyExtractor={item => item._id.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Details', {product: item});
              flatListRef.current.scrollToOffset({offset: 0, animated: true});
            }}>
            <ProductCard item={item} />
          </TouchableOpacity>
        )}
        onEndReached={fetchMoreProducts}
        onEndReachedThreshold={0}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" color="#0000ff" /> : null
        }
        columnWrapperStyle={{justifyContent: 'space-between', marginBottom: 5}}
        numColumns={2}
        contentContainerStyle={{
          padding: 15,
          paddingBottom: existingItemIndex !== -1 ? 100 : 10,
        }}
      />
      {existingItemIndex !== -1 && <StickyButton navigation={navigation} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  pickercontainer: {
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 5,
    borderColor: '#000066',
    position: 'relative',
  },
  variationPicker: {
    width: '100%',
    height: 50,
    color: 'black',
  },
  icon: {
    position: 'absolute',
    right: 7,
    top: '50%',
    marginTop: -18, // Adjust this value to center the icon vertically
    color: '#000066',
  },
  carousel: {
    marginHorizontal: 5,
    borderWidth: 2,
    // padding:10,
    borderRadius: 15,
    borderColor: '#D3D3D3',
    overflow: 'hidden',
    // marginTop:15
  },
  contentContainer: {
    padding: 5,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    marginTop: 8,
    color: 'black',
  },
  variationLabel: {
    fontSize: 15,
    fontWeight: '500',
    marginTop: 8,
    color: 'black',
  },
  price: {
    fontSize: 15,
    color: '#ff6600',
    marginTop: 8,
    fontWeight: '800',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  rating: {
    fontSize: 13,
    color: '#FDCC0D',
  },
  details: {
    fontSize: 16,
    color: '#757575',
    marginVertical: 10,
  },
  frequentlyBoughtTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 5,
    color: '#000000',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 7,
  },
  discountedPrice: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 15,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    marginLeft: 15,
    fontSize: 17,
  },
});

export default ProductDetails;
