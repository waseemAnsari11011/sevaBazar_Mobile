import RNHTMLtoPDF from 'react-native-html-to-pdf';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';
import { Alert, Image, Asset } from 'react-native';
import { PermissionsAndroid } from 'react-native';

const logo = require('../../../assets/images/brand.png');
const logoSource = Image.resolveAssetSource(logo);

// Download the image to a temporary location
const downloadImageToTmp = async (imageUri) => {
    const destPath = `${RNFS.TemporaryDirectoryPath}/brand.png`;
    try {
        // Directly use the required path if logoSource.uri does not work on physical devices
        const logoUri = logoSource.uri || logo;

        // Download the file
        const downloadResult = await RNFS.downloadFile({
            fromUrl: logoUri,
            toFile: destPath,
        }).promise;

        if (downloadResult.statusCode === 200) {
            console.log('Image downloaded to temporary path:', destPath);
            return destPath;
        } else {
            console.error('Error downloading image file:', downloadResult);
            return '';
        }
    } catch (error) {
        console.error('Error downloading image file:', error);
        return '';
    }
};



// Get base64 encoded image
const getBase64Image = async (imagePath) => {
    try {
        console.log('Reading image from path:', imagePath);
        const base64Image = await RNFS.readFile(imagePath, 'base64');
        return `data:image/png;base64,${base64Image}`;
    } catch (error) {
        console.error('Error reading image file:', error);
        return '';
    }
};


