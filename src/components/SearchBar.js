// SearchBar.js
import React from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from './Icons/Icon';

const SearchBar = ({ isInput = false, onChangeText, onSubmitEditing }) => {
    const navigation = useNavigation();

    const handlePress = () => {
        if (!isInput) {
            navigation.navigate('Search Your Products'); // Replace 'SearchScreen' with the actual screen name you want to navigate to
        }
    };

    return (
        <View style={styles.stickyContainer}>
            <TouchableOpacity style={styles.container} onPress={handlePress} disabled={isInput}>
                <View style={styles.inputContainer}>
                    {isInput ? (
                        <TextInput
                            style={styles.input}
                            placeholder="Search Product..."
                            placeholderTextColor="#333"
                            onChangeText={onChangeText}
                            onSubmitEditing={onSubmitEditing}
                        />
                    ) : (
                        <Text style={styles.placeholderText}>Search Product...</Text>
                    )}
                    <View style={styles.iconContainer}>
                        <Icon.Ionicons name="search" size={20} color="#fff" />
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    stickyContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10, // Ensure it stays on top of other elements
        backgroundColor: '#f0f0f0',
        padding: 10,
    },
    container: {
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    input: {
        flex: 1,
        color: '#333',
        fontSize: 16,
    },
    placeholderText: {
        flex: 1,
        color: '#333',
        fontSize: 16,
    },
    iconContainer: {
        backgroundColor: '#ff6600',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
    },
});

export default SearchBar;
