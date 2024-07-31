import React from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import { Card, Paragraph, Button } from 'react-native-paper';
import Icon from '../../../components/Icons/Icon';
import { fetchOrdersByCustomerId, updateOrderStatus } from '../../../config/redux/actions/orderActions';
import { useDispatch, useSelector } from 'react-redux';
import { getTimeRemaining, handleDownloadInvoice } from './utils';
import ButtonComponent from '../../../components/Button';
import OutlinedBtn from '../../../components/OutlinedBtn';


const OrderItem = ({ order, navigation }) => {
    const { data } = useSelector(state => state.local);
    const customerId = data.user._id;
    const dispatch = useDispatch();

    // console.log("order-->>", order)

    const createdAtDate = new Date(order.createdAt);
    const formattedCreatedDate = `${createdAtDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} ${createdAtDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return '#FFA500'; // Orange
            case 'Processing':
                return '#0000FF'; // Blue
            case 'Shipped':
                return '#1E90FF'; // Dodger Blue
            case 'Delivered':
                return '#32CD32'; // Lime Green
            case 'Cancelled':
                return '#FF0000'; // Red
            default:
                return '#000000'; // Black
        }
    };

    const handleCancelOrder = async (orderId, vendorId) => {
        try {
            await dispatch(updateOrderStatus(orderId, vendorId, { newStatus: "Cancelled" }));
            await dispatch(fetchOrdersByCustomerId(customerId)); // Assuming customerId is accessible here
        } catch (error) {
            console.error('Error cancelling order:', error);
            // Handle error as needed, like showing a toast or message to the user
        }
    };



    return (
        <Card style={styles.orderContainer}>
            <Card.Content>
                <Paragraph style={styles.orderId}><Icon.FontAwesome name="barcode" size={16} /> Order ID: {order.orderId}</Paragraph>
                <Paragraph style={styles.orderId}><Icon.AntDesign name="calendar" size={16} /> Ordered On: {formattedCreatedDate}</Paragraph>

                {order?.vendors.length > 0 && order?.vendors?.map((vendorItem) => (
                    <View key={vendorItem?.vendor?._id} style={styles.vendorContainer}>
                        <Paragraph style={[styles.orderStatus, { color: getStatusColor(vendorItem.orderStatus), fontWeight: 'bold' }]}>
                            <Icon.FontAwesome name="info-circle" size={16} /> Order Status: {vendorItem.orderStatus}
                        </Paragraph>
                        {vendorItem.orderStatus !== 'Cancelled' && vendorItem.orderStatus !== 'Delivered' && vendorItem.orderStatus !== 'Shipped' && (
                            <View style={{ marginVertical: 5 }}>
                                <OutlinedBtn buttonWidth={160} textColor={'red'} borderColor={'red'} onPress={() => handleCancelOrder(order._id, vendorItem.vendor._id)} />

                            </View>
                        )}

                        {vendorItem.products.map((productItem) => {
                            const { timeString, isCritical } = getTimeRemaining(productItem.arrivalAt);

                            return (
                                <TouchableOpacity key={productItem._id} style={styles.productContainer} onPress={() =>
                                    navigation.navigate('Details', { product: productItem?.product })
                                  }>
                                    <Paragraph style={styles.productName}><Icon.FontAwesome name="cube" size={16} /> Product: {productItem?.product?.name}</Paragraph>
                                    <Paragraph style={[styles.orderId, isCritical ? styles.critical:styles.notcritical]}>
                                        <Icon.AntDesign name="clockcircleo" size={16} /> Delivery Time: {timeString}
                                    </Paragraph>
                                    <Paragraph style={styles.productDetails}><Icon.FontAwesome name="sort-numeric-asc" size={16} /> Quantity: {productItem?.quantity}</Paragraph>
                                    <Paragraph style={styles.productDetails}><Icon.FontAwesome name="dollar" size={16} /> Price: ₹{productItem?.price}</Paragraph>
                                    <Paragraph style={styles.productDetails}><Icon.FontAwesome name="percent" size={16} /> Discount: {productItem?.discount}%</Paragraph>
                                    <Paragraph style={styles.productDetails}><Icon.FontAwesome name="calculator" size={16} /> Total Amount: ₹{productItem?.totalAmount.toFixed(2)}</Paragraph>
                                    {productItem.variations.map((variation, index) => (
                                        <Paragraph key={index} style={styles.productDetails}>
                                            <Icon.FontAwesome name="tag" size={16} /> {variation.attributes.selected}: {variation.attributes.value}
                                        </Paragraph>
                                    ))}
                                </TouchableOpacity>
                            );
                        })}


                        <Paragraph style={styles.productDetails}><Icon.FontAwesome name="truck" size={16} /> Delivery: ₹{20}</Paragraph>
                    </View>
                ))}
                <View style={styles.shippingContainer}>
                    <Paragraph style={styles.shippingTitle}><Icon.FontAwesome name="truck" size={16} /> Shipping Address:</Paragraph>
                    <Paragraph style={styles.shippingDetails}><Icon.FontAwesome name="map-marker" size={16} /> {order.shippingAddress.address}</Paragraph>
                    <Paragraph style={styles.shippingDetails}>{order.shippingAddress.city}, {order.shippingAddress.state}</Paragraph>
                    <Paragraph style={styles.shippingDetails}>{order.shippingAddress.country} - {order.shippingAddress.postalCode}</Paragraph>
                </View>
                <View style={{ marginTop: 5 }}>
                    <ButtonComponent
                        title={'Download Invoice'}
                        color={'#ff6600'}

                        onPress={() => handleDownloadInvoice(order)}
                        style={styles.downloadButton}
                    />
                </View>


            </Card.Content>
        </Card>
    );
};

export default OrderItem;

const styles = StyleSheet.create({
    orderContainer: {
        marginHorizontal: 15,
        marginVertical: 15,
        borderRadius: 8,
        backgroundColor: '#fff',
        elevation: 3,
    },
    orderId: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    downloadButton: {
        marginTop: 10
    },
    vendorContainer: {
        marginBottom: 8,
    },
    vendorName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    orderStatus: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    productContainer: {
        marginLeft: 16,
        marginBottom: 8,
    },
    productName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    productDetails: {
        fontSize: 14,
        color: '#666',
    },
    shippingContainer: {
        marginTop: 16,
    },
    critical: {
        color: 'red',
    },
    notcritical: {
        color: 'green',
    },
    shippingTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333',
    },
    shippingDetails: {
        fontSize: 14,
        color: '#666',
    },
    cancelButton: {
        marginVertical: 5,
        alignSelf: 'flex-start',
    },
});
