// SearchScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { searchProducts, resetSearchResults, updateSearchQuery } from '../../config/redux/actions/searchActions';
import SearchBar from '../../components/SearchBar';
import CategoryProductsCard from '../../components/CategoryProductsCard';
import StickyButton from '../../components/stickyBottomCartBtn';

const SearchScreen = ({navigation}) => {
    const dispatch = useDispatch();
    const { cartItems } = useSelector(state => state.cart);
    const {data} = useSelector(state => state?.local);

    const { products, loading, error, query } = useSelector((state) => state.search);
    const [searchInput, setSearchInput] = useState(query);


    useEffect(() => {
        if (query) {
            dispatch(searchProducts(query,1,10, data?.user.availableLocalities));
        }
        return () => {
            dispatch(resetSearchResults());
        };
    }, [dispatch, query]);

    const handleSearch = (text) => {
        dispatch(updateSearchQuery(text));
    };

    // const renderItem = ({ item }) => (
    //     <View style={styles.productItem}>
    //         <Text>{item.name}</Text>
    //     </View>
    // );

    const renderItem = ({ item, index }) => {
        return (
            <View style={[index === products.length - 1 && cartItems.length > 0 ? styles.lastItem : index === products.length - 1 && { marginBottom: 15 }, index === 0 && { marginTop: 15 }]}>
                <CategoryProductsCard
                    item={item}
                    onPressNavigation={() =>
                        navigation.navigate('Details', { product: item })
                    }
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
            // onSubmitEditing={handleSearch}
            />
            {loading && <View style={{  justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>}
            {error && <Text>Error: {error}</Text>}
            {!loading && !error && (
                <FlatList
                    data={products}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id.toString()}
                    ItemSeparatorComponent={({ highlighted }) =>
                        highlighted ? null : renderSeparator()
                    }
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
        padding: 16,
    },
    productItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    separator: {
        // borderBottomWidth: 1,
        // borderBottomColor: 'lightgray',
        marginBottom: 15
    },
});

export default SearchScreen;
