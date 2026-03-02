import { StyleSheet, Text, View, Alert, TouchableOpacity, Image, Modal, ScrollView, TextInput } from 'react-native';
import React, { useState } from 'react';
import { Card, Paragraph, Button } from 'react-native-paper';
import Icon from '../../../components/Icons/Icon';
import { fetchOrdersByCustomerId, updateOrderStatus } from '../../../config/redux/actions/orderActions';
import { useDispatch, useSelector } from 'react-redux';
import { getTimeRemaining, handleDownloadInvoice, calculateDistance } from './utils';
import { formatCurrency } from '../../../utils/currency';
import ButtonComponent from '../../../components/Button';
import OutlinedBtn from '../../../components/OutlinedBtn';

const REASONS = [
    "Order placed by mistake",
    "Changed my mind",
    "Estimated delivery time is too long",
    "Duplicate order",
    "Found better price elsewhere",
    "Forgot to apply coupon",
    "Other"
];


const OrderItem = ({ order, navigation, contact }) => {
    const { data } = useSelector(state => state.local);
    const customerId = data.user._id;
    const dispatch = useDispatch();

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedReason, setSelectedReason] = useState("");
    const [otherReason, setOtherReason] = useState("");
    const [cancellingVendorId, setCancellingVendorId] = useState(null);
    const [isCancelling, setIsCancelling] = useState(false);

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
            await dispatch(updateOrderStatus(order._id, cancellingVendorId, {
                newStatus: "Cancelled",
                cancelledBy: "customer",
                cancellationReason: finalReason
            }));
            await dispatch(fetchOrdersByCustomerId(customerId));
            Alert.alert("Success", "Your order has been cancelled successfully");
            setShowCancelModal(false);
            setSelectedReason("");
            setOtherReason("");
            setCancellingVendorId(null);
        } catch (error) {
            console.error('Error cancelling order:', error);
            Alert.alert("Error", "Failed to cancel order. Please try again.");
        } finally {
            setIsCancelling(false);
        }
    };



    return (
        <Card style={styles.orderContainer}>
            <Card.Content>
                <Paragraph style={styles.orderId}><Icon.FontAwesome name="barcode" size={16} /> Order ID: {order.orderId}</Paragraph>
                <Paragraph style={styles.orderId}><Icon.AntDesign name="calendar" size={16} /> Ordered On: {formattedCreatedDate}</Paragraph>
                {order.deliveredAt && order.vendors.some(v => v.orderStatus === 'Delivered') && (
                    <Paragraph style={styles.orderId}>
                        <Icon.AntDesign name="checkcircleo" size={16} color="green" /> Delivered On: {
                            (() => {
                                const dDate = new Date(order.deliveredAt);
                                return `${dDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} ${dDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
                            })()
                        }
                    </Paragraph>
                )}

                {/* Delivery OTP Card - Appears when Out for Delivery */}
                {order.deliveryOtp && order.vendors.some(v => v.orderStatus === 'Shipped') && (
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
                {order.driverId && order.vendors.some(v => v.orderStatus === 'Shipped') && (
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

                {order?.vendors.length > 0 && order?.vendors?.map((vendorItem) => (
                    <View key={vendorItem?.vendor?._id} style={styles.vendorContainer}>
                        <Paragraph style={[styles.orderStatus, { color: getStatusColor(vendorItem.orderStatus), fontWeight: 'bold' }]}>
                            <Icon.FontAwesome name="info-circle" size={16} />
                            {vendorItem.orderStatus === 'Delivered'
                                ? ` Delivered within ${vendorItem.deliveredInMin} min`
                                : ` Order Status: ${vendorItem.orderStatus}`
                            }
                        </Paragraph>

                        {vendorItem.orderStatus === 'Cancelled' && vendorItem.cancellationReason && (
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, marginBottom: 10 }}>
                                <Icon.FontAwesome name="info-circle" size={16} color="green" />
                                <Text style={{ color: 'green', marginLeft: 8, fontSize: 13, flex: 1 }}>
                                    <Text style={{ fontWeight: 'bold' }}>Reason: </Text>
                                    {vendorItem.cancellationReason}
                                </Text>
                            </View>
                        )}


                        {vendorItem.orderStatus === 'Shipped' && (() => {
                            const { timeString, isCritical } = getTimeRemaining(vendorItem.products?.[0]?.arrivalAt);
                            return (
                                <Paragraph style={styles.orderId}>
                                    <Icon.AntDesign name="clockcircleo" size={16} />
                                    <Text style={{ color: 'green' }}>Delivery Time: </Text>
                                    <Text style={{ color: 'red' }}>{timeString}</Text>
                                </Paragraph>
                            );
                        })()}

                        {vendorItem.products.map((productItem) => {
                            const { timeString, isCritical } = getTimeRemaining(productItem.arrivalAt);

                            // Extract image safely
                            const productImage = productItem?.product?.variations?.[0]?.images?.[0] || 'https://via.placeholder.com/60';

                            return (
                                <View key={productItem._id} style={styles.productContainer}>
                                    <View style={styles.productDetailsContainer}>
                                        <Image
                                            source={{ uri: productImage }}
                                            style={styles.productImage}
                                            resizeMode="cover"
                                        />
                                        <View style={styles.productInfo}>
                                            <Paragraph style={styles.productName}><Icon.FontAwesome name="cube" size={16} /> Product: {productItem?.product?.name}</Paragraph>



                                            <Paragraph style={styles.productDetails}><Icon.FontAwesome name="sort-numeric-asc" size={16} /> Quantity: {productItem?.quantity}</Paragraph>
                                            <Paragraph style={styles.productDetails}><Icon.FontAwesome name="dollar" size={16} /> Price: {formatCurrency(productItem?.price)}</Paragraph>
                                            <Paragraph style={styles.productDetails}><Icon.FontAwesome name="percent" size={16} /> Discount: {productItem?.discount}%</Paragraph>
                                            <Paragraph style={styles.productDetails}><Icon.FontAwesome name="calculator" size={16} /> Total Amount: {formatCurrency(productItem?.totalAmount)}</Paragraph>
                                            {productItem.variations?.map((variation, index) => (
                                                <View key={index}>
                                                    {variation.attributes?.map((attr, attrIndex) => (
                                                        <Paragraph key={attrIndex} style={styles.productDetails}>
                                                            <Icon.FontAwesome name="tag" size={16} /> {attr.name}: {attr.value}
                                                        </Paragraph>
                                                    ))}
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                </View>
                            );
                        })}




                    </View>
                ))}

                {/* Calculate Totals for Breakdown */}
                {(() => {
                    let grossTotal = 0;
                    let discountTotal = 0;
                    let itemTotal = 0; // This essentially matches (Gross - Discount)
                    let deliveryTotal = 0;

                    order?.vendors?.forEach(vendor => {
                        vendor.products?.forEach(product => {
                            const pTotal = product.totalAmount || 0;
                            const pQty = product.quantity || 0;
                            const pPrice = product.price || 0;

                            itemTotal += pTotal;
                            grossTotal += (pPrice * pQty);
                        });
                        deliveryTotal += vendor.deliveryCharge || 0;
                    });

                    discountTotal = grossTotal - itemTotal;

                    // Sanity check: ensure discount isn't negative due to float issues
                    if (discountTotal < 0) discountTotal = 0;

                    const shippingFee = order.shippingFee || 0;
                    const grandTotal = itemTotal + deliveryTotal + shippingFee;

                    return (
                        <View style={styles.breakdownContainer}>
                            <Paragraph style={styles.breakdownTitle}>Payment Details</Paragraph>
                            <View style={styles.breakdownRow}>
                                <Paragraph style={styles.breakdownLabel}>MRP Total</Paragraph>
                                <Paragraph style={styles.breakdownValue}>{formatCurrency(grossTotal)}</Paragraph>
                            </View>
                            {discountTotal > 0 && (
                                <View style={styles.breakdownRow}>
                                    <Paragraph style={styles.breakdownLabel}>Discount</Paragraph>
                                    <Paragraph style={[styles.breakdownValue, { color: 'green' }]}>-{formatCurrency(discountTotal)}</Paragraph>
                                </View>
                            )}

                            {/* Delivery Fee Breakdown */}
                            <View style={styles.breakdownRow}>
                                <Paragraph style={styles.breakdownLabel}>Delivery Fee</Paragraph>
                                <Paragraph style={styles.breakdownValue}>{formatCurrency(deliveryTotal)}</Paragraph>
                            </View>
                            {order?.vendors?.map((vendor, index) => {
                                const charge = vendor.deliveryCharge || 0;
                                let distance = vendor.distance;

                                // Calculate distance if not stored
                                if (!distance && vendor.vendor?.location?.coordinates && order.shippingAddress?.latitude && order.shippingAddress?.longitude) {
                                    const vendorLat = vendor.vendor.location.coordinates[1];
                                    const vendorLon = vendor.vendor.location.coordinates[0];
                                    distance = calculateDistance(vendorLat, vendorLon, order.shippingAddress.latitude, order.shippingAddress.longitude);
                                }

                                // Default values (ideally these should come from backend settings)
                                const basePay = 30;
                                const baseDistance = 5;
                                const perKmRate = 10;

                                const dist = distance || 0;
                                const extraDistance = Math.max(0, dist - baseDistance);
                                const extraCharge = extraDistance * perKmRate;
                                const isFixedOnly = dist <= baseDistance;

                                return (
                                    <View key={vendor.vendor?._id || index} style={styles.deliveryBreakdownItem}>
                                        <View style={styles.deliveryExplainRow}>
                                            <Icon.MaterialCommunityIcons name="information-outline" size={14} color="#666" />
                                            <Paragraph style={styles.deliveryBreakdownText}>
                                                {vendor.deliveryChargeDescription || "Calculated based on distance"}
                                            </Paragraph>
                                        </View>
                                    </View>
                                );
                            })}

                            <View style={styles.breakdownRow}>
                                <Paragraph style={styles.breakdownLabel}>Shipping Fee</Paragraph>
                                <Paragraph style={styles.breakdownValue}>{formatCurrency(shippingFee)}</Paragraph>
                            </View>
                            <View style={[styles.breakdownRow, styles.totalRow]}>
                                <Paragraph style={styles.totalLabel}>Grand Total</Paragraph>
                                <Paragraph style={styles.totalValue}>{formatCurrency(grandTotal)}</Paragraph>
                            </View>
                        </View>
                    );
                })()}

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
                    {order.vendors.some(v => v.orderStatus === 'Delivered') && (
                        <View style={styles.buttonContainer}>
                            <ButtonComponent
                                title={'Download Invoice'}
                                color={'#28a745'} // Green
                                onPress={() => handleDownloadInvoice(order, contact)}
                            />
                        </View>
                    )}

                    {order?.vendors?.map((vendorItem) => {
                        const isCancellable = vendorItem.orderStatus !== 'Cancelled' &&
                            vendorItem.orderStatus !== 'Delivered' &&
                            vendorItem.orderStatus !== 'Shipped';

                        if (!isCancellable) return null;

                        return (
                            <View key={`cancel-${vendorItem?.vendor?._id}`} style={styles.buttonContainer}>
                                <ButtonComponent
                                    title={'Cancel Order'}
                                    color={'#dc3545'} // Red
                                    onPress={() => {
                                        setCancellingVendorId(vendorItem.vendor._id);
                                        setShowCancelModal(true);
                                    }}
                                />
                                {order.vendors.length > 1 && (
                                    <Text style={styles.cancelSubText}>
                                        ({vendorItem?.vendor?.name || 'Items'})
                                    </Text>
                                )}
                            </View>
                        );
                    })}
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
        // Space removed as it's now in a row
    },
    buttonRow: {
        flexDirection: 'row',
        marginTop: 15,
        alignItems: 'flex-start',
    },
    buttonContainer: {
        flex: 1,
        marginHorizontal: 4,
    },
    cancelSubText: {
        fontSize: 9,
        color: 'red',
        textAlign: 'center',
        marginTop: 2,
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
        marginLeft: 8,
        marginBottom: 12,
        padding: 8,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#eee',
    },
    productDetailsContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    productImage: {
        width: 70,
        height: 70,
        borderRadius: 8,
        marginRight: 12,
        backgroundColor: '#ddd',
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    productDetails: {
        fontSize: 13,
        color: '#666',
        marginBottom: 2,
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
    cancelButton: {
        marginVertical: 5,
        alignSelf: 'flex-start',
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
    deliveryBreakdownValue: {
        fontSize: 12,
        color: '#333',
        fontWeight: '500',
        marginBottom: 2,
    },
    deliveryBreakdownRate: {
        fontSize: 11,
        color: '#888',
        fontStyle: 'italic',
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
