import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { baseURL } from '../../utils/api';
import Icon from '../../components/Icons/Icon';

const SupportTicketScreen = ({ navigation }) => {
    const { data } = useSelector(state => state.local);
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!reason.trim()) {
            Alert.alert("Required", "Please describe your issue.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${baseURL}tickets/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerId: data.user._id,
                    reason: reason
                }),
            });
            const result = await response.json();
            if (result.success) {
                Alert.alert("Success", "Ticket generated successfully. We will contact you shortly.", [
                    { text: "OK", onPress: () => navigation.goBack() }
                ]);
            } else {
                Alert.alert("Error", "Failed to generate ticket. Please try again.");
            }
        } catch (error) {
            console.error("Ticket generation error:", error);
            Alert.alert("Error", "Something went wrong. Please check your internet connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon.AntDesign name="arrowleft" size={24} color="#000066" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Support Ticket</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                <Text style={styles.label}>How can we help you?</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Describe your issue here..."
                    value={reason}
                    onChangeText={setReason}
                    multiline
                    textAlignVertical="top"
                />

                <TouchableOpacity 
                    style={styles.submitButton} 
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.submitButtonText}>Submit Ticket</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingTop: 50, // Handle notch
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000066',
    },
    content: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 15,
        height: 150,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#f9f9f9',
    },
    submitButton: {
        backgroundColor: '#000066',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default SupportTicketScreen;
