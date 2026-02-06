//home/DealOfDay.js
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import { baseURL } from '../../../utils/api';
import calculateDiscountedPrice from '../../../utils/calculateDiscountedPrice';
import { formatCurrency } from '../../../utils/currency';
const windowWidth = Dimensions.get('window').width;

const DealOfDay = React.memo(({ navigation }) => {
  const {
    loading: onDiscountLoading,
    products: onDiscountProducts,
    error: onDiscountError,
  } = useSelector(state => state.discountedProducts);
  const item = onDiscountProducts[0];

  return (
    <>
      {item && (
        <View
          style={{
            backgroundColor: '#ff660030',
            marginHorizontal: 0,
            alignItems: 'center',
            padding: 20,
            marginTop: 15,
          }}>
          <Text
            style={{
              marginBottom: 15,
              color: '#000066',
              fontWeight: '600',
              fontSize: 17,
            }}>
            Deal Of the Day
          </Text>
          <TouchableOpacity
            style={styles.container}
            onPress={() => navigation.navigate('Details', { product: item })}>
            {item?.images?.length === 0 && (
              <Image
                source={{
                  uri: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM4sEG5g9GFcy4SUxbzWNzUTf1jMISTDZrTw&s`,
                }} // Replace with your image url
                style={styles.productImage}
              />
            )}
            {item?.images?.length !== 0 && (
              <Image
                source={{ uri: item?.images[0] }}
                style={styles.productImage}
              />
            )}
            <View style={styles.detailsContainer}>
              <Text style={styles.productName}>{item?.name}</Text>
              <Text style={styles.productWeight}>
                {item?.variations[0]?.attributes.value}
              </Text>
              <View style={styles.priceContainer}>
                <Text style={styles.discountedPrice}>
                  {formatCurrency(calculateDiscountedPrice(
                    item?.variations[0].price,
                    item?.variations[0]?.discount,
                  ).discountedPrice)}
                </Text>
                <Text style={styles.originalPrice}>
                  {formatCurrency(item?.variations[0]?.price)}
                </Text>
              </View>
              <Text style={styles.discountPercentage}>
                -{item?.variations[0]?.discount}%
              </Text>
              {/* <View style={styles.addContainer}>
        {existingItemIndex === -1 ? (
          <AddToCartBtn product={item} />
        ) : (
          <QuantityUpdater quantity={quantity} item={item} />
        )}
      </View> */}
            </View>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
});

export default DealOfDay;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 3,
  },
  productImage: {
    width: windowWidth / 3,
    height: windowWidth / 3,
    marginRight: 15,
    resizeMode: 'contain',
  },
  detailsContainer: {
    flex: 1,
    padding: 15,
  },
  productName: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 13,
  },
  productWeight: {
    color: '#000066',
    fontSize: 15,
    fontWeight: '700',
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
  discountPercentage: {
    color: '#ff6600',
    marginTop: 2,
    fontSize: 15,
  },
  addContainer: {
    flexDirection: 'row-reverse',
  },

  addButtonText: {
    color: '#fff',
  },
  callIconContainer: {
    // Style for your call icon container
  },
});
