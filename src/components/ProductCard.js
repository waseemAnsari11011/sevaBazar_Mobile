import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import Icon from './Icons/Icon';
import { baseURL } from '../utils/api';

const ProductCard = ({ item }) => {
    return (
        <View style={[styles.cardContainer]}>
            <View style={styles.discountTag}>
                <Text style={styles.discountText}>-{item.discount}%</Text>
            </View>
            {/* <TouchableOpacity style={styles.favoriteIcon}>
                <View style={styles.icon_container}>
                    <View style={styles.icon_circle}>
                        <Icon.Feather name="heart" size={24} color="green" />
                    </View>
                </View>
            </TouchableOpacity> */}
            {item?.images?.length > 0 && <Image
                source={{ uri: `${baseURL}${item?.images[0]}` }} // Replace with your image url
                style={styles.productImage}
            />}
            {item?.images?.length === 0 && <Image
                source={{ uri: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM4sEG5g9GFcy4SUxbzWNzUTf1jMISTDZrTw&s` }} // Replace with your image url
                style={styles.productImage}
            />}
            <View style={{ padding: 10 }}>
                {/* <View style={styles.ratingContainer}>
                    <Icon.FontAwesome name="star" size={13} color="#FDCC0D" />
                    <Text style={styles.ratingText}>{item.rating} ({item.count})</Text>
                </View> */}
                <Text numberOfLines={2} ellipsizeMode="tail" style={styles.productName}>
                    {item?.name}
                </Text>
                <View style={styles.priceContainer}>
                    <Text style={styles.originalPrice}>₹{item.price}</Text>
                    <Text style={styles.discountedPrice}>₹{item.discountPrice}</Text>
                </View>
            </View>

        </View>
    );
};

const windowWidth = Dimensions.get('window').width;
const itemWidth = (windowWidth - 50) / 2; // Calculate width for two items with margin

const styles = StyleSheet.create({
    cardContainer: {
        width: itemWidth,
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        marginBottom: 10,
    },
    discountTag: {
        position: 'absolute',
        top: 10,
        left: 0,
        backgroundColor: 'green',
        paddingVertical: 4,
        paddingHorizontal: 15,
        borderTopEndRadius: 6,
        borderBottomEndRadius: 6,
        zIndex: 100
    },
    discountText: {
        color: '#fff',
        fontSize: 14,
    },
    favoriteIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 100
        // Icon styling here
    },
    productImage: {
        aspectRatio: 1, // Maintain aspect ratio
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    ratingText: {
        fontSize: 13,
        color: '#777',
        marginLeft: 5
    },
    productName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#333',
        marginTop: 5,
        width: itemWidth - 15
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    originalPrice: {
        fontSize: 13,
        color: '#777',
        textDecorationLine: 'line-through',
    },
    discountedPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    icon_container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 25,
        zIndex: 20
    },
    icon_circle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'green',
        zIndex: 20
    },
});

export default ProductCard;