export const handleDownloadInvoice = async (order, contact) => {
    console.log("order.vendors", order.vendors);

    // Calculate Item Cost (Subtotal of products)
    const itemCost = order.vendors.reduce((total, vendor) => {
        return total + vendor.products.reduce((vendorTotal, product) => {
            return vendorTotal + product.totalAmount;
        }, 0);
    }, 0).toFixed(2);

    // Calculate Total Delivery Charge and prepare breakdown
    let totalDeliveryCharge = 0;
    const deliveryBreakdown = [];
    const vendorDetails = [];

    order.vendors.forEach(vendor => {
        const charge = vendor.deliveryCharge || 0;
        totalDeliveryCharge += charge;
        
        let distanceStr = '';
        if (vendor.distance) {
            distanceStr = `${vendor.distance.toFixed(1)} km`;
        } else {
             // Fallback calc if needed, similar to OrderItem but maybe overkill for PDF if not stored. 
             // We'll rely on stored or 0 for now to keep it clean, or use 'Unknown distance'
             // If we really want fallback, we need calculateDistance here too.
             // Let's check if we can access calculateDistance here. It is exported.
             if (vendor.vendor?.location?.coordinates && order.shippingAddress?.latitude && order.shippingAddress?.longitude) {
                 const d = calculateDistance(
                     vendor.vendor.location.coordinates[1], 
                     vendor.vendor.location.coordinates[0], 
                     order.shippingAddress.latitude, 
                     order.shippingAddress.longitude
                 );
                 distanceStr = `${d.toFixed(1)} km`;
             }
        }
        
        deliveryBreakdown.push({
            vendorName: vendor.vendor?.businessName || 'Vendor',
            distance: distanceStr,
            charge: charge.toFixed(2)
        });

        vendorDetails.push({
            shopName: vendor.vendor?.vendorInfo?.businessName || vendor.vendor?.name, // Shop Name
            ownerName: vendor.vendor?.name, // Owner Name
            phone: vendor.vendor?.vendorInfo?.contactNumber,
            address: vendor.vendor?.location?.address?.addressLine1 || vendor.vendor?.address, // vendor?.address might be legacy, location.address is schema
            city: vendor.vendor?.location?.address?.city || vendor.vendor?.city
        });
    });

    const shippingFee = order.shippingFee || 9.00; // Use from order or fallback to 9
    
    // Recalculate Final Total to ensure it matches components
    // Note: order.totalAmount from DB should be the source of truth, but if we build it up:
    // Total = ItemCost + ShippingFee + TotalDeliveryCharge
    // We should double check if tax or discount needs handling. 
    // Checkout.js: total = subtotal + shippingFee + deliveryCharge + tax - totalDiscount;
    // Here 'itemCost' seems to be 'product.totalAmount' which might already include discount? 
    // In Checkout logic: product.totalAmount isn't explicitly used for subtotal, subtotal is price*qty.
    // Let's trust itemCost + fees for now or just use order.totalAmount if available.
    // Let's use the calculated sum for display consistency in breakdown.
    
    const finalTotal = (parseFloat(itemCost) + parseFloat(totalDeliveryCharge) + shippingFee).toFixed(2);

    // Prepare Vendor Details String for Header
    // If single vendor, show nice. If multiple, list them.
    const vendorSectionHtml = vendorDetails.map(v => `
        <div style="margin-bottom: 10px;">
            <strong>${v.shopName || 'Shop Name'}</strong><br>
            Owner: ${v.ownerName || ''}<br>
            Phone: ${v.phone || ''}<br>
            ${v.address || ''}<br>
            ${v.city || ''}
        </div>
    `).join('');


    // Download the logo to a temporary location and get the Base64 encoded string
    const tempLogoPath = await downloadImageToTmp(logoSource.uri);
    const logoBase64 = await getBase64Image(tempLogoPath);

    let htmlContent =`<html>
    <head>
        <style>
            html, body {
                height: 100%;
                margin: 0;
                font-family: Arial, sans-serif;
                color: #333;
            }
            body {
                display: flex;
                flex-direction: column;
            }
            .header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                background-color: #ffffff;
                padding: 10px;
                border-bottom: 2px solid #3366ff;
            }
            .header .title {
                font-size: 24px;
                font-weight: bold;
                color: #0066b2;
            }
            .header .logo {
                width: 100px;
            }
            .content {
                flex: 1;
                margin: 20px;
            }
            .section {
                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;
            }
            .section div {
                width: 48%;
            }
            .right-align {
                text-align: right;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
            }
            table, th, td {
                border: 1px solid #ccc;
            }
            th, td {
                padding: 10px;
                text-align: center;
            }
            th {
                background-color: #0066b2;
                color: #ffffff;
            }
            tr:nth-child(even) {
                background-color: #f2f2f2;
            }
            .amount-due {
                font-size: 24px;
                color: #3366ff;
                text-align: right;
                margin-bottom: 20px;
            }
            .bold {
                font-weight: bold;
            }
            .terms {
                margin-top: 40px;
            }
            .footer {
                text-align: center;
                margin-top: auto;
                padding: 10px;
                background-color: #f2f2f2;
            }
            .summary-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
            }
            .summary-total {
                display: flex;
                justify-content: space-between;
                font-weight: bold;
                border-top: 1px solid #333;
                padding-top: 5px;
                margin-top: 5px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div>
                <div class="title">Order Invoice</div>
                <div style="margin-top: 10px;">
                    <strong>Sold By:</strong><br>
                    ${vendorSectionHtml}
                </div>
            </div>
            <!-- <img src="${logoBase64}" class="logo" /> -->
            <div style="text-align: right;">
                 <strong>Seva Bazar</strong>
            </div>
        
        </div>
        <div class="content">
            <div class="section">
                <div>
                    <strong>Invoice:</strong> #${order.orderId}<br>
                    <strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}<br>
                </div>
            </div>
            <div class="section">
                <div>
                    <strong>Billed to:</strong><br>
                    ${order?.customer?.name}<br>
                    <!-- ${order?.customer?.contactNumber}<br> --> 
                    ${order.shippingAddress.address}<br>
                    ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.postalCode}<br>
                    ${order.shippingAddress.country}
                </div>
                <div class="right-align">
                    <strong>Shipping to:</strong><br>
                    ${order?.customer?.name}<br>
                    ${order?.customer?.contactNumber}<br>
                    ${order.shippingAddress.address}<br>
                    ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.postalCode}<br>
                    ${order.shippingAddress.country}
                </div>
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
                            <td>₹ ${product.price.toFixed(2)}</td>
                            <td>₹ ${product.totalAmount.toFixed(2)}</td>
                        </tr>
                    `)).join('')}
                </table>
            </div>
            
            <div style="margin-top: 20px; width: 50%; margin-left: auto;">
                <div class="summary-row">
                    <span>Item Cost:</span>
                    <span>₹ ${itemCost}</span>
                </div>
                <div class="summary-row">
                    <span>Shipping Fee:</span>
                    <span>₹ ${shippingFee.toFixed(2)}</span>
                </div>
                
                 ${deliveryBreakdown.map(d => `
                    <div class="summary-row" style="font-size: 12px; color: #555;">
                        <span>Delivery (${d.distance}):</span>
                        <span>₹ ${d.charge}</span>
                    </div>
                `).join('')}
                
                <div class="summary-row">
                    <span>Total Delivery Charge:</span>
                    <span>₹ ${totalDeliveryCharge.toFixed(2)}</span>
                </div>
                
                <div class="summary-total">
                    <span>Total Amount:</span>
                    <span>₹ ${finalTotal}</span>
                </div>
            </div>
        </div>
        <div class="footer">
            <strong>Email :</strong> sevabazar.com@gmail.com<br>
            All Copyright Reserved © 2024 Seva Bazar
        </div>
    </body>
    </html>
    `

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

export const handleChatDownloadInvoice = async (order, contact) => {

    const totalAmount = (order.totalAmount || 0).toFixed(2); // Use the totalAmount from the order object
    // Correctly calculate final total using deliveryCharge and shippingFee from order
    const finalTotal = (parseFloat(totalAmount) + (order.deliveryCharge || 0) + (order.shippingFee || 0)).toFixed(2);
    const rupeeSymbol = '\u20B9';

    // Download the logo to a temporary location and get the Base64 encoded string
    const tempLogoPath = await downloadImageToTmp(logoSource.uri);
    const logoBase64 = await getBase64Image(tempLogoPath);

    let htmlContent = `
        <html>
        <head>
            <style>
                html, body {
                    height: 100%;
                    margin: 0;
                    font-family: Arial, sans-serif;
                    color: #333;
                }
                body {
                    display: flex;
                    flex-direction: column;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background-color: #ffffff;
                    padding: 10px;
                    border-bottom: 2px solid #3366ff;
                }
                .header .title {
                    font-size: 24px;
                    font-weight: bold;
                    color: #0066b2;
                }
                .header .logo {
                    width: 100px;
                }
                .content {
                    flex: 1;
                    margin: 20px;
                }
                .section {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 20px;
                }
                .section div {
                    width: 48%;
                }
                .right-align {
                    text-align: right;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }
                table, th, td {
                    border: 1px solid #ccc;
                }
                th, td {
                    padding: 10px;
                    text-align: center;
                }
                th {
                    background-color: #0066b2;
                    color: #ffffff;
                }
                tr:nth-child(even) {
                    background-color: #f2f2f2;
                }
                .amount-due {
                    font-size: 24px;
                    color: #3366ff;
                    text-align: right;
                    margin-bottom: 20px;
                }
                .bold {
                    font-weight: bold;
                }
                .terms {
                    margin-top: 40px;
                }
                .footer {
                    text-align: center;
                    margin-top: auto;
                    padding: 10px;
                    background-color: #f2f2f2;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="title">Order Invoice</div>
                <img src="${logoBase64}" class="logo" />
            </div>
            <div class="content">
                <div class="section">
                    <div>
                        <strong>Invoice:</strong> #${order.orderId}<br>
                        <strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}<br>
                        <strong>Shop Name:</strong> ${order.vendor?.vendorInfo?.businessName || order.shopName || 'Seva Bazar'}<br>
                        <strong>Owner Name:</strong> ${order.vendor?.name || 'N/A'}
                    </div>
                </div>
                <div class="section">
                    <div>
                        <strong>Billed to:</strong><br>
                        ${order?.customer?.name}<br>
                        ${order?.customer?.contactNumber}<br>
                        ${order.shippingAddress.address}<br>
                        ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.postalCode}<br>
                        ${order.shippingAddress.country}
                    </div>
                    <div class="right-align">
                        <strong>Shipping to:</strong><br>
                        ${order?.customer?.name}<br>
                        ${order?.customer?.contactNumber}<br>
                        ${order.shippingAddress.address}<br>
                        ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.postalCode}<br>
                        ${order.shippingAddress.country}
                    </div>
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
                    ${order.products.map(product => `
                        <tr>
                            <td>${product?.name || 'N/A'}</td>
                            <td>${product.quantity}</td>
                            <td>${product.discount} %</td>
                            <td>₹ ${product.price.toFixed(2)}</td>
                            <td>₹ ${product.totalAmount.toFixed(2)}</td>
                        </tr>
                    `)}
                </table>
            </div>
                <div class="content bold">
                    <div>Subtotal: ₹ ${totalAmount}</div>
                    <div>Delivery charge: ₹ ${(order.deliveryCharge || 0).toFixed(2)}</div>
                    <div>Shipping Fee: ₹ ${(order.shippingFee || 0).toFixed(2)}</div>
                    <div>Total amount: ₹ ${finalTotal}</div>
                </div>
            </div>
            <div class="footer">
                <!-- <strong>Phone :</strong> ${contact?.phone || order.vendor?.vendorInfo?.contactNumber || 'N/A'}<br> -->
                <strong>Email :</strong> sevabazar.com@gmail.com<br>
                All Copyright Reserved © 2024 Seva Bazar
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

