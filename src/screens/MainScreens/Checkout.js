import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import AddressTypeSelector from '../../components/SelectAddress';
import Icon from '../../components/Icons/Icon';
import StickyButton from '../../components/stickyBottomCartBtn';
import StickyProceedButton from '../../components/StickyProceed';
import {useDispatch, useSelector} from 'react-redux';
import api, {baseURL} from '../../utils/api';
import calculateDiscountedPrice from '../../utils/calculateDiscountedPrice';
import QuantityUpdater from '../../components/QuantityUpdater';
import {clearCart} from '../../config/redux/actions/cartActions';
import Loading from '../../components/Loading';
import RazorpayCheckout from 'react-native-razorpay';
import {RadioButton} from 'react-native-paper';
import {getProductById} from '../../config/redux/actions/productAction';

const windowWidth = Dimensions.get('window').width;

const CheckoutScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {data} = useSelector(state => state?.local);
  const {cartItems} = useSelector(state => state.cart);
  const subtotalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const [loading, setloading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const placeOrder = async orderData => {
    try {
      const response = await api.post('/order', orderData);
      return response.data;
    } catch (error) {
      // console.error('Error placing order:', error.response);
      if (error.response && error.response.data && error.response.data.error) {
        alert(`Error: ${error.response.data.error}`);
      } else {
        alert('An unexpected error occurred. Please try again.');
      }
      throw error;
    }
  };

  const placeOrderRazorPay = async orderData => {
    try {
      const response = await api.post('/razorpay', orderData);
      return response.data;
    } catch (error) {
      // console.error('Error placing order::', error.response.data.error);
      if (error.response && error.response.data && error.response.data.error) {
        alert(`Error: ${error.response.data.error}`);
      } else {
        alert('An unexpected error occurred. Please try again.');
      }
      throw error;
    }
  };

  const handlePlaceOrderCod = () => {
    setloading(true);
    const orderData = {
      customer: data?.user?._id, // Replace with actual customer ID
      vendors: [],
      shippingAddress:
        data?.user?.shippingAddresses.find(address => address.isActive) || null,
    };

    // Group products by vendor
    const vendorMap = {};

    cartItems.forEach(item => {
      if (!vendorMap[item.vendor]) {
        vendorMap[item.vendor] = {
          vendor: item.vendor,
          products: [],
          orderStatus: 'Pending',
        };
      }
      vendorMap[item.vendor].products.push({
        product: item.productId, // Use the parent product ID
        quantity: item.quantity,
        price: item.price,
        discount: item.discount,
        variations: item.variations,
      });
    });

    // Convert vendorMap to an array
    orderData.vendors = Object.values(vendorMap);

    placeOrder(orderData)
      .then(savedOrder => {
        setloading(false);
        dispatch(clearCart());
        Alert.alert('Success', 'Order Placed Successfully!', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home'),
          },
        ]);
      })
      .catch(error => {
        console.log('error---->>>', error);
        // Handle error
        setloading(false);
      })
      .finally(f => {
        setloading(false);
      });
  };

  const handlePlaceOrderRazorpay = () => {
    setloading(true);
    const orderData = {
      customer: data?.user?._id, // Replace with actual customer ID
      vendors: [],
      shippingAddress:
        data?.user?.shippingAddresses.find(address => address.isActive) || null,
    };

    // Group products by vendor
    const vendorMap = {};

    cartItems.forEach(item => {
      if (!vendorMap[item.vendor]) {
        vendorMap[item.vendor] = {
          vendor: item.vendor,
          products: [],
          orderStatus: 'Pending',
        };
      }
      vendorMap[item.vendor].products.push({
        product: item.productId, // Use the parent product ID
        quantity: item.quantity,
        price: item.price,
        discount: item.discount,
        variations: item.variations,
      });
    });

    // Convert vendorMap to an array
    orderData.vendors = Object.values(vendorMap);

    placeOrderRazorPay(orderData)
      .then(savedOrder => {
        const {order, razorpayOrder} = savedOrder;

        const options = {
          description: 'Payment for Order',
          image:
            'https://drive.usercontent.google.com/download?id=1CKEbD5wlr531VVQwTazEuqky7ONA9MFU&authuser=0',
          currency: razorpayOrder.currency,
          key: 'rzp_test_nEIzO6bfk1HLkL', // Your Razorpay API key
          amount: razorpayOrder.amount,
          name: 'Seva Bazar',
          order_id: razorpayOrder.id, // Razorpay order ID
          prefill: {
            email: 'email@example.com',
            contact: '9191919191',
            name: 'React Native Developer',
          },
          theme: {color: '#F37254'},
        };

        RazorpayCheckout.open(options)
          .then(async paymentSuccess => {
            const verifyBody = {
              orderId: order._id,
              razorpay_payment_id: paymentSuccess.razorpay_payment_id,
              razorpay_order_id: razorpayOrder.id,
              razorpay_signature: paymentSuccess.razorpay_signature,
              vendors: Object.values(vendorMap),
            };
            console.log('verifyBody-->>', verifyBody);

            const response = await api.post(
              '/razorpay-verify-payment',
              verifyBody,
            );
            // console.log("response razorpay-verify-payment", response)
            Alert.alert(
              'Payment Successful',
              `Payment ID: ${paymentSuccess.razorpay_payment_id}`,
            );
          })
          .catch(async paymentError => {
            console.log('paymentError-->>', paymentError);
            Alert.alert('Payment Failed', `Error: ${paymentError.description}`);
            // await api.post('/razorpay-verify-payment', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({
            //         orderId: order._id,
            //         paymentId: null,
            //         status: 'failed'
            //     })
            // });
          });

        setloading(false);
        dispatch(clearCart());
        navigation.navigate('Home');
      })
      .catch(error => {
        // Handle error
        setloading(false);
      })
      .finally(f => {
        setloading(false);
      });
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === 'online') {
      handlePlaceOrderRazorpay();
    } else {
      handlePlaceOrderCod();
    }
  };

  function adjustDuration(duration) {
    const currentDay = new Date().getDay(); // 0 = Sunday

    console.log('currentDay-->>', currentDay);

    if (currentDay === 0) {
      // Check if today is Sunday
      if (duration === '4 Days') {
        return '5 Days';
      }
    }

    return duration; // Return the original duration if no adjustments are needed
  }

  const renderCartItem = ({item, index}) => {
    return (
      <View
        style={[
          summarystyles.cartItem,
          cartItems.length - 1 === index && {marginBottom: 15},
        ]}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {item?.images?.length === 0 && (
            <Image
              source={{
                uri: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM4sEG5g9GFcy4SUxbzWNzUTf1jMISTDZrTw&s`,
              }} // Replace with your image url
              style={summarystyles.productImage}
            />
          )}
          {item?.images?.length !== 0 && (
            <Image
              source={{uri: item?.images[0]}}
              style={summarystyles.productImage}
            />
          )}
          <View style={summarystyles.detailsContainer}>
            <Text style={summarystyles.productName}>{item.name}</Text>
            {item.variations[0]?.attributes?.map((attr, i) => (
              <Text key={i} style={summarystyles.productWeight}>
                {attr.name}: {attr.value}
              </Text>
            ))}
            <View style={summarystyles.priceContainer}>
              <Text style={summarystyles.discountedPrice}>
                ₹{calculateDiscountedPrice(item.price, item.discount).discountedPrice}
              </Text>
              <Text style={summarystyles.originalPrice}>₹{item.price}</Text>
            </View>
            <Text style={summarystyles.discountPercentage}>
              -{item.discount}%
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: 'black',
                marginLeft: 8,
                fontWeight: '600',
                marginTop: 10,
              }}>
              Delivery Time : {adjustDuration(item.arrivalDuration)}
            </Text>

            {item.isReturnAllowed && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 15,
                  borderTopWidth: 0.8,
                  borderTopColor: 'grey',
                  paddingTop: 10,
                }}>
                <Icon.FontAwesome6
                  name="people-carry-box"
                  size={25}
                  color={'#ff6600'}
                />
                <Text
                  style={{
                    width: windowWidth - 220,
                    marginLeft: 10,
                    fontWeight: '700',
                    color: 'black',
                  }}>
                  Hand-To-Hand Return Policy on this Product
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={{padding: 15}}>
      <View style={[styles.cardcontainer]}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.header}>Shipping Address</Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Location List', {isCheckOut: true})
            }>
            {/* <Icon.AntDesign name="edit" size={20} color={'#ff6600'} /> */}
            <Text
              style={{
                color: '#ff6600',
                fontWeight: '600',
                padding: 10,
                borderWidth: 1,
                borderRadius: 5,
                borderColor: '#ff6600',
              }}>
              Edit Address
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 15,
            borderTopWidth: 0.8,
            borderTopColor: 'grey',
            paddingTop: 10,
          }}>
          <Icon.Ionicons name="location" size={25} color={'#ff6600'} />
          <Text style={styles.addressContent}>
            {
              data?.user?.shippingAddresses.find(address => address.isActive)
                ?.address
            }
          </Text>
        </View>
      </View>
      <View style={{marginTop: 22, paddingBottom: 0, marginBottom: 10}}>
        <Text style={{fontSize: 15, fontWeight: '600', color: 'black'}}>
          Order Summary
        </Text>
      </View>
    </View>
  );

  const renderFooter = () => {
    // Calculate the subtotal
    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    // Calculate the total discount
    const totalDiscount = cartItems.reduce(
      (acc, item) => acc + item.price * (item.discount / 100) * item.quantity,
      0,
    );

    // Define the shipping fee (assuming a constant value)
    const shippingFee = 20.0;

    // Define the tax (assuming no tax for simplicity)
    const tax = 0.0;

    // Calculate the total
    const total = subtotal + shippingFee + tax - totalDiscount;

    return (
      <View style={footerStyles.container}>
        <View style={footerStyles.row}>
          <Text style={footerStyles.label}>
            Sub Total({cartItems.length} items)
          </Text>
          <Text style={footerStyles.value}>₹{subtotal.toFixed(2)}</Text>
        </View>
        <View style={footerStyles.row}>
          <Text style={footerStyles.label}>Shipping Fee</Text>
          <Text style={footerStyles.value}>₹{shippingFee.toFixed(2)}</Text>
        </View>
        <View style={footerStyles.row}>
          <Text style={footerStyles.label}>Discount</Text>
          <Text style={footerStyles.value}>₹{totalDiscount.toFixed(2)}</Text>
        </View>
        <View style={footerStyles.row}>
          <Text style={footerStyles.label}>Tax</Text>
          <Text style={footerStyles.value}>₹{tax.toFixed(2)}</Text>
        </View>
        <View style={[footerStyles.row, footerStyles.totalRow]}>
          <Text style={footerStyles.label}>Total</Text>
          <Text style={footerStyles.value}>₹{total.toFixed(2)}</Text>
        </View>
      </View>
    );
  };

  return (
    <>
      {loading && <Loading />}
      <View style={{padding: 16}}>
        <Text style={{color: 'black', fontSize: 18, marginBottom: 10}}>
          Select Payment Method:
        </Text>
        <RadioButton.Group
          onValueChange={value => setPaymentMethod(value)}
          value={paymentMethod}>
          {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <RadioButton value="online" />
            <Text style={{fontSize: 16}}>Online Payment</Text>
        </View> */}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <RadioButton value="cod" />
            <Text
              style={{
                fontSize: 16,
                color: 'black',
                marginLeft: 8,
                fontWeight: '600',
              }}>
              Cash on Delivery (COD)
            </Text>
          </View>
        </RadioButton.Group>
      </View>

      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
      />

      <StickyProceedButton
        navigation={navigation}
        PlaceOrderFunc={handlePlaceOrder}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF50',
    paddingBottom: 100,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 5,
  },
  cardcontainer: {
    padding: 20,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 0,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#ff6600',
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    position: 'absolute',
    bottom: 0,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  addressContent: {
    width: windowWidth - 100,
    marginLeft: 10,
    fontWeight: '500',
  },
});

const footerStyles = StyleSheet.create({
  container: {
    marginBottom: 150,
    paddingHorizontal: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  label: {
    fontSize: 15,
    color: 'grey',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: 'grey',
    paddingTop: 10,
  },
});

const summarystyles = StyleSheet.create({
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
    backgroundColor: 'white',
  },
  title: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 18,
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
    fontSize: 13,
  },
  productWeight: {
    color: '#666',
    fontSize: 13,
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
    marginLeft: 8,
    fontSize: 15,
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
  productImage: {
    width: windowWidth / 3,
    height: windowWidth / 3,
    marginRight: 15,
    resizeMode: 'contain',
  },
});

export default CheckoutScreen;
