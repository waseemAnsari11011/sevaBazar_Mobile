import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Image,
  Dimensions
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import QuantityUpdater from '../../components/QuantityUpdater';
import StickyCheckoutBtn from '../../components/StickyCheckoutBtn';
import { baseURL } from '../../utils/api';
import calculateDiscountedPrice from '../../utils/calculateDiscountedPrice';
import Icon from '../../components/Icons/Icon';
import { removeItem } from '../../config/redux/actions/cartActions';

const windowWidth = Dimensions.get('window').width;

const OrdersScreen = ({ navigation }) => {
  const dispatch = useDispatch()
  const { cartItems, timer } = useSelector(state => state.cart);

  const totalPrice = cartItems?.reduce(
    (total, item) => total + calculateDiscountedPrice(item.price, item.discount) * item.quantity,
    0,
  );

  // useEffect(() => {
  //   console.log("quantity updated")
  // console.log("cartItems-->>", cartItems)

  // }, [cartItems]);


  const handleDelete = (item) => {
    dispatch(removeItem(item._id))
  };


  const renderCartItem = ({ item, index }) => {
    return (
      <View style={[styles.cartItem, cartItems.length - 1 === index && { marginBottom: 250 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {item?.images?.length === 0 && <Image
            source={{ uri: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM4sEG5g9GFcy4SUxbzWNzUTf1jMISTDZrTw&s` }} // Replace with your image url
            style={styles.productImage}
          />}
          {item?.images?.length !== 0 && <Image source={{ uri: `${baseURL}${item?.images[0]}` }} style={styles.productImage} />}
          <View style={styles.detailsContainer}>
            <Text style={styles.productName}>{item.name}</Text>
            {/* <Text style={styles.productWeight}>100 g</Text> */}
            <View style={styles.priceContainer}>
              <Text style={styles.discountedPrice}>₹{calculateDiscountedPrice(item.price, item.discount)}</Text>
              <Text style={styles.originalPrice}>₹{item.price}</Text>
            </View>
            <Text style={styles.discountPercentage}>-{item.discount}%</Text>
            <View style={styles.addContainer}>
              <QuantityUpdater quantity={item.quantity} item={item} />
              <TouchableOpacity onPress={() => handleDelete(item)}>
                <Icon.AntDesign name="delete" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </View>
    );
  };

  const renderEmptyCart = () => {
    return (
      <View style={styles.emptyCart}>
        <Image
          source={require('../../assets/images/empty_cart.gif')}
          style={{ height: 200, width: 200 }}
        />
        <Text style={styles.emptyCartText}>Your cart is empty</Text>
      </View>
    );
  };

  const handleCountdownFinish = () => {
    console.log('Placing order...');
    // Place order logic here
  };



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F0F8FF50' }}>
      <View style={styles.container}>
        {cartItems?.length > 0 ? (
          <View style={styles.cartList}>
            <FlatList
              data={cartItems}
              renderItem={renderCartItem}
              keyExtractor={(item, index) => index.toString()}
            />

          </View>
        ) : (
          renderEmptyCart()
        )}
      </View>
      {cartItems.length > 0 && <StickyCheckoutBtn total={totalPrice.toFixed(2)} navigation={navigation} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF50',

  },
  cartList: {
    flex: 1,
    // alignItems: 'center',
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: 'white'
  },
  title: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 18
  },
  price: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '700',
  },
  quantity: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  button: {
    backgroundColor: '#ddd',
    borderRadius: 20,
    width: 30,
  },
  buttonText: {
    fontSize: 20,
    textAlign: 'center',
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 20,
  },
  placeOrderButton: {
    backgroundColor: '#1abc9c',
    borderRadius: 10,
    paddingVertical: 15,
  },
  placeOrderButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyCart: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  detailsContainer: {
    flex: 1,
  },
  productName: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 13
  },
  productWeight: {
    color: '#666',
    fontSize: 13
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
    marginLeft: 8,
    fontSize: 15
  },
  discountPercentage: {
    color: 'green',
    marginTop: 2,
    fontSize: 15
  },
  addContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10
  },

  addButtonText: {
    color: '#fff',
  },
  callIconContainer: {
    // Style for your call icon container
  },
  productImage: {
    width: windowWidth / 3,
    height: windowWidth / 3,
    marginRight: 15,
    resizeMode: "contain"
  }
});

export default OrdersScreen;
