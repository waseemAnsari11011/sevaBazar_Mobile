// src/screens/MainScreens/details/utils.js

/**
 * Gets the images for the current variation, with a fallback to the main product's first variation images.
 * @param {object} currentVariation - The currently selected variation object.
 * @param {object} product - The main product object.
 * @returns {Array<string>} An array of image URLs.
 */
export const getImages = (currentVariation, product) => {
  if (currentVariation) {
    const media = [
      ...(currentVariation.images || []),
      ...(currentVariation.videos || []),
    ];
    if (media.length > 0) return media;
  }

  if (product?.variations?.[0]) {
    const firstVar = product.variations[0];
    const media = [...(firstVar.images || []), ...(firstVar.videos || [])];
    if (media.length > 0) return media;
  }

  return []; // Return empty array if no media is found
};
