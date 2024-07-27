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


export const handleDownloadInvoice = async (order) => {
    console.log("order.vendors", order.vendors);

    const totalAmount = order.vendors.reduce((total, vendor) => {
        return total + vendor.products.reduce((vendorTotal, product) => {
            return vendorTotal + product.totalAmount;
        }, 0);
    }, 0).toFixed(2);

    const finalTotal = (parseFloat(totalAmount) + 20).toFixed(2);
    const rupeeSymbol = 'rs';

    console.log("logo-->>>", logo);

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
        <!-- <img src="${logoBase64}" class="logo" /> -->
        <strong>Seva Bazar</strong>
        
        </div>
        <div class="content">
            <div class="section">
                <div>
                    <strong>Invoice:</strong> #${order.orderId}<br>
                    <strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}<br>
                    <strong>Shop Name:</strong> ${order.shopName || 'undefined'}
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
            <div class="content bold">
                <div>Subtotal: ₹ ${totalAmount}</div>
                <div>Delivery charge: ₹ 20</div>
                <div>Total amount: ₹ ${finalTotal}</div>
            </div>
        </div>
        <div class="footer">
            <strong>Phone :</strong> 8809959154<br>
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

export const handleChatDownloadInvoice = async (order) => {

    const totalAmount = (order.totalAmount || 0).toFixed(2); // Use the totalAmount from the order object
    const finalTotal = (parseFloat(totalAmount) + 20).toFixed(2); // Assuming there is a delivery charge of 20
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
                        <strong>Shop Name:</strong> ${order.shopName || 'undefined'}
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
                    <div>Delivery charge: ₹ 20</div>
                    <div>Total amount: ₹ ${finalTotal}</div>
                </div>
            </div>
            <div class="footer">
                <strong>Phone :</strong> 8809959154<br>
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
    const currentTime = new Date();
    const arrivalTime = new Date(arrivalAt);
    const timeDifference = arrivalTime - currentTime;

    if (timeDifference < 0) {
        return { timeString: 'Order delayed, Sorry for inconvenience', isCritical: true };
    }

    const totalMinutes = Math.floor(timeDifference / (1000 * 60));
    const isCritical = timeDifference <= 5 * 60 * 1000; // 5 minutes in milliseconds

    let timeString;
    if (totalMinutes <= 90) {
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

    return { timeString, isCritical };
}






