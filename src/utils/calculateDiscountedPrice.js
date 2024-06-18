function calculateDiscountedPrice(price, discount) {
  // console.log("price, discount-->>", price, discount)
    // Convert the price and discount from string to number
    const priceNumber = parseFloat(price);
    const discountNumber = parseFloat(discount);
  
    // Check if both price and discount are valid numbers
    if (isNaN(priceNumber) || isNaN(discountNumber)) {
      throw new Error('Invalid input: price and discount should be valid numbers');
    }
  
    // Calculate the discounted price
    const discountedPrice = priceNumber - (priceNumber * discountNumber / 100);
  
    // Return the discounted price as a string, rounded to 2 decimal places
    return discountedPrice.toFixed(2).toString();
  }

  export default calculateDiscountedPrice