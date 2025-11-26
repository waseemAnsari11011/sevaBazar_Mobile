import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import ShoppingCartIcon from './cartIconWithNumTop';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, clearCart } from '../config/redux/actions/cartActions';

const StickyButton = ({ navigation, product, variation }) => {
    const dispatch = useDispatch();
    const { cartItems } = useSelector((state) => state.cart);

    const isItemInCart = useMemo(() => {
        if (!variation) return false;
        return cartItems.some((item) => item._id === variation._id);
    }, [cartItems, variation]);

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

        const cartItem = {
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

        dispatch(addToCart(cartItem));
        // Optional: Navigate to cart or show success message
        // navigation.navigate('Order'); 
    };

    const handlePress = () => {
        if (isItemInCart) {
            navigation.navigate('Order'); // Navigate to Cart Screen (assuming 'Order' is the route name for Cart)
        } else {
            handleAddToCart();
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.cartContainer}>
                <ShoppingCartIcon />
                <TouchableOpacity 
                    style={[styles.button, isItemInCart ? styles.goToCartButton : styles.addToCartButton]} 
                    onPress={handlePress}
                >
                    <Text style={styles.text}>
                        {isItemInCart ? 'Go to Cart' : 'Add to Cart'}
                    </Text>
                </TouchableOpacity>
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
    goToCartButton: {
        backgroundColor: '#2ecc71',
    },
    text: {
        color: '#fff',
        marginLeft: 10,
        fontSize: 16,
        fontWeight: "700"
    },
});

export default StickyButton;
