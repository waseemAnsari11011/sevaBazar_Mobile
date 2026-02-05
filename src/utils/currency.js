/**
 * Formats a currency amount by rounding it to the nearest integer.
 * @param {number|string} amount - The amount to format.
 * @returns {string} - The formatted amount with currency symbol.
 */
export const formatCurrency = (amount) => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) return '₹0';
    return `₹${Math.round(numericAmount)}`;
};
