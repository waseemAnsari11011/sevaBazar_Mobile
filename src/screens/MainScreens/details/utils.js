// src/screens/MainScreens/details/utils.js

/**
 * Gets the images for the current variation, with a fallback to the main product's first variation images.
 * @param {object} currentVariation - The currently selected variation object.
 * @param {object} product - The main product object.
 * @returns {Array<string>} An array of image URLs.
 */
export const getImages = (currentVariation, product) => {
  if (currentVariation?.images?.length > 0) {
    return currentVariation.images;
  }
  if (product?.variations?.[0]?.images?.length > 0) {
    return product.variations[0].images;
  }
  return []; // Return empty array if no images are found
};
