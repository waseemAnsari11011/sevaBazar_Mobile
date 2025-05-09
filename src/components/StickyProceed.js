import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ShoppingCartIcon from './cartIconWithNumTop';
import { clearCart } from '../config/redux/actions/cartActions';
import { useDispatch } from 'react-redux';

const StickyProceedButton = ({PlaceOrderFunc}) => {
    const dispatch = useDispatch()

    return (
        <View style={styles.container}>
            <View style={styles.cartContainer}>
                <TouchableOpacity style={styles.button} onPress={PlaceOrderFunc}>
                    <Text style={styles.text}>Proceed</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};


const styles = StyleSheet.create({
    cartContainer: {
        flex:1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal:20,
        paddingVertical:10,
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
        borderTopWidth:1,
        borderRightWidth:1,
        borderLeftWidth:1,
        borderTopColor:"grey"
    },
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor:'white'
    },
    button: {
        flex:2,
        backgroundColor: '#ff6600',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        borderRadius:10,
       
    },
    text: {
        color: '#fff',
        marginLeft: 10,
        fontSize:15,
        fontWeight:"700"
    },
});

export default StickyProceedButton;
