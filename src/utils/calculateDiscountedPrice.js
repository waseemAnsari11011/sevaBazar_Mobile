/**
 * Calculates the discounted price and returns both original and discounted values.
 * Handles invalid inputs gracefully without throwing an error.
 * @param {number | string | undefined} price - The original price.
 * @param {number | string | undefined} discount - The discount percentage.
 * @returns {{originalPrice: string, discountedPrice: string}} An object with prices formatted to two decimal places.
 */
function calculateDiscountedPrice(price, discount) {
  const priceNumber = parseFloat(price);
  const discountNumber = parseFloat(discount);

  // Guard clause: If price is not a valid number, return zeroed values.
  if (isNaN(priceNumber)) {
    return {originalPrice: '0.00', discountedPrice: '0.00'};
  }

  // If discount is not a valid number, default it to 0.
  const validDiscount = isNaN(discountNumber) ? 0 : discountNumber;

  const discountedValue = priceNumber - (priceNumber * validDiscount) / 100;

  // Return a structured object with formatted strings.
  return {
    originalPrice: priceNumber.toFixed(2),
    discountedPrice: discountedValue.toFixed(2),
  };
}

export default calculateDiscountedPrice;
