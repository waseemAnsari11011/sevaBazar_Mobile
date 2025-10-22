import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getBanners} from '../../../../config/redux/actions/bannerActions';
import {fetchCategories} from '../../../../config/redux/actions/categoryAction';
import {fetchDiscountedProducts} from '../../../../config/redux/actions/discountedProductsActions';
import {fetchAllCategoryProducts} from '../../../../config/redux/actions/getallCategoryProductsActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {updateFcm} from '../../../../config/redux/actions/customerActions';
import {
  fetchRecentlyAddedVendors,
  resetRecentlyAddedVendors,
} from '../../../../config/redux/actions/recentlyAddedVendorsActions';

/**
 * Custom hook to fetch and manage initial data for the HomeScreen.
 * This includes banners, categories, discounted products, and all category products.
 * It also handles updating the user's FCM token.
 */
export const useHomeScreenData = () => {
  const dispatch = useDispatch();

  // Selectors to get data from the Redux store
  const {user} = useSelector(state => state?.local?.data || {});
  const {
    loading: categoryLoading,
    category,
    error: categoryError,
  } = useSelector(state => state.categories);
  const {banners} = useSelector(state => state.banners);
  const {products: onDiscountProducts} = useSelector(
    state => state.discountedProducts,
  );
  const {data: allCategoryProducts} = useSelector(
    state => state.allCategoryProducts,
  );

  // Effect to update the FCM device token for push notifications
  useEffect(() => {
    const fetchAndUpdateFcm = async () => {
      if (user?._id) {
        const deviceToken = await AsyncStorage.getItem('deviceToken');
        const deviceTokenData = JSON.parse(deviceToken);
        if (deviceTokenData) {
          await updateFcm(user._id, deviceTokenData);
        }
      }
    };
    fetchAndUpdateFcm();
  }, [user?._id]);

  // Effect to fetch initial data required for the screen
  useEffect(() => {
    const availableLocalities = user?.availableLocalities;
    dispatch(getBanners());
    dispatch(fetchCategories());
    dispatch(fetchDiscountedProducts(1, 4, availableLocalities));
    dispatch(fetchAllCategoryProducts(availableLocalities));

    // 👇 ADDED THIS SECTION
    // Reset any previous vendor data and fetch the first page of new vendors
    dispatch(resetRecentlyAddedVendors());
    dispatch(fetchRecentlyAddedVendors(1, 10));
  }, [dispatch, user]);

  return {
    user,
    categoryLoading,
    categories: category,
    categoryError,
    banners,
    onDiscountProducts,
    allCategoryProducts,
  };
};
