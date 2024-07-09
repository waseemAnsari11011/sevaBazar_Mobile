import RNHTMLtoPDF from 'react-native-html-to-pdf';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';
import { Alert, Image } from 'react-native';

const logo = require('../../../assets/images/brand.png');
const logoSource = Image.resolveAssetSource(logo);

// Download the image to a temporary location
const downloadImageToTmp = async (imageUri) => {
    const destPath = `${RNFS.TemporaryDirectoryPath}/brand.png`;
    try {
        // Download the file
        const downloadResult = await RNFS.downloadFile({
            fromUrl: imageUri,
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


// export const handleChatDownloadInvoice = async (order) => {
//     console.log("order.vendors", order.vendors);

//     const totalAmount = (order.totalAmount || 0).toFixed(2); // Use the totalAmount from the order object
//     const finalTotal = (parseFloat(totalAmount) + 20).toFixed(2); // Assuming there is a delivery charge of 20
//     const rupeeSymbol = '\u20B9';

//     let htmlContent = `
//         <html>
//         <head>
//             <style>
//                 body { font-family: Arial, sans-serif; color: #333; }
//                 .header, .footer { text-align: center; margin-top:50px }
//                 .header { font-size: 24px; color: white; background-color: #3366ff; padding: 10px; }
//                 .content { margin: 20px; }
//                 .section { display: flex; justify-content: space-between; margin-bottom: 20px; }
//                 .section div { width: 48%; }
//                 .amount-due { font-size: 24px; color: #3366ff; text-align: right; margin-bottom: 20px; }
//                 table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//                 table, th, td { border: 1px solid #ccc; }
//                 th, td { padding: 10px; text-align: center; }
//                 th { background-color: #f2f2f2; }
//                 .terms { margin-top: 40px; }
//             </style>
//         </head>
//         <body>
//             <div class="header">
//                 <div>Seva Bazar</div>
//                 <div>Invoice</div>
//             </div>
//             <div class="content">
//                 <div class="section">
//                     <div>
//                         <strong>Reference:</strong> #${order.orderId}<br>
//                         <strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}<br>
//                         <strong>Invoice number:</strong> ${order.orderId}
//                     </div>
//                     <div>
//                         <strong>Billed to:</strong><br>
//                         ${order.customer.name}<br>
//                         ${order.shippingAddress.address}<br>
//                         ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.postalCode}<br>
//                         ${order.shippingAddress.country}
//                     </div>
//                     <div>
//                         <strong>Shipping address:</strong><br>
//                         ${order.customer.name}<br>
//                         ${order.shippingAddress.address}<br>
//                         ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.postalCode}<br>
//                         ${order.shippingAddress.country}
//                     </div>
//                     <div>
//                         <strong>From:</strong><br>
//                         Seva Bazar<br>
//                         West Bengal<br>
//                         India<br>
//                         713301 - Asansol<br>
//                         India
//                     </div>
//                 </div>
//                 <div class="amount-due">
//                     <strong>Amount due:</strong><br>
//                     <span>${rupeeSymbol} ${finalTotal}</span>
//                 </div>
//                 <div class="products">
//                     <table>
//                         <tr>
//                             <th>Items</th>
//                             <th>Amount</th>
//                         </tr>
//                         <tr>
//                         <td>${order.orderMessage}</td>
//                         <td>${rupeeSymbol} ${order.totalAmount.toFixed(2)}</td>
//                     </tr>
//                     </table>
//                 </div>
//                 <div class="content">
//                     <div>Subtotal: ${rupeeSymbol} ${totalAmount}</div>
//                     <div>Delivery charge: ${rupeeSymbol} 20</div>
//                     <div>Total amount: ${rupeeSymbol} ${finalTotal}</div>
//                 </div>
//                 <div class="terms">
//                     <strong>Terms & notes</strong><br>
//                     Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia
//                     molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum
//                     numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium
//                 </div>
//                 <div class="footer">
//                     Thank you!
//                 </div>
//             </div>
//         </body>
//         </html>
//     `;

//     let options = {
//         html: htmlContent,
//         fileName: `invoice_${order.orderId}`,
//         directory: 'Documents',
//     };

//     try {
//         let file = await RNHTMLtoPDF.convert(options);
//         console.log(file.filePath);
//         await FileViewer.open(file.filePath);
//     } catch (error) {
//         console.error('Error generating or opening PDF:', error);
//         Alert.alert('Error', 'There was an error generating or opening the PDF.');
//     }
// };
