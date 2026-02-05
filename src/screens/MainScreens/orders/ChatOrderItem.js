import React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { Card, Paragraph, Button } from 'react-native-paper';
import Icon from '../../../components/Icons/Icon';
import { getChatOrdersByCustomer, updateChatOrderStatus } from '../../../config/redux/actions/chatOrderActions';
import { useDispatch, useSelector } from 'react-redux';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import FileViewer from 'react-native-file-viewer';
import { getTimeRemaining, handleChatDownloadInvoice } from './utils';
import { formatCurrency } from '../../../utils/currency';
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
                {order.orderStatus === 'Shipped' && <Paragraph style={[styles.orderId, isCritical ? styles.critical : styles.notcritical]}><Icon.AntDesign name="clockcircleo" size={16} /> Delivery Time: {timeString}</Paragraph>}

                {/* Delivery OTP Card - Appears when Out for Delivery */}
                {order.deliveryOtp && order.orderStatus === 'Shipped' && (
                    <View style={styles.otpHighlightCard}>
                        <View style={styles.otpHeader}>
                            <Icon.MaterialCommunityIcons name="shield-check" size={20} color="#FF6600" />
                            <Text style={styles.otpTitle}>DELIVERY OTP</Text>
                        </View>
                        <Text style={styles.otpValue}>{order.deliveryOtp}</Text>
                        <Text style={styles.otpSubtext}>Share this code with the driver to receive your order.</Text>
                    </View>
                )}

                {/* Driver Details Card - Appears below OTP when driver is assigned */}
                {order.driverId && order.orderStatus === 'Shipped' && (
                    <View style={styles.driverCard}>
                        <Text style={styles.driverCardTitle}>Driver Information</Text>
                        <View style={styles.driverInfoRow}>
                            <Icon.FontAwesome name="user" size={14} color="#666" />
                            <Text style={styles.driverInfoText}>
                                {order.driverId.personalDetails?.name || 'N/A'}
                            </Text>
                        </View>
                        <View style={styles.driverInfoRow}>
                            <Icon.FontAwesome name="phone" size={14} color="#666" />
                            <Text style={styles.driverInfoText}>
                                {order.driverId.personalDetails?.phone || 'N/A'}
                            </Text>
                        </View>
                    </View>
                )}

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
                                        {hasProducts ? formatCurrency(grossTotal) : (order.totalAmount ? formatCurrency(order.totalAmount) : "In Review")}
                                    </Paragraph>
                                </View>
                                {discountTotal > 0 && (
                                    <View style={styles.breakdownRow}>
                                        <Paragraph style={styles.breakdownLabel}>Discount</Paragraph>
                                        <Paragraph style={[styles.breakdownValue, { color: 'green' }]}>-{formatCurrency(discountTotal)}</Paragraph>
                                    </View>
                                )}
                            </>
                        );
                    })()}

                    <View style={styles.breakdownRow}>
                        <Paragraph style={styles.breakdownLabel}>Delivery Fee</Paragraph>
                        <Paragraph style={styles.breakdownValue}>{formatCurrency(order.deliveryCharge || 0)}</Paragraph>
                    </View>
                    {order.deliveryCharge > 0 && (
                        <View style={styles.deliveryBreakdownItem}>
                            <View style={styles.deliveryExplainRow}>
                                <Icon.MaterialCommunityIcons name="information-outline" size={14} color="#666" />
                                <Paragraph style={styles.deliveryBreakdownText}>
                                    {order.deliveryChargeDescription || (order.distance ? `Distance: ${order.distance.toFixed(1)} km` : "Calculated based on distance")}
                                </Paragraph>
                            </View>
                        </View>
                    )}
                    <View style={styles.breakdownRow}>
                        <Paragraph style={styles.breakdownLabel}>Shipping Fee</Paragraph>
                        <Paragraph style={styles.breakdownValue}>{formatCurrency(order.shippingFee || 0)}</Paragraph>
                    </View>
                    <View style={[styles.breakdownRow, styles.totalRow]}>
                        <Paragraph style={styles.totalLabel}>Grand Total</Paragraph>
                        <Paragraph style={styles.totalValue}>
                            {order.totalAmount
                                ? formatCurrency((order.totalAmount + (order.deliveryCharge || 0) + (order.shippingFee || 0)))
                                : "Calculated after review"}
                        </Paragraph>
                    </View>
                </View>

                <View style={styles.shippingContainer}>
                    <Paragraph style={styles.shippingTitle}><Icon.FontAwesome name="truck" size={16} /> Shipping Address:</Paragraph>
                    <Paragraph style={styles.shippingDetails}><Icon.FontAwesome name="map-marker" size={16} /> {order.shippingAddress.addressLine2 || order.shippingAddress.address}</Paragraph>
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
    otpHighlightCard: {
        backgroundColor: '#FFF5EE',
        borderWidth: 1,
        borderColor: '#FFDAB9',
        borderRadius: 10,
        padding: 12,
        marginVertical: 10,
        alignItems: 'center',
        elevation: 1,
    },
    otpHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    otpTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FF6600',
        marginLeft: 6,
        letterSpacing: 1,
    },
    otpValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        letterSpacing: 4,
        marginVertical: 2,
    },
    otpSubtext: {
        fontSize: 10,
        color: '#666',
        textAlign: 'center',
        marginTop: 2,
    },
    driverCard: {
        backgroundColor: '#F0F8FF',
        borderWidth: 1,
        borderColor: '#B0D4F1',
        borderRadius: 10,
        padding: 12,
        marginVertical: 10,
        elevation: 1,
    },
    driverCardTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#1E90FF',
        marginBottom: 8,
        textAlign: 'center',
    },
    driverInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
        paddingLeft: 8,
    },
    driverInfoText: {
        fontSize: 13,
        color: '#333',
        marginLeft: 8,
        fontWeight: '500',
    },
    deliveryBreakdownItem: {
        marginLeft: 15,
        marginBottom: 8,
        paddingLeft: 10,
        borderLeftWidth: 1,
        borderLeftColor: '#eee',
    },
    deliveryExplainRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deliveryBreakdownText: {
        fontSize: 11,
        color: '#777',
        marginLeft: 6,
        fontStyle: 'italic',
    },
});
