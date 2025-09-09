import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchAllProducts,
  updateAllProductsPage,
  resetAllProducts,
} from '../../../../config/redux/actions/fetchAllProductsActions';

/**
 * Custom hook to manage the state and logic for infinitely scrolling "All Products".
 */
export const useInfiniteScroll = user => {
  const dispatch = useDispatch();

  const {
    loading: allProductsLoading,
    products: allProducts,
    error: allProductsError,
    page,
    limit,
    reachedEnd,
  } = useSelector(state => state.allProducts);

  // Effect to fetch the next page of products when the page number changes
  useEffect(() => {
    if (!reachedEnd && !allProductsLoading) {
      dispatch(fetchAllProducts(page, limit, user?.availableLocalities));
    }
  }, [page, dispatch, user]);

  // Effect to reset the products list when the component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetAllProducts());
    };
  }, [dispatch]);

  // Function to trigger fetching the next page
  const fetchMoreProducts = () => {
    if (!allProductsLoading && !reachedEnd) {
      dispatch(updateAllProductsPage(page + 1));
    }
  };

  return {
    allProducts,
    allProductsLoading,
    allProductsError,
    fetchMoreProducts,
  };
};
