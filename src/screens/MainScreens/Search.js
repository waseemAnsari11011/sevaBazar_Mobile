// SearchScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { searchProducts, searchVendors, resetSearchResults, updateSearchQuery } from '../../config/redux/actions/searchActions';
import VendorCard from './vendors/VendorCard';
import SearchBar from '../../components/SearchBar';
import ProductCard from '../../components/ProductCard';
import StickyButton from '../../components/stickyBottomCartBtn';

const SearchScreen = ({navigation}) => {
    const dispatch = useDispatch();
    const { cartItems } = useSelector(state => state.cart);
    const {data} = useSelector(state => state?.local);

    const { products, vendors, loading, error, query } = useSelector((state) => state.search);

    useEffect(() => {
        if (query) {
            dispatch(searchProducts(query,1,10, data?.user.availableLocalities));
            dispatch(searchVendors(query));
        }
        return () => {
            dispatch(resetSearchResults());
        };
    }, [dispatch, query]);

    const handleSearch = (text) => {
        dispatch(updateSearchQuery(text));
    };

    const renderItem = ({ item }) => {
        return (
            <View style={styles.productWrapper}>
                <ProductCard
                    item={item}
                    navigation={navigation}
                />
            </View>
        );
    };

    const renderSeparator = () => <View style={styles.separator} />;

    return (
        <>
        <View style={styles.container}>
            <SearchBar
                isInput={true}
                onChangeText={(text) => handleSearch(text)}
            />
            {loading && <View style={{  justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                <ActivityIndicator size="large" color="#ff6600" />
            </View>}
            {error && <Text style={styles.errorText}>Error: {error}</Text>}
            {!loading && !error && (
                <FlatList
                    data={products}
                    numColumns={2}
                    key={2} // Force re-render when changing numColumns, though strictly static here
                    ListHeaderComponent={() => (
                        <View style={styles.headerContainer}>
                            {vendors && vendors.length > 0 && (
                                <View style={styles.sectionContainer}>
                                    <Text style={styles.sectionTitle}>Vendors</Text>
                                    <FlatList
                                        data={vendors}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        renderItem={({ item }) => (
                                            <View style={styles.vendorCardWrapper}>
                                                <VendorCard
                                                    vendor={item}
                                                    onPress={() => navigation.navigate('VendorDetails', { vendorId: item._id })}
                                                />
                                            </View>
                                        )}
                                        keyExtractor={(item) => item._id.toString()}
                                    />
                                </View>
                            )}
                            {products && products.length > 0 && (
                                <Text style={styles.sectionTitle}>Products</Text>
                            )}
                        </View>
                    )}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id.toString()}
                    columnWrapperStyle={styles.columnWrapper}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
        {cartItems.length > 0 && <StickyButton navigation={navigation} />}

        </>
        
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        paddingTop: 60, // Match previous top padding or adjust for header
    },
    headerContainer: {
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    sectionContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18, 
        fontWeight: 'bold', 
        marginBottom: 10, 
        color: '#333',
        marginLeft: 5
    },
    vendorCardWrapper: {
        width: 300, 
        marginRight: 15
    },
    productWrapper: {
        flex: 1,
        padding: 5,
        maxWidth: '50%', // Ensure 2 columns
    },
    columnWrapper: {
        justifyContent: 'space-between',
        paddingHorizontal: 5,
    },
    listContent: {
        paddingBottom: 80, // Space for sticky button/bottom tab
    },
    separator: {
        marginBottom: 15
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20
    }
});

export default SearchScreen;
