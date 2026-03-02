import { StyleSheet, Text, View, Alert, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import React, { useState } from 'react';
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

const REASONS = [
    "Order placed by mistake",
    "Changed my mind",
    "Estimated delivery time is too long",
    "Duplicate order",
    "Found better price elsewhere",
    "Forgot to apply coupon",
    "Other"
];


const ChatOrderItem = ({ order, contact }) => {
    const dispatch = useDispatch()
    const { data } = useSelector(state => state.local);
    const customerId = data.user._id;

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedReason, setSelectedReason] = useState("");
    const [otherReason, setOtherReason] = useState("");
    const [isCancelling, setIsCancelling] = useState(false);

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

    const handleCancelOrder = async () => {
        if (!selectedReason) {
            Alert.alert("Error", "Please select a reason for cancellation");
            return;
        }

        const finalReason = selectedReason === "Other" ? otherReason : selectedReason;
        if (selectedReason === "Other" && !otherReason.trim()) {
            Alert.alert("Error", "Please provide a reason");
            return;
        }

        setIsCancelling(true);
        try {
            await dispatch(updateChatOrderStatus(order._id, {
                newStatus: "Cancelled",
                cancelledBy: "customer",
                cancellationReason: finalReason
            }));
            await dispatch(getChatOrdersByCustomer(customerId));
            Alert.alert("Success", "Your order has been cancelled successfully");
            setShowCancelModal(false);
            setSelectedReason("");
            setOtherReason("");
        } catch (error) {
            console.error('Error cancelling order:', error);
            Alert.alert("Error", "Failed to cancel order. Please try again.");
        } finally {
            setIsCancelling(false);
        }
    };


    const { timeString, isCritical, totalMinutes } = getTimeRemaining(order.arrivalAt);

    return (
        <Card style={styles.orderContainer}>
            <Card.Content>
                <Paragraph style={styles.orderId}><Icon.FontAwesome name="barcode" size={16} /> Order ID: {order.orderId}</Paragraph>
                <Paragraph style={styles.orderId}><Icon.AntDesign name="calendar" size={16} /> Ordered On: {formattedCreatedDate}</Paragraph>
                {order.deliveredAt && order.orderStatus === 'Delivered' && (
                    <Paragraph style={styles.orderId}>
                        <Icon.AntDesign name="checkcircleo" size={16} color="green" /> Delivered On: {
                            (() => {
                                const dDate = new Date(order.deliveredAt);
                                return `${dDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} ${dDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
                            })()
                        }
                    </Paragraph>
                )}
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

                {order.orderStatus === 'Cancelled' && order.cancellationReason && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, marginBottom: 10 }}>
                        <Icon.FontAwesome name="info-circle" size={16} color="green" />
                        <Text style={{ color: 'green', marginLeft: 8, fontSize: 14, flex: 1 }}>
                            <Text style={{ fontWeight: 'bold' }}>Reason: </Text>
                            {order.cancellationReason}
                        </Text>
                    </View>
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
                    <View style={styles.shippingDetailsRow}>
                        <Icon.FontAwesome name="map-marker" size={16} color="#666" style={styles.shippingIcon} />
                        <Text style={styles.shippingDetailsText}>
                            {
                                order.shippingAddress.fullAddress ||
                                `${order.shippingAddress.addressLine1 || ''} ${order.shippingAddress.addressLine2 || order.shippingAddress.address || ''}, ${order.shippingAddress.city || ''}, ${order.shippingAddress.state || ''}, ${order.shippingAddress.postalCode || ''}`.trim().replace(/, ,/g, ',')
                            }
                        </Text>
                    </View>
                </View>

                <View style={[styles.buttonRow, { justifyContent: 'space-between' }]}>
                    {order.orderStatus === 'Delivered' && (
                        <View style={styles.buttonContainer}>
                            <ButtonComponent
                                title={'Download Invoice'}
                                color={'#28a745'} // Green
                                onPress={() => handleChatDownloadInvoice(order, contact)}
                            />
                        </View>
                    )}

                    {order.orderStatus !== 'Cancelled' && order.orderStatus !== 'Delivered' && order.orderStatus !== 'Shipped' && (
                        <View style={styles.buttonContainer}>
                            <ButtonComponent
                                title={'Cancel Order'}
                                color={'#dc3545'} // Red
                                onPress={() => setShowCancelModal(true)}
                            />
                        </View>
                    )}
                </View>

                {/* Cancellation Reason Modal */}
                <Modal
                    visible={showCancelModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowCancelModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Select Cancellation Reason</Text>
                            <Text style={styles.modalSubtitle}>Please choose a reason for cancelling this order</Text>

                            <ScrollView style={styles.reasonsList}>
                                {REASONS.map((reason, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.reasonItem,
                                            selectedReason === reason && styles.reasonItemSelected
                                        ]}
                                        onPress={() => setSelectedReason(reason)}
                                    >
                                        <Icon.MaterialCommunityIcons
                                            name={selectedReason === reason ? "radiobox-marked" : "radiobox-blank"}
                                            size={22}
                                            color={selectedReason === reason ? "#ff6600" : "#8E8E93"}
                                        />
                                        <Text style={[
                                            styles.reasonText,
                                            selectedReason === reason && styles.reasonTextSelected
                                        ]}>
                                            {reason}
                                        </Text>
                                    </TouchableOpacity>
                                ))}

                                {selectedReason === "Other" && (
                                    <View style={styles.customReasonContainer}>
                                        <Text style={styles.customReasonLabel}>Enter your reason:</Text>
                                        <TextInput
                                            style={styles.customReasonInput}
                                            placeholder="Type your reason here..."
                                            placeholderTextColor="#8E8E93"
                                            value={otherReason}
                                            onChangeText={setOtherReason}
                                            multiline
                                            numberOfLines={3}
                                            textAlignVertical="top"
                                        />
                                    </View>
                                )}
                            </ScrollView>

                            <View style={styles.modalActions}>
                                <TouchableOpacity
                                    style={[styles.modalBtn, styles.modalCancelBtn]}
                                    onPress={() => {
                                        setShowCancelModal(false);
                                        setSelectedReason("");
                                        setOtherReason("");
                                    }}
                                >
                                    <Text style={styles.modalCancelBtnText}>Go Back</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalBtn, styles.modalConfirmBtn, (!selectedReason || isCancelling) && { opacity: 0.6 }]}
                                    onPress={handleCancelOrder}
                                    disabled={isCancelling || !selectedReason}
                                >
                                    <Text style={styles.modalConfirmBtnText}>
                                        {isCancelling ? "..." : "Confirm"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

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
    buttonRow: {
        flexDirection: 'row',
        marginTop: 15,
        gap: 10,
    },
    buttonContainer: {
        flex: 1,
    },
    shippingDetailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    shippingIcon: {
        marginRight: 8,
    },
    shippingDetailsText: {
        flex: 1,
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: '#151515',
        borderRadius: 20,
        padding: 24,
        width: '100%',
        maxWidth: 400,
        maxHeight: '80%',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#8E8E93',
        marginBottom: 20,
        textAlign: 'center',
    },
    reasonsList: {
        marginBottom: 20,
    },
    reasonItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#333',
        marginBottom: 10,
        backgroundColor: '#222',
    },
    reasonItemSelected: {
        borderColor: '#ff6600',
        backgroundColor: 'rgba(255, 102, 0, 0.1)',
    },
    reasonText: {
        fontSize: 15,
        color: '#eee',
        fontWeight: '500',
        marginLeft: 12,
        flex: 1,
    },
    reasonTextSelected: {
        color: '#ff6600',
        fontWeight: 'bold',
    },
    customReasonContainer: {
        marginTop: 10,
        marginBottom: 10,
    },
    customReasonLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 8,
    },
    customReasonInput: {
        borderWidth: 1.5,
        borderColor: '#ff6600',
        borderRadius: 12,
        padding: 12,
        fontSize: 15,
        color: '#fff',
        backgroundColor: 'rgba(255, 102, 0, 0.05)',
        minHeight: 80,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    modalBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalCancelBtn: {
        backgroundColor: '#333',
    },
    modalConfirmBtn: {
        backgroundColor: '#dc3545',
    },
    modalCancelBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    modalConfirmBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    }
});