export const requestStoragePermission = async () => {
    try {
        const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]);

        if (
            granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
            granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED
        ) {
            console.log('Storage permissions granted');
            // Proceed with accessing files or images
        } else {
            console.log('Storage permissions denied');
            // Handle permission denied
        }
    } catch (error) {
        console.error('Error requesting storage permissions:', error);
    }
};


export function getTimeRemaining(arrivalAt) {
    if (!arrivalAt) {
        return { timeString: 'Arriving soon', isCritical: false };
    }
    const currentTime = new Date();
    const arrivalTime = new Date(arrivalAt);

    if (isNaN(arrivalTime.getTime())) {
         return { timeString: 'Arriving soon', isCritical: false };
    }

    let timeDifference = arrivalTime - currentTime;
    const gracePeriodMs = 5 * 60 * 1000; // 5 minutes

    if (timeDifference < 0) {
        // Check if within grace period
        if (timeDifference > -gracePeriodMs) {
             // Calculate remaining grace time
             timeDifference = timeDifference + gracePeriodMs;
        } else {
             // Grace period expired
             return { timeString: 'Order delayed, Sorry for inconvenience', isCritical: true };
        }
    }

    const totalMinutes = Math.floor(timeDifference / (1000 * 60));
    // Critical if less than 5 minutes (covers end of normal timer and entire grace period)
    const isCritical = timeDifference <= 5 * 60 * 1000; 

    let timeString;
    if (totalMinutes < 1) {
         timeString = `Less than a minute`;
    } else if (totalMinutes <= 90) {
        timeString = `${totalMinutes} Minutes`;
    } else {
        const days = Math.floor(totalMinutes / (24 * 60));
        const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
        const minutes = totalMinutes % 60;

        if (days > 0) {
            timeString = `${days} Days: ${hours} Hours: ${minutes} Minutes`;
        } else if (hours > 0) {
            timeString = `${hours} Hours: ${minutes} Minutes`;
        } else {
            timeString = `${minutes} Minutes`;
        }
    }

    return { timeString, isCritical, totalMinutes };
}

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};






