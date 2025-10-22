// src/screens/MainScreens/details/useProductVariations.js

import {useState, useEffect, useMemo, useCallback} from 'react';

const useProductVariations = variations => {
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [currentVariation, setCurrentVariation] = useState(null);

  const attributeTypes = useMemo(() => {
    if (!variations || variations.length === 0) return [];
    const types = new Set();
    variations.forEach(v => v.attributes.forEach(attr => types.add(attr.name)));
    return Array.from(types);
  }, [variations]);

  // This effect finds the currently active variation based on the selections
  useEffect(() => {
    if (!variations || Object.keys(selectedAttributes).length === 0) return;

    const foundVariation = variations.find(variation => {
      // A variation matches if for EACH attribute type, at least one of the
      // variation's attributes of that type matches the selected value
      return attributeTypes.every(type => {
        const selectedValue = selectedAttributes[type];
        // Find if this variation has the selected value for this attribute type
        return variation.attributes.some(
          attr => attr.name === type && attr.value === selectedValue,
        );
      });
    });

    setCurrentVariation(foundVariation || null);
  }, [selectedAttributes, variations, attributeTypes]);

  // Set the initial default variation on load
  useEffect(() => {
    if (variations && variations.length > 0) {
      const firstVariation = variations[0];
      const initialSelections = {};

      // For each attribute type, pick the first value found
      attributeTypes.forEach(attrType => {
        const firstAttr = firstVariation.attributes.find(
          attr => attr.name === attrType,
        );
        if (firstAttr) {
          initialSelections[attrType] = firstAttr.value;
        }
      });

      setSelectedAttributes(initialSelections);
    }
  }, [variations, attributeTypes]);

  // Gets all unique options for a given attribute type across ALL variations
  const getAvailableOptions = useCallback(
    attributeName => {
      if (!variations) return [];
      const options = new Set();
      variations.forEach(variation => {
        // A variation can have multiple attributes with the same name
        variation.attributes.forEach(attr => {
          if (attr.name === attributeName) {
            options.add(attr.value);
          }
        });
      });
      return Array.from(options);
    },
    [variations],
  );

  /**
   * Check if an option exists in the product at all
   * All real options should always be clickable - auto-adjustment handles invalid combos
   */
  const isOptionAvailable = useCallback(
    (attributeName, optionValue) => {
      if (!variations) return false;

      // An option is available if it exists in at least one variation
      return variations.some(variation =>
        variation.attributes.some(
          attr => attr.name === attributeName && attr.value === optionValue,
        ),
      );
    },
    [variations],
  );

  /**
   * Handle attribute selection with smart behavior
   */
  const handleSelectAttribute = (name, value) => {
    // Create potential new selection
    const potentialSelection = {...selectedAttributes, [name]: value};

    // Check if this exact combination exists in any variation
    const matchingVariation = variations.find(variation => {
      return attributeTypes.every(type => {
        const selectedValue = potentialSelection[type];
        return variation.attributes.some(
          attr => attr.name === type && attr.value === selectedValue,
        );
      });
    });

    if (matchingVariation) {
      // Direct match found - just update the selection
      setSelectedAttributes(potentialSelection);
    } else {
      // No direct match - find best variation with this attribute value
      const bestMatch = variations.find(variation =>
        variation.attributes.some(
          attr => attr.name === name && attr.value === value,
        ),
      );

      if (bestMatch) {
        // Build full selection from this variation (taking first value for each attribute type)
        const fullSelection = {};
        attributeTypes.forEach(attrType => {
          const attr = bestMatch.attributes.find(a => a.name === attrType);
          if (attr) {
            fullSelection[attrType] = attr.value;
          }
        });
        setSelectedAttributes(fullSelection);
      }
    }
  };

  return {
    currentVariation,
    attributeTypes,
    selectedAttributes,
    handleSelectAttribute,
    getAvailableOptions,
    isOptionAvailable,
  };
};

export default useProductVariations;
