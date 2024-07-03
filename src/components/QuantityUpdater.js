import {StyleSheet, Text, View, TouchableOpacity, Alert, Dimensions} from 'react-native';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  addToCart,
  decreaseQuantity,
  increaseQuantity,
  removeItem,
} from '../config/redux/actions/cartActions';
const windowWidth = Dimensions.get('window').width;

const QuantityUpdater = ({quantity, item}) => {
  const dispatch = useDispatch();
  const showAlert = () => {
    Alert.alert(
      '',
      'Are you sure you want to order?',
      [
        {
          text: 'Cancel',
          // onPress: handleCancelButtonPress,
          style: 'cancel',
        },
        {text: 'OK', onPress: onPress},
      ],
      {cancelable: false},
    );
  };
  const handleIncreaseQuantity = index => {
    console.log('handleIncreaseQuantity');
    dispatch(increaseQuantity(index));
  };
  const handleDecreaseQuantity = index => {
    dispatch(decreaseQuantity(index));
  };
  const handleAddToCart = () => {
    dispatch(addToCart(item));
  };

  const handleRemoveItem = id => {
    dispatch(removeItem(id));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => handleDecreaseQuantity(item._id)}
        style={styles.button}>
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>
      <Text style={styles.quantityText}>{quantity}</Text>
      <TouchableOpacity onPress={() => handleAddToCart()} style={styles.button}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default QuantityUpdater;

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#ff6600',
  },
  quantityText: {
    color: '#ff6600',
    fontSize: 16,
    marginHorizontal: 10,
  },
  button: {
    width: '40%',
    // backgroundColor: 'pink',
  },
  container: {
    padding: 3,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ff6600',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width:windowWidth/4
  },
});
