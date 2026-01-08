import React from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity, Image } from 'react-native';
import { Card, Paragraph, Button } from 'react-native-paper';
import Icon from '../../../components/Icons/Icon';
import { fetchOrdersByCustomerId, updateOrderStatus } from '../../../config/redux/actions/orderActions';
import { useDispatch, useSelector } from 'react-redux';
import { getTimeRemaining, handleDownloadInvoice, calculateDistance } from './utils';
import ButtonComponent from '../../../components/Button';
import OutlinedBtn from '../../../components/OutlinedBtn';


const OrderItem = ({ order, navigation, contact }) => {
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
                            <Icon.FontAwesome name="info-circle" size={16} />
                            {vendorItem.orderStatus === 'Delivered'
                                ? ` Delivered within ${vendorItem.deliveredInMin} min`
                                : ` Order Status: ${vendorItem.orderStatus}`
                            }
                        </Paragraph>

                        {vendorItem.orderStatus !== 'Cancelled' && vendorItem.orderStatus !== 'Delivered' && vendorItem.orderStatus !== 'Shipped' && (
                            <View style={{ marginVertical: 5 }}>
                                <OutlinedBtn buttonWidth={160} textColor={'red'} borderColor={'red'} onPress={() => handleCancelOrder(order._id, vendorItem.vendor._id)} />

                            </View>
                        )}

                        {vendorItem.orderStatus === 'Shipped' && (() => {
                            const { timeString, isCritical } = getTimeRemaining(vendorItem.products?.[0]?.arrivalAt);
                            return (
                                <Paragraph style={[styles.orderId, isCritical ? styles.critical : styles.notcritical]}>
                                    <Icon.AntDesign name="clockcircleo" size={16} /> Delivery Time: {timeString}
                                </Paragraph>
                            );
                        })()}

                        {vendorItem.products.map((productItem) => {
                            const { timeString, isCritical } = getTimeRemaining(productItem.arrivalAt);
                            
                            // Extract image safely
                           const productImage = productItem?.product?.variations?.[0]?.images?.[0] || 'https://via.placeholder.com/60';

                            return (
                                <TouchableOpacity key={productItem._id} style={styles.productContainer} onPress={() =>
                                    navigation.navigate('Details', { product: productItem?.product })
                                }>
                                    <View style={styles.productDetailsContainer}>
                                        <Image 
                                            source={{ uri: productImage }} 
                                            style={styles.productImage} 
                                            resizeMode="cover"
                                        />
                                        <View style={styles.productInfo}>
                                            <Paragraph style={styles.productName}><Icon.FontAwesome name="cube" size={16} /> Product: {productItem?.product?.name}</Paragraph>
                                            


                                            <Paragraph style={styles.productDetails}><Icon.FontAwesome name="sort-numeric-asc" size={16} /> Quantity: {productItem?.quantity}</Paragraph>
                                            <Paragraph style={styles.productDetails}><Icon.FontAwesome name="dollar" size={16} /> Price: ₹{productItem?.price}</Paragraph>
                                            <Paragraph style={styles.productDetails}><Icon.FontAwesome name="percent" size={16} /> Discount: {productItem?.discount}%</Paragraph>
                                            <Paragraph style={styles.productDetails}><Icon.FontAwesome name="calculator" size={16} /> Total Amount: ₹{productItem?.totalAmount.toFixed(2)}</Paragraph>
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
                                </TouchableOpacity>
                            );
                        })}



                        <Paragraph style={styles.productDetails}>
                            <Icon.FontAwesome name="truck" size={16} /> Delivery: ₹{vendorItem.deliveryCharge || 0}
                            {(() => {
                                let distance = vendorItem.distance;
                                if (!distance && vendorItem.vendor?.location?.coordinates && order.shippingAddress?.latitude && order.shippingAddress?.longitude) {
                                     const vendorLat = vendorItem.vendor.location.coordinates[1];
                                     const vendorLon = vendorItem.vendor.location.coordinates[0];
                                     distance = calculateDistance(vendorLat, vendorLon, order.shippingAddress.latitude, order.shippingAddress.longitude);
                                }
                                if (distance) {
                                    const charge = vendorItem.deliveryCharge || 0;
                                    const perKm = distance > 0 ? (charge / distance).toFixed(2) : 0;
                                    return ` (${distance.toFixed(1)} km | ₹${perKm}/km)`;
                                }
                                return '';
                            })()}
                        </Paragraph>
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
                                <Paragraph style={styles.breakdownValue}>₹{grossTotal.toFixed(2)}</Paragraph>
                            </View>
                            {discountTotal > 0 && (
                                <View style={styles.breakdownRow}>
                                    <Paragraph style={styles.breakdownLabel}>Discount</Paragraph>
                                    <Paragraph style={[styles.breakdownValue, { color: 'green' }]}>-₹{discountTotal.toFixed(2)}</Paragraph>
                                </View>
                            )}
                            <View style={styles.breakdownRow}>
                                <Paragraph style={styles.breakdownLabel}>Delivery Fee</Paragraph>
                                <Paragraph style={styles.breakdownValue}>₹{deliveryTotal.toFixed(2)}</Paragraph>
                            </View>
                            <View style={styles.breakdownRow}>
                                <Paragraph style={styles.breakdownLabel}>Shipping Fee</Paragraph>
                                <Paragraph style={styles.breakdownValue}>₹{shippingFee.toFixed(2)}</Paragraph>
                            </View>
                            <View style={[styles.breakdownRow, styles.totalRow]}>
                                <Paragraph style={styles.totalLabel}>Grand Total</Paragraph>
                                <Paragraph style={styles.totalValue}>₹{grandTotal.toFixed(2)}</Paragraph>
                            </View>
                        </View>
                    );
                })()}

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

                        onPress={() => handleDownloadInvoice(order, contact)}
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
