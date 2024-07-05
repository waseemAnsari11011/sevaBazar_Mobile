import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { createChatOrder } from '../../../config/redux/actions/chatOrderActions';
import ButtonComponent from '../../../components/Button';
import Loading from '../../../components/Loading';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook

const Chat = () => {
    const [orderMessage, setOrderMessage] = useState('');
    const dispatch = useDispatch();
    const { data } = useSelector(state => state?.local);
    const { loading, error, orders } = useSelector(state => state?.chatOrder);
    const customer = data?.user;
    const navigation = useNavigation(); // Navigation hook

    const handleSendOrder = async () => {
        try {
            if (orderMessage.trim() === '') {
                Alert.alert('Error', 'Please enter an order message');
                return;
            }

            const orderData = {
                orderMessage,
                customer: customer?._id,
                name: customer?.name, // Replace with actual name or get from user state
                shippingAddress: data?.user?.shippingAddresses,
                paymentStatus: 'Unpaid',
            };

            await dispatch(createChatOrder(orderData));
            setOrderMessage('');
            Alert.alert('Success', 'Order Placed Successfully!', [
                {
                    text: 'OK',
                    onPress: () => navigation.navigate('My order', { screen: 'Chat Orders' }), // Navigate to Chat Orders tab
                },
            ]);

        } catch (error) {
            Alert.alert('Error', 'Error occurred while placing order');
        }
    };

    return (
        <View style={styles.container}>
            {loading && <Loading />}
            <Text style={styles.header}>Place Your Order</Text>
            <TextInput
                style={[styles.input, { height: Math.max(40, 40 + (orderMessage.length * 2)) }]}
                multiline
                placeholder="Type your order here..."
                value={orderMessage}
                onChangeText={setOrderMessage}
            />

            <ButtonComponent title="Send Order" color='#ff6600' onPress={handleSendOrder} />
        </View>
    );
};

export default Chat;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
    },
});
