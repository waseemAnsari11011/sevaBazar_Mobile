import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, Paragraph, Button } from 'react-native-paper';
import Icon from '../../../components/Icons/Icon';
import { fetchOrdersByCustomerId, updateOrderStatus } from '../../../config/redux/actions/orderActions';
import { useDispatch, useSelector } from 'react-redux';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import FileViewer from 'react-native-file-viewer';

const OrderItem = ({ order }) => {
    const { data } = useSelector(state => state.local);
    const customerId = data.user._id;
    const dispatch = useDispatch();

    console.log("order-->>", order)

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


    const handleDownloadInvoice = async (order) => {
        console.log("order.vendors", order.vendors);

        const totalAmount = order.vendors.reduce((total, vendor) => {
            return total + vendor.products.reduce((vendorTotal, product) => {
                return vendorTotal + product.totalAmount;
            }, 0);
        }, 0).toFixed(2);

        const finalTotal = (parseFloat(totalAmount) + 20).toFixed(2);
        const rupeeSymbol = '\u20B9';

        let htmlContent = `
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; color: #333; }
                    .header, .footer { text-align: center; margin-top:50px }
                    .header { font-size: 24px; color: white; background-color: #3366ff; padding: 10px; }
                    .content { margin: 20px; }
                    .section { display: flex; justify-content: space-between; margin-bottom: 20px; }
                    .section div { width: 48%; }
                    .amount-due { font-size: 24px; color: #3366ff; text-align: right; margin-bottom: 20px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    table, th, td { border: 1px solid #ccc; }
                    th, td { padding: 10px; text-align: center; }
                    th { background-color: #f2f2f2; }
                    .terms { margin-top: 40px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div>Seva Bazar</div>
                    <div>Invoice</div>
                </div>
                <div class="content">
                    <div class="section">
                        <div>
                            <strong>Reference:</strong> #${order.orderId}<br>
                            <strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}<br>
                            <strong>Invoice number:</strong> ${order.orderId}
                        </div>
                        <div>
                            <strong>Billed to:</strong><br>
                            ${order?.customer?.name}<br>
                            ${order.shippingAddress.address}<br>
                            ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.postalCode}<br>
                            ${order.shippingAddress.country}
                        </div>
                        <div>
                            <strong>Shipping address:</strong><br>
                            ${order?.customer?.name}<br>
                            ${order.shippingAddress.address}<br>
                            ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.postalCode}<br>
                            ${order.shippingAddress.country}
                        </div>
                        <div>
                            <strong>From:</strong><br>
                            Seva Bazar<br>
                            West Bengal<br>
                            India<br>
                            713301 - Asansol<br>
                            India
                        </div>
                    </div>
                    <div class="amount-due">
                        <strong>Amount due:</strong><br>
                        <span>${rupeeSymbol} ${finalTotal}</span>
                    </div>
                    <div class="products">
                        <table>
                            <tr>
                                <th>Items</th>
                                <th>Quantity</th>
                                <th>Discount</th>
                                <th>Price</th>
                                <th>Amount</th>
                            </tr>
                            ${order.vendors.flatMap(vendor => vendor.products.map(product => `
                                <tr>
                                    <td>${product.product?.name || 'N/A'}</td>
                                    <td>${product.quantity}</td>
                                    <td>${product.discount} %</td>
                                    <td>${rupeeSymbol} ${product.price.toFixed(2)}</td>
                                    <td>${rupeeSymbol} ${product.totalAmount.toFixed(2)}</td>
                                </tr>
                            `)).join('')}
                        </table>
                    </div>
                    <div class="content">
                        <div>Subtotal: ${rupeeSymbol} ${totalAmount}</div>
                        <div>Delivery charge: ${rupeeSymbol} 20</div>
                        <div>Total amount: ${rupeeSymbol} ${finalTotal}</div>
                    </div>
                    <div class="terms">
                        <strong>Terms & notes</strong><br>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia
                        molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum
                        numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium
                    </div>
                    <div class="footer">
                        Thank you!
                    </div>
                </div>
            </body>
            </html>
        `;

        let options = {
            html: htmlContent,
            fileName: `invoice_${order.orderId}`,
            directory: 'Documents',
        };

        try {
            let file = await RNHTMLtoPDF.convert(options);
            console.log(file.filePath);
            await FileViewer.open(file.filePath);
        } catch (error) {
            console.error('Error generating or opening PDF:', error);
            Alert.alert('Error', 'There was an error generating or opening the PDF.');
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
                            <Button
                                mode="outlined"
                                onPress={() => handleCancelOrder(order._id, vendorItem.vendor._id)}
                                style={styles.cancelButton}
                            >
                                Cancel Order
                            </Button>
                        )}

                        {vendorItem.products.map((productItem) => (
                            <View key={productItem._id} style={styles.productContainer}>
                                <Paragraph style={styles.productName}><Icon.FontAwesome name="cube" size={16} /> Product: {productItem?.product?.name}</Paragraph>
                                <Paragraph style={styles.productDetails}><Icon.FontAwesome name="sort-numeric-asc" size={16} /> Quantity: {productItem?.quantity}</Paragraph>
                                <Paragraph style={styles.productDetails}><Icon.FontAwesome name="dollar" size={16} /> Price: ₹{productItem?.price}</Paragraph>
                                <Paragraph style={styles.productDetails}><Icon.FontAwesome name="percent" size={16} /> Discount: {productItem?.discount}%</Paragraph>
                                <Paragraph style={styles.productDetails}><Icon.FontAwesome name="calculator" size={16} /> Total Amount: ₹{productItem?.totalAmount.toFixed(2)}</Paragraph>
                                {productItem.variations.map((variation, index) => (
                                    <Paragraph key={index} style={styles.productDetails}>
                                        <Icon.FontAwesome name="tag" size={16} /> {variation.attributes.selected}: {variation.attributes.value}
                                    </Paragraph>
                                ))}
                            </View>
                        ))}

                        <Paragraph style={styles.productDetails}><Icon.FontAwesome name="truck" size={16} /> Delivery: ₹{20}</Paragraph>
                    </View>
                ))}
                <View style={styles.shippingContainer}>
                    <Paragraph style={styles.shippingTitle}><Icon.FontAwesome name="truck" size={16} /> Shipping Address:</Paragraph>
                    <Paragraph style={styles.shippingDetails}><Icon.FontAwesome name="map-marker" size={16} /> {order.shippingAddress.address}</Paragraph>
                    <Paragraph style={styles.shippingDetails}>{order.shippingAddress.city}, {order.shippingAddress.state}</Paragraph>
                    <Paragraph style={styles.shippingDetails}>{order.shippingAddress.country} - {order.shippingAddress.postalCode}</Paragraph>
                </View>
                <Button
                    mode="outlined"
                    onPress={() => handleDownloadInvoice(order)}
                    style={styles.downloadButton}
                >
                    Download Invoice
                </Button>
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
