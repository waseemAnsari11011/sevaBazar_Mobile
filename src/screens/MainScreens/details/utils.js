// src/utils.js
export const filterUniqueVariations = (variations) => {
  const uniqueVariations = {};
  variations.forEach(variation => {
    const type = variation.attributes.selected;
    if (!uniqueVariations[type]) {
      uniqueVariations[type] = variation;
    }
  });
  return Object.values(uniqueVariations);
};

export const removeQuantityField = (product) => {
  const { quantity, ...rest } = product;
  return rest;
};

export const updatePriceAndDiscount = (variations) => {
  const updatedPrice = variations.reduce((sum, variation) => sum + variation.price, 0);
  const updatedDiscount = variations.reduce((sum, variation) => sum + variation.discount, 0);
  return { updatedPrice, updatedDiscount };
};

export const modifyProduct = (product) => {
  const filteredVariations = filterUniqueVariations(product.variations);
  const modifiedProduct = removeQuantityField(product);
  const { updatedPrice, updatedDiscount } = updatePriceAndDiscount(filteredVariations);

  return {
    ...modifiedProduct,
    variations: filteredVariations,
    price: updatedPrice,
    discount: updatedDiscount,
  };
};

export const processProductVariations = (variations) => {
  const result = {};
  const seenTypes = new Set();
  const parentChildMap = new Map();

  for (const variation of variations) {
    const { selected, value } = variation.attributes;
    const { parentVariation } = variation;

    if (parentVariation === null && !seenTypes.has(selected)) {
      // This is a parent variation and the type hasn't been seen yet
      seenTypes.add(selected);
      result[selected] = value;
      parentChildMap.set(variation._id.toString(), false); // Store the parent variation ID
    } else if (parentChildMap.has(parentVariation) && !parentChildMap.get(parentVariation)) {
      // This is a child variation and its parent hasn't been assigned a child yet
      result[`${selected}`] = value;
      parentChildMap.set(parentVariation, true); // Mark this parent as having an assigned child
    }
  }

  return result;
};


export function getFirstElementOfEachVariationType(variations) {
  const seenTypes = new Set();
  const firstElements = [];

  for (const variation of variations) {
    const type = variation.attributes.selected;
    if (!seenTypes.has(type)) {
      seenTypes.add(type);
      firstElements.push(variation);
    }
  }

  return firstElements;
}


export function isImagePresent(arr, type) {
  // Iterate over each item in the array
  for (let item of arr) {
    // Check if the selected attribute matches the given type
    if (item.attributes.selected === type) {
      // Check if the image property is not null or undefined
      if (item?.images?.length >0) {
        return true;
      }
    }
  }
  // If no matching item with an image is found, return false
  return false;
}

export function getImages(variations, selectedVariations) {
  // Filter variations based on selectedVariations
  const filteredVariations = variations.filter(variation => {
    // Check if variation.attributes.value is in selectedVariations
    return selectedVariations.includes(variation.attributes.value);
  });

  // Extract images from filtered variations
  const images = filteredVariations.flatMap(variation => variation.images);

  return images;
}