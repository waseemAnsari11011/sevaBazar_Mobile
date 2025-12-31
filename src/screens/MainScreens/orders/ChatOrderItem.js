import React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { Card, Paragraph, Button } from 'react-native-paper';
import Icon from '../../../components/Icons/Icon';
import { getChatOrdersByCustomer, updateChatOrderStatus } from '../../../config/redux/actions/chatOrderActions';
import { useDispatch, useSelector } from 'react-redux';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import FileViewer from 'react-native-file-viewer';
import { getTimeRemaining, handleChatDownloadInvoice } from './utils';
import OutlinedBtn from '../../../components/OutlinedBtn';
import ButtonComponent from '../../../components/Button';


const ChatOrderItem = ({ order, contact }) => {
    const dispatch = useDispatch()
    const { data } = useSelector(state => state.local);
    const customerId = data.user._id; // Replace with actual customer ID or pass as a prop

    const createdAtDate = new Date(order.createdAt);
    const formattedCreatedDate = `${createdAtDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} ${createdAtDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;

    const getStatusColor = (status) => {
        switch (status) {
            case 'In Review':
                return '#ff6600'; // Orange
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

    const handleCancelOrder = async (orderId) => {
        try {
            await dispatch(updateChatOrderStatus(orderId, "Cancelled"));
            await dispatch(getChatOrdersByCustomer(customerId)); // Assuming customerId is accessible here
        } catch (error) {
            console.error('Error cancelling order:', error);
            // Handle error as needed, like showing a toast or message to the user
        }
    };


    const { timeString, isCritical, totalMinutes } = getTimeRemaining(order.arrivalAt);

    return (
        <Card style={styles.orderContainer}>
            <Card.Content>
                <Paragraph style={styles.orderId}><Icon.FontAwesome name="barcode" size={16} /> Order ID: {order.orderId}</Paragraph>
                <Paragraph style={styles.orderId}><Icon.AntDesign name="calendar" size={16} /> Ordered On: {formattedCreatedDate}</Paragraph>
                {order.orderStatus!=='Delivered'&&<Paragraph style={[styles.orderId, isCritical ? styles.critical : styles.notcritical]}><Icon.AntDesign name="clockcircleo" size={16} /> Delivery Time: {
                    ['In Review', 'Pending', 'Processing'].includes(order.orderStatus)
                        ? "10-15 min"
                        : timeString
                }</Paragraph>}

                <Paragraph style={[styles.orderStatus, { color: getStatusColor(order.orderStatus), fontWeight: 'bold' }]}>
                    <Icon.FontAwesome name="info-circle" size={16} /> Order Status:
                    {order.orderStatus === 'Delivered'
                        ? ` Delivered within ${order.deliveredInMin} minutes`
                        : ` ${order.orderStatus}`}
                </Paragraph>

                {order.orderStatus !== 'Cancelled' && order.orderStatus !== 'Delivered' && order.orderStatus !== 'Shipped' && (
                    <OutlinedBtn buttonWidth={160} textColor={'red'} borderColor={'red'} onPress={() => handleCancelOrder(order._id)} />

                    // <Button
                    //     mode="outlined"
                    //     onPress={() => handleCancelOrder(order._id)}
                    //     style={styles.cancelButton}
                    // >
                    //     Cancel Order
                    // </Button>
                )}
                <Paragraph style={styles.orderId}><Icon.FontAwesome name="comment" size={16} /> Order Message: {order.orderMessage}</Paragraph>
                {/* Breakdown Section */}
                <View style={styles.breakdownContainer}>
                    <Paragraph style={styles.breakdownTitle}>Payment Details</Paragraph>
                    
                    {(() => {
                        let grossTotal = 0;
                        let discountTotal = 0;
                        const hasProducts = order.products && order.products.length > 0;

                        if (hasProducts) {
                            order.products.forEach(p => {
                                grossTotal += (p.price * p.quantity);
                                const itemTotal = p.price * p.quantity * (1 - (p.discount || 0) / 100);
                                discountTotal += (p.price * p.quantity) - itemTotal;
                            });
                        }
                        
                        // If no products (manual amount) or calc issue, fallback: Gross = Total, Disc = 0. 
                        // But if totalAmount matches our calc, we show breakdown. 
                        // For manual amounts that don't match products, we rely on totalAmount.
                        // Ideally, trust totalAmount for the bottom line, but use products for breakdown if available.
                        
                        return (
                            <>
                                <View style={styles.breakdownRow}>
                                    <Paragraph style={styles.breakdownLabel}>MRP Total</Paragraph>
                                    <Paragraph style={styles.breakdownValue}>
                                        {hasProducts ? `₹${grossTotal.toFixed(2)}` : (order.totalAmount ? `₹${order.totalAmount}` : "In Review")}
                                    </Paragraph>
                                </View>
                                {discountTotal > 0 && (
                                    <View style={styles.breakdownRow}>
                                        <Paragraph style={styles.breakdownLabel}>Discount</Paragraph>
                                        <Paragraph style={[styles.breakdownValue, { color: 'green' }]}>-₹{discountTotal.toFixed(2)}</Paragraph>
                                    </View>
                                )}
                            </>
                        );
                    })()}

                    <View style={styles.breakdownRow}>
                        <Paragraph style={styles.breakdownLabel}>Delivery Fee {order.distance ? `(${order.distance.toFixed(1)} km)` : ''}</Paragraph>
                        <Paragraph style={styles.breakdownValue}>₹{order.deliveryCharge || 0}</Paragraph>
                    </View>
                    <View style={styles.breakdownRow}>
                        <Paragraph style={styles.breakdownLabel}>Shipping Fee</Paragraph>
                        <Paragraph style={styles.breakdownValue}>₹{order.shippingFee || 0}</Paragraph>
                    </View>
                    <View style={[styles.breakdownRow, styles.totalRow]}>
                        <Paragraph style={styles.totalLabel}>Grand Total</Paragraph>
                        <Paragraph style={styles.totalValue}>
                            {order.totalAmount 
                                ? `₹${(order.totalAmount + (order.deliveryCharge || 0) + (order.shippingFee || 0)).toFixed(2)}` 
                                : "Calculated after review"}
                        </Paragraph>
                    </View>
                </View>

                <View style={styles.shippingContainer}>
                    <Paragraph style={styles.shippingTitle}><Icon.FontAwesome name="truck" size={16} /> Shipping Address:</Paragraph>
                    <Paragraph style={styles.shippingDetails}><Icon.FontAwesome name="map-marker" size={16} /> {order.shippingAddress.address}</Paragraph>
                    <Paragraph style={styles.shippingDetails}>{order.shippingAddress.city}, {order.shippingAddress.state}</Paragraph>
                    <Paragraph style={styles.shippingDetails}>{order.shippingAddress.country} - {order.shippingAddress.postalCode}</Paragraph>
                </View>
                {order.orderStatus !== 'In Review' && order.orderStatus !== 'Pending' && order.orderStatus !== 'Processing' &&
                    <ButtonComponent
                        title={'Download Invoice'}
                        color={'#ff6600'}

                        onPress={() => handleChatDownloadInvoice(order, contact)}
                        style={styles.downloadButton}
                    />
                }

            </Card.Content>
        </Card>
    );
};

export default ChatOrderItem;

const styles = StyleSheet.create({
    cancelButton: {
        marginVertical: 5,
        alignSelf: 'flex-start',
    },

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
    critical: {
        color: 'red',
    },
    notcritical: {
        color: 'green',
    },
    orderStatus: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    shippingContainer: {
        marginTop: 16,
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
    breakdownContainer: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    breakdownTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    breakdownRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    breakdownLabel: {
        fontSize: 14,
        color: '#666',
    },
    breakdownValue: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    totalRow: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    totalValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ff6600',
    },
});
