// src/hooks/useProductVariations.js
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { modifyProduct, processProductVariations } from './utils'; // Adjust the import path if needed
import { fetchSimilarProducts, resetSimilarProducts } from '../../../config/redux/actions/similiarProductsActions';
import { updateSimilarProductsPage } from '../../../config/redux/actions/searchActions';
import { removeItem } from '../../../config/redux/actions/cartActions';

const useProductVariations = (productDetails, route) => {
    const dispatch = useDispatch();
    const [selectedVariations, setSelectedVariations] = useState([]);
    const [product, setProduct] = useState(null);
    const { loading, page, limit, reachedEnd, products } = useSelector(state => state.similarProducts);
    const cartItems = useSelector(state => state.cart.cartItems);
    const { data } = useSelector(state => state.local); // Ensure this selector points to the correct state slice
    const existingItemIndex = cartItems.findIndex(i => i._id === productDetails?._id);
    const quantity = existingItemIndex !== -1 ? cartItems[existingItemIndex].quantity : 0;
    const flatListRef = useRef(null);


    useEffect(() => {
        if (productDetails) {
            console.log("productDetails.variations", productDetails.variations)
            setSelectedVariations(processProductVariations(productDetails.variations));
            setProduct(modifyProduct(productDetails));
        }
    }, [productDetails]);

    useEffect(() => {
        if (productDetails && !reachedEnd && !loading) {
            dispatch(fetchSimilarProducts(productDetails._id, page, limit, data?.user.availableLocalities));
        }
    }, [page]);

    useEffect(() => {
        return () => {
            dispatch(resetSimilarProducts());
        };
    }, [dispatch]);

    useEffect(() => {
        if (productDetails && Object.values(selectedVariations).length > 0) {
            // setSelectedVariations(processProductVariations(productDetails.variations));
            const selectedVariationsArr = Object.values(selectedVariations);
            const variationsArr = productDetails.variations;
            let filteredVariationsArr = variationsArr.filter(variation => selectedVariationsArr.includes(variation.attributes.value));

            filteredVariationsArr = filteredVariationsArr.map(variation => ({
                ...variation,
                quantity: 1,
            }));

            const totalPrice = filteredVariationsArr.reduce((sum, variation) =>
                sum + variation.price, 0);

            const modifiedProduct = { ...productDetails, variations: filteredVariationsArr, price: totalPrice };
            setProduct(modifyProduct(modifiedProduct));
        }
    }, [selectedVariations, quantity, productDetails]);

    useEffect(() => {
        if (productDetails) {
            dispatch(removeItem(route.params.product._id));
        }
    }, [selectedVariations, dispatch, route.params.product._id, productDetails]);

    const handleVariationChange = (type, value) => {
        console.log("type, value-->>", type, value)
        const variations = productDetails.variations;
        let selectedVariation = null;
        let parentVariation = null;
        let childVariation = null;

        // Find the variation with the given type and value
        selectedVariation = variations.find(variation =>
            variation.attributes.selected === type && variation.attributes.value === value
        );


        if (selectedVariation) {
            if (selectedVariation.parentVariation === null) {
                // It's a parent, find its first child
                parentVariation = selectedVariation;
                childVariation = variations.find(variation =>
                    variation.parentVariation === selectedVariation._id
                );
            } else {
                // It's a child, find its parent
                childVariation = selectedVariation;
                parentVariation = variations.find(variation =>
                    variation._id === selectedVariation.parentVariation
                );
            }
        }

        const result = {
            parent_selected: parentVariation ? parentVariation.attributes.selected : null,
            parent_value: parentVariation ? parentVariation.attributes.value : null,
            child_selected: childVariation ? childVariation.attributes.selected : null,
            child_value: childVariation ? childVariation.attributes.value : null
        };

        console.log("Result:", result);

        // Dynamically create the updated selected variations
        const updatedSelectedVariations = {};
        if (result.parent_selected && result.parent_value) {
            updatedSelectedVariations[result.parent_selected] = result.parent_value;
        }
        if (result.child_selected && result.child_value) {
            updatedSelectedVariations[result.child_selected] = result.child_value;
        }

        setSelectedVariations(prevState => ({
            ...prevState,
            ...updatedSelectedVariations
        }));
    };



    // const getVariationOptions = (type, selectedVariations) => {
    //     let variations = productDetails.variations
    //     console.log("type-->>", type)
    //     console.log("selectedVariations-->>", selectedVariations)

    //     return productDetails
    //         ? [...new Set(productDetails.variations.filter(v => v.attributes.selected === type).map(v => v.attributes.value))]
    //         : [];
    // };

    const getVariationOptions = (type, selectedVariations) => {
        // console.log("type, selectedVariations-->>", type, selectedVariations)
        // Filter variations based on the selected type
        const filteredVariations = productDetails?.variations.filter(variation => variation.attributes.selected === type);

        // Check if the type exists in selectedVariations and get its value
        const foundValueInSelectedVariations = selectedVariations[type];

        // Determine if foundValueInSelectedVariations is a parent or child
        let options = [];
        if (foundValueInSelectedVariations) {
            const isParent = filteredVariations.some(variation => variation.attributes.value === foundValueInSelectedVariations && !variation.parentVariation);
            const isChild = filteredVariations.some(variation => variation.attributes.value === foundValueInSelectedVariations && variation.parentVariation);

            if (isParent) {
                // Find other parents of the same type
                options = filteredVariations
                    .filter(variation => !variation.parentVariation)
                    .map(variation => variation.attributes.value);
            } else if (isChild) {
                // Find other children of the same type
                const parentVariationId = filteredVariations.find(variation => variation.attributes.value === foundValueInSelectedVariations && variation.parentVariation)?.parentVariation;
                options = filteredVariations
                    .filter(variation => variation.parentVariation === parentVariationId)
                    .map(variation => variation.attributes.value);
            }
        } else {
            // No selected value, return all values for the type
            options = filteredVariations?.map(variation => variation.attributes.value);
        }

        // Ensure unique values and return the result
        return [...new Set(options)];
    };

    const getColorVariationOptions = (type, selectedVariations) => {
        // console.log("type, selectedVariations-->>", type, selectedVariations);
        
        // Filter variations based on the selected type
        const filteredVariations = productDetails.variations.filter(variation => variation.attributes.selected === type);
    
        // Check if the type exists in selectedVariations and get its value
        const foundValueInSelectedVariations = selectedVariations[type];
    
        // Determine if foundValueInSelectedVariations is a parent or child
        let options = [];
        if (foundValueInSelectedVariations) {
            const isParent = filteredVariations.some(variation => variation.attributes.value === foundValueInSelectedVariations && !variation.parentVariation);
            const isChild = filteredVariations.some(variation => variation.attributes.value === foundValueInSelectedVariations && variation.parentVariation);
    
            if (isParent) {
                // Find other parents of the same type
                options = filteredVariations
                    .filter(variation => !variation.parentVariation)
                    .map(variation => ({
                        label: variation.attributes.value.charAt(0).toUpperCase() + variation.attributes.value.slice(1),
                        value: variation.attributes.value,
                        icon: { uri: variation.images[0] } // Assuming the image URL is stored here
                    }));
            } else if (isChild) {
                // Find other children of the same type
                const parentVariationId = filteredVariations.find(variation => variation.attributes.value === foundValueInSelectedVariations && variation.parentVariation)?.parentVariation;
                options = filteredVariations
                    .filter(variation => variation.parentVariation === parentVariationId)
                    .map(variation => ({
                        label: variation.attributes.value.charAt(0).toUpperCase() + variation.attributes.value.slice(1),
                        value: variation.attributes.value,
                        icon: { uri: variation.images[0] } // Assuming the image URL is stored here
                    }));
            }
        } else {
            // No selected value, return all values for the type
            options = filteredVariations.map(variation => ({
                label: variation.attributes.value.charAt(0).toUpperCase() + variation.attributes.value.slice(1),
                value: variation.attributes.value,
                icon: { uri: variation.attributes.image } // Assuming the image URL is stored here
            }));
        }
    
        // Ensure unique values and return the result
        return [...new Set(options.map(option => JSON.stringify(option)))].map(item => JSON.parse(item));
    };
    


    return {
        product,
        selectedVariations,
        handleVariationChange,
        getVariationOptions,
        getColorVariationOptions,
        flatListRef,
        existingItemIndex,
        quantity,
        loading,
        products,
        fetchMoreProducts: () => {
            if (!loading && !reachedEnd) {
                dispatch(updateSimilarProductsPage(page + 1));
            }
        },
    };
};

export default useProductVariations;
