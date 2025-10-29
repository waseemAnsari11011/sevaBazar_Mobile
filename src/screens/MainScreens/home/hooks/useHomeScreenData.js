import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getBanners} from '../../../../config/redux/actions/bannerActions';
import {fetchCategories} from '../../../../config/redux/actions/categoryAction';
import {fetchAllCategoryProducts} from '../../../../config/redux/actions/getallCategoryProductsActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {updateFcm} from '../../../../config/redux/actions/customerActions';
import {
  fetchRecentlyAddedVendors,
  resetRecentlyAddedVendors,
} from '../../../../config/redux/actions/recentlyAddedVendorsActions';
import {
  fetchVendorsWithDiscounts,
  resetVendorsWithDiscounts,
} from '../../../../config/redux/actions/vendorsWithDiscountsActions';
// 👇 ADD THESE IMPORTS
import {
  fetchAllVendorsGrouped,
  resetAllVendorsGrouped,
} from '../../../../config/redux/actions/vendorActions';

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

  const {vendors: vendorsWithDiscounts, loading: vendorsWithDiscountsLoading} =
    useSelector(state => state.vendorsWithDiscounts);

  const {data: allCategoryProducts} = useSelector(
    state => state.allCategoryProducts,
  );

  // 👇 ADD THIS SELECTOR
  const {
    data: groupedVendors,
    loading: groupedVendorsLoading,
    error: groupedVendorsError,
  } = useSelector(state => state.vendors.groupedList);

  // TODO: Add your FCM token logic back in if you have it
  // ... (useEffect for FCM token remains the same)

  // Effect to fetch initial data required for the screen
  useEffect(() => {
    dispatch(getBanners());
    dispatch(fetchCategories());
    dispatch(fetchAllCategoryProducts());

    // Fetch Recently Added Vendors
    dispatch(resetRecentlyAddedVendors());
    dispatch(fetchRecentlyAddedVendors(1, 10));

    // Fetch Vendors with Discounts
    dispatch(resetVendorsWithDiscounts());
    dispatch(fetchVendorsWithDiscounts(1, 10)); // Fetch first 10 for the carousel

    // 👇 ADD THIS SECTION
    // Fetch All Vendors Grouped by Category
    dispatch(resetAllVendorsGrouped());
    dispatch(fetchAllVendorsGrouped());
  }, [dispatch, user]); // user dependency might re-trigger fetches if user object changes

  return {
    user,
    categoryLoading,
    categories: category,
    categoryError,
    banners,
    vendorsWithDiscounts,
    vendorsWithDiscountsLoading,
    allCategoryProducts,
    // 👇 ADD THESE
    groupedVendors,
    groupedVendorsLoading,
    groupedVendorsError,
  };
};
