import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { formatCurrency } from '../utils/currency';

const StickyComponent = ({ total, onCheckout, navigation }) => {
    const dispatch = useDispatch();
    const { data } = useSelector(state => state.local);
    const userAddress = data?.user?.shippingAddresses?.find(addr => addr.isActive);


    const handleCheckout = () => {
        if (userAddress) {
            // Construct address string safely, filtering out undefined/null values
            const addressParts = [
                userAddress.address || userAddress.addressLine1,
                userAddress.addressLine2,
                userAddress.landmark,
                userAddress.city,
                userAddress.state,
                userAddress.postalCode || userAddress.pincode
            ].filter(part => part); // Remove empty/undefined parts

            const addressString = addressParts.join(', ');

            Alert.alert(
                "Confirm Delivery Address",
                `Do you want to deliver to:\n\n${addressString}`,
                [
                    {
                        text: "Change Location",
                        onPress: () => navigation.navigate('Location List', { isCheckOut: true }),
                        style: "cancel"
                    },
                    {
                        text: "Confirm",
                        onPress: () => navigation.navigate('Checkout')
                    }
                ]
            );
        } else {
            // If no address, proceed to checkout (which likely handles missing address) or address list
            navigation.navigate('Checkout');
        }
    };


    return (
        <View style={styles.container}>
            <View style={styles.cartContainer}>

                <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 10 }}>
                    <Text style={styles.totalPrice}>
                        Total Price
                        <Text style={styles.taxInfo}> (inc. VAT/TAX)</Text>
                    </Text>
                    <Text style={styles.Price}>
                        {total.toString().includes('₹') ? total : formatCurrency(total)}
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleCheckout}
                >
                    <Text style={styles.text}>Checkout</Text>
                </TouchableOpacity>

            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    cartContainer: {
        flexDirection: 'column',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
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
        flex: 1,
        backgroundColor: '#ff6600',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        borderRadius: 10,

    },
    text: {
        color: '#fff',
        marginLeft: 10,
        fontSize: 15,
        fontWeight: "700"
    },
    totalPrice: {
        color: '#000066', // Green color
        fontWeight: 'bold',
        fontSize: 15,
        // Add any additional styling as per the image
    },
    taxInfo: {
        fontStyle: 'italic',
        color: "grey"
        // Adjust the size or style if needed to match the image
    },
    Price: {
        color: '#000066', // Green color
        fontWeight: 'bold',
        fontSize: 18,
        // Add any additional styling as per the image
    },
});

export default StickyComponent;
