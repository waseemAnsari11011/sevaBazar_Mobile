import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert, TextInput, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { createChatOrder } from '../../../config/redux/actions/chatOrderActions';
import ButtonComponent from '../../../components/Button';
import Loading from '../../../components/Loading';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../../components/Icons/Icon';
// import { TextInput as PaperTextInput, DefaultTheme } from 'react-native-paper'; // Import DefaultTheme from react-native-paper

const Chat = () => {
    const [orderMessage, setOrderMessage] = useState('');
    const dispatch = useDispatch();
    const { data } = useSelector(state => state?.local);
    const { loading } = useSelector(state => state?.chatOrder);
    const customer = data?.user;
    const navigation = useNavigation();

    const handleSendOrder = async () => {
        try {
            if (orderMessage.trim() === '') {
                Alert.alert('Error', 'Please enter an order message');
                return;
            }

            const orderData = {
                orderMessage,
                customer: customer?._id,
                name: customer?.name,
                shippingAddress: data?.user?.shippingAddresses.find(address => address.isActive) || null,
                paymentStatus: 'Unpaid',
            };

            await dispatch(createChatOrder(orderData));
            setOrderMessage('');
            Alert.alert('Success', 'Order Placed Successfully!', [
                {
                    text: 'OK',
                    onPress: () => navigation.navigate('My order', { screen: 'Chat Orders' }),
                },
            ]);

        } catch (error) {
            Alert.alert('Error', 'Error occurred while placing order');
        }
    };

    return (
        <View style={styles.container}>
            {loading && <Loading />}
            <View style={styles.content}>
                <Text style={styles.header}>Place Your Order</Text>
                <View style={[styles.cardcontainer,]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.header}>Shipping Address</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('Location List', { isCheckOut: true })}>
                            <Text style={{ color: "#ff6600", fontWeight: "600", padding: 10, borderWidth: 1, borderRadius: 5, borderColor: '#ff6600' }}>Edit Address</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15, borderTopWidth: 0.8, borderTopColor: 'grey', paddingTop: 10 }}>
                        <Icon.Ionicons name="location" size={25} color={'#ff6600'} />
                        <Text style={styles.addressContent}>{data?.user?.shippingAddresses.find(address => address.isActive)?.address}</Text>
                    </View>
                </View>
                <TextInput
                    placeholder="Type your order here..."
                    mode="outlined"
                    multiline
                    value={orderMessage}
                    onChangeText={setOrderMessage}
                    style={styles.input}
                // theme={{ colors: { primary: '#000066' } }} // Set text color to dark blue (#000066)
                />

               
            </View>
            <View style={styles.buttonContainer}>
                <ButtonComponent title="Send Order" color='#ff6600' onPress={handleSendOrder} />
            </View>
        </View>
    );
};

export default Chat;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
        justifyContent: 'space-between', // Aligns items along the main axis (vertically in this case)
    },
    content: {
        flex: 1, // Take up remaining space
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    input: {
        height: 150,
        marginVertical: 8,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: "#000066"
    },
    buttonContainer: {
        marginBottom: 16, // Adjust spacing from bottom as needed
    },
    cardcontainer: {
        marginVertical:20,

        padding: 20,
        margin: 5,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    header: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
        marginLeft: 5
    },
});
