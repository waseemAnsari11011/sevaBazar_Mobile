import React from 'react';
import {View, Text, StyleSheet, ImageBackground, TouchableOpacity} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {useSelector} from 'react-redux';
import QuantityUpdater from './QuantityUpdater';
import Icon from './Icons/Icon';
import AddToCartBtn from './AddToCartBtn';

const Card = ({id, title, image, onPress, price, navigation, cartItem}) => {
  const {cartItems} = useSelector(state => state.cart);

  const existingItemIndex = cartItems.findIndex(item => item.id === id);

  const quantity =
    existingItemIndex !== -1 ? cartItems[existingItemIndex].quantity : 0;

  console.log('cartItem===>', cartItem);

  return (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Details', {
            cartItem,
          })
        }>
        <ImageBackground
          source={image ? {uri: image} : require('../assets/images/food2.jpeg')}
          style={styles.image}>
          <View style={styles.imageOverlay} />

          <Text style={styles.title}>{title}</Text>
        </ImageBackground>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.text}>${price}</Text>
        {existingItemIndex === -1 ? (
          <AddToCartBtn onPress={onPress} />
        ) : (
          <QuantityUpdater quantity={quantity} item={cartItem} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    overflow: 'hidden',
    shadowOffset: {width: -2, height: 4},
    shadowColor: '#171717',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  image: {
    height: 200,
    resizeMode: 'cover',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  icon: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  content: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 19,
    fontWeight: '700',
  },
});

export default Card;
