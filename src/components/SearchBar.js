// SearchBar.js
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from './Icons/Icon';

const SearchBar = ({ isInput = false, onChangeText, onSubmitEditing,onscrolllist }) => {
    const navigation = useNavigation();

    const handlePress = () => {
        if (!isInput) {
            navigation.navigate('Search Your Products'); // Replace with your screen name
        }
    };
   

    return (
        <View style={styles.stickyContainer}>
            <View style={styles.rowContainer}>
                <TouchableOpacity onPress={onscrolllist}>
                <Image source={require('../assets/images/brandMain.png')} style={styles.brandImage} />
                </TouchableOpacity>
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
        </View>
    );
};

const styles = StyleSheet.create({
    stickyContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: '#f0f0f0',
        padding: 10,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    brandImage: {
        width: 68,
        height: 68,
        resizeMode: 'contain',
        borderRadius: 10,
        marginRight: 10,
    },
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    input: {
        flex: 1,
        color: '#333',
        fontSize: 16,
        paddingVertical: 12, // Adjust as needed for vertical alignment
    },
    placeholderText: {
        flex: 1,
        color: '#333',
        fontSize: 16,
        paddingVertical: 12, // Adjust as needed for vertical alignment
    },
    iconContainer: {
        backgroundColor: '#ff6600',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
        marginLeft: 10,
    },
    
});

export default SearchBar;
