import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import the hook
import ProductCard from './ProductCard'; // Assuming ProductCard is a component for displaying product details
import Icon from './Icons/Icon'; // Adjust path according to your project structure
import { resetFetchAllCategoryProducts } from '../config/redux/actions/getallCategoryProductsActions';
import { useDispatch } from 'react-redux';
import { resetProductsByCategory } from '../config/redux/actions/productsByCategoryActions';

const AllCategoryProducts = ({ allCategoryProducts }) => {
    const dispatch = useDispatch()
    const navigation = useNavigation(); // Use the hook to get navigation



    const renderProductItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={{}} // Add styles if needed
                onPress={() =>
                    navigation.navigate('Details', { product: item })
                }
            >
                <ProductCard item={item} />
            </TouchableOpacity>
        );
    };

    const renderCategorySection = ({ item }) => {
        const { categoryId, categoryName, products } = item;

        // If products are empty, don't render this category
        if (products.length === 0) {
            return null;
        }

        const handleCategoryNavigate = async () => {
            await dispatch(resetProductsByCategory());
            navigation.navigate('CategoryProducts', {
                categoryId,
                categoryTitle: categoryName,
            })
        }

        return (
            <View key={categoryId}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 18, fontWeight: '700', marginVertical: 5, color: "#000000" }}>{categoryName}</Text>
                    <TouchableOpacity
                        onPress={handleCategoryNavigate}
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                        <Text style={{ color: '#000066', marginRight: 5, fontSize: 15, fontWeight: '600' }}>View all</Text>
                        <Icon.AntDesign name="right" color="#1e90ff" size={13} />
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={products.slice(0, 4)}  // Limit to 4 products
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderProductItem}
                    numColumns={2}
                    columnWrapperStyle={{
                        justifyContent: 'space-between',
                        marginBottom: 5,
                    }}
                    contentContainerStyle={{ padding: 15 }}
                />
            </View>
        );
    };

    // Filter out categories with empty products
    const filteredCategories = allCategoryProducts.filter(category => category.products.length > 0);

    return (
        <View>
            <FlatList
                data={filteredCategories}
                keyExtractor={(item) => item.categoryId.toString()}
                renderItem={renderCategorySection}
                contentContainerStyle={{ paddingBottom: 20 }}  // Adjust for any additional padding needed
            />
        </View>
    );
};

export default AllCategoryProducts;
