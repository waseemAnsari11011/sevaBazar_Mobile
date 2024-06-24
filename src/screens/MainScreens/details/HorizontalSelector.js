import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { baseURL } from '../../../utils/api';

const HorizontalSelector = ({ items, selectedValue, onValueChange }) => {
    // console.log("items HorizontalSelectors-->>", items)
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
            {items.map(item => (
                <View key={item.value} style={{alignItems:"center"}}>
                    <TouchableOpacity
                        key={item.value}
                        style={[
                            styles.itemContainer,
                            item.value === selectedValue && styles.selectedItemContainer,
                        ]}
                        onPress={() => onValueChange(item.value)}
                    >
                        <Image source={{ uri: `${baseURL}${item.icon.uri}` }} style={styles.itemImage} />
                    </TouchableOpacity>
                    <Text style={{fontWeight:"600"}}>{item.value}</Text>
                </View>


            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        marginVertical: 10,
    },
    itemContainer: {
        padding: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginHorizontal: 5,
        marginBottom:5
    },
    selectedItemContainer: {
        borderColor: 'blue',
    },
    itemImage: {
        width: 60,
        height: 60,
    },
});

export default HorizontalSelector;
