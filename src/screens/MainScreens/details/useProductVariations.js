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

    console.log("cartItems-->", cartItems[0]?.variations)


    useEffect(() => {
        if (productDetails) {
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
            const selectedVariationsArr = Object.values(selectedVariations);
            const variationsArr = productDetails.variations;
            let filteredVariationsArr = variationsArr.filter(variation => selectedVariationsArr.includes(variation.attributes.value));

            filteredVariationsArr = filteredVariationsArr.map(variation => ({
                ...variation,
                quantity: 1,
            }));

            const totalPrice = filteredVariationsArr.reduce((sum, variation) =>
                sum + variation.price, 0);

            const modifiedProduct = { ...productDetails, variations: filteredVariationsArr, price:totalPrice };
            setProduct(modifyProduct(modifiedProduct));
        }
    }, [selectedVariations, quantity, productDetails]);

    useEffect(() => {
        if (productDetails) {
            dispatch(removeItem(route.params.product._id));
        }
    }, [selectedVariations, dispatch, route.params.product._id, productDetails]);

    const handleVariationChange = (type, value) => {
        setSelectedVariations(prevState => ({
            ...prevState,
            [type]: value,
        }));
    };

    const getVariationOptions = (type) => {
        return productDetails
            ? [...new Set(productDetails.variations.filter(v => v.attributes.selected === type).map(v => v.attributes.value))]
            : [];
    };

    return {
        product,
        selectedVariations,
        handleVariationChange,
        getVariationOptions,
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
