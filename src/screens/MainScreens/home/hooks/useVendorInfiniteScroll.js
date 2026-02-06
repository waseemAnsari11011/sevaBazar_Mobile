import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchRecentlyAddedVendors,
    updateRecentlyAddedVendorsPage,
    resetRecentlyAddedVendors,
} from '../../../../config/redux/actions/recentlyAddedVendorsActions';

/**
 * Custom hook to manage the state and logic for infinitely scrolling vendors.
 */
export const useVendorInfiniteScroll = () => {
    const dispatch = useDispatch();

    const {
        loading: vendorsLoading,
        vendors,
        error: vendorsError,
        page,
        limit,
        reachedEnd,
    } = useSelector(state => state.recentlyAddedVendors);

    // Effect to fetch the next page of vendors when the page number changes
    useEffect(() => {
        if (!reachedEnd && !vendorsLoading && page > 0) {
            dispatch(fetchRecentlyAddedVendors(page, limit));
        }
    }, [page, dispatch, reachedEnd]);

    // Effect to reset the vendors list when the component unmounts
    useEffect(() => {
        return () => {
            // dispatch(resetRecentlyAddedVendors()); 
            // Note: We might NOT want to reset if we want to preserve state when navigating back.
            // But for the home screen, if it's a fresh mount/unmount cycle, it's safer.
        };
    }, [dispatch]);

    // Function to trigger fetching the next page
    const fetchMoreVendors = () => {
        if (!vendorsLoading && !reachedEnd) {
            dispatch(updateRecentlyAddedVendorsPage(page + 1));
        }
    };

    return {
        vendors,
        vendorsLoading,
        vendorsError,
        fetchMoreVendors,
        reachedEnd,
    };
};
