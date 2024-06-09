import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const StickyComponent = ({ total, onCheckout, navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.cartContainer}>

                <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 10 }}>
                    <Text style={styles.totalPrice}>
                        Total Price
                        <Text style={styles.taxInfo}> (inc. VAT/TAX)</Text>
                    </Text>
                    <Text style={styles.Price}>
                    ₹{total}
                    </Text>
                </View>

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Checkout')}>
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
        backgroundColor: 'green',
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
        color: 'green', // Green color
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
        color: 'green', // Green color
        fontWeight: 'bold',
        fontSize: 15,
        // Add any additional styling as per the image
    },
});

export default StickyComponent;
