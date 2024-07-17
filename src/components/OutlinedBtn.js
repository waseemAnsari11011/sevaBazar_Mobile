import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const OutlinedBtn = ({ onPress, buttonWidth, textColor, borderColor }) => {
    return (
        <TouchableOpacity 
            style={[styles.button, { borderColor, width: buttonWidth }]} 
            onPress={onPress}
        >
            <Text style={[styles.buttonText, { color: textColor }]}>
                Cancel Order
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderWidth: 1,
        borderRadius: 4,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
    },
});

export default OutlinedBtn;
