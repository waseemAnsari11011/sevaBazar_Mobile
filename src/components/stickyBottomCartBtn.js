import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import ShoppingCartIcon from './cartIconWithNumTop';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, clearCart, increaseQuantity, decreaseQuantity } from '../config/redux/actions/cartActions';
import Icon from 'react-native-vector-icons/Ionicons';

const StickyButton = ({ navigation, product, variation }) => {
    const dispatch = useDispatch();
    const { cartItems } = useSelector((state) => state.cart);

    const cartItem = useMemo(() => {
        if (!variation) return null;
        return cartItems.find((item) => item._id === variation._id);
    }, [cartItems, variation]);

    const isItemInCart = !!cartItem;
    const currentQuantity = cartItem?.quantity || 0;

    const handleAddToCart = () => {
        if (!product || !variation) {
            Alert.alert('Error', 'Please select a variation first.');
            return;
        }

        // Check if cart has items from a different vendor
        if (cartItems.length > 0) {
            const currentVendorId = cartItems[0].vendor._id || cartItems[0].vendor;
            const newVendorId = product.vendor._id || product.vendor;

            if (currentVendorId !== newVendorId) {
                Alert.alert(
                    'Different Vendor',
                    'You can only order from one vendor at a time. Please clear your cart if you wish to order from this vendor.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { 
                            text: 'Clear Cart', 
                            style: 'destructive',
                            onPress: () => {
                                dispatch(clearCart());
                            } 
                        }
                    ]
                );
                return;
            }
        }

        const newCartItem = {
            _id: variation._id,
            productId: product._id, // Store parent product ID
            name: product.name,
            price: variation.price,
            discount: variation.discount,
            images: variation.images,
            vendor: product.vendor,
            quantity: 1,
            variations: [variation], // Store variation details
            arrivalDuration: variation.arrivalDuration || '4 Days', // Default or from variation
            isReturnAllowed: product.isReturnAllowed || false,
        };

        dispatch(addToCart(newCartItem));
    };

    const handleIncrease = () => {
        if (cartItem) {
            dispatch(increaseQuantity(cartItem._id));
        }
    };

    const handleDecrease = () => {
        if (cartItem) {
             dispatch(decreaseQuantity(cartItem._id));
        }
    };


    const handlePress = () => {
        if (!isItemInCart) {
            handleAddToCart();
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.cartContainer}>
                <ShoppingCartIcon />
                
                {isItemInCart ? (
                    <View style={[styles.button, styles.quantityContainer]}>
                        <TouchableOpacity onPress={handleDecrease} style={styles.qtyBtn}>
                             <Icon name="remove" size={24} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.qtyText}>{currentQuantity}</Text>
                        <TouchableOpacity onPress={handleIncrease} style={styles.qtyBtn}>
                             <Icon name="add" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity 
                        style={[styles.button, styles.addToCartButton]} 
                        onPress={handlePress}
                    >
                        <Text style={styles.text}>Add to Cart</Text>
                    </TouchableOpacity>
                )}

            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    cartContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderTopColor: "grey"
    },
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white'
    },
    button: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        borderRadius: 10,
        marginLeft: 20
    },
    addToCartButton: {
        backgroundColor: '#ff6600',
    },
    quantityContainer: {
        backgroundColor: '#2ecc71', // Or match theme color
        justifyContent: 'space-between',
        paddingHorizontal: 15
    },
    qtyBtn: {
        padding: 5,
    },
    qtyText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    text: {
        color: '#fff',
        marginLeft: 10,
        fontSize: 16,
        fontWeight: "700"
    },
});

export default StickyButton;
