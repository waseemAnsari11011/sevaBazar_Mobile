import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseURL } from '../../utils/api';
import Icon from '../../components/Icons/Icon';

const SupportTicketScreen = ({ navigation }) => {
    const { data } = useSelector(state => state.local);
    const [loading, setLoading] = useState(false);
    const [ticketSuccess, setTicketSuccess] = useState(false);
    const [isCooldown, setIsCooldown] = useState(false);
    
    // 5 minutes in milliseconds
    const COOLDOWN_DURATION = 5 * 60 * 1000;

    useEffect(() => {
        checkCooldown();
    }, []);

    const checkCooldown = async () => {
        try {
            const lastTime = await AsyncStorage.getItem('last_ticket_time');
            if (lastTime) {
                const now = Date.now();
                const diff = now - parseInt(lastTime, 10);
                if (diff < COOLDOWN_DURATION) {
                    const remainingTime = COOLDOWN_DURATION - diff;
                    startCooldown(remainingTime);
                }
            }
        } catch (error) {
            console.error("Error reading cooldown:", error);
        }
    };

    const startCooldown = (duration) => {
        setIsCooldown(true);
        setTicketSuccess(true);
        
        setTimeout(() => {
            setIsCooldown(false);
            setTicketSuccess(false);
        }, duration);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setTicketSuccess(false); 
        try {
            const response = await fetch(`${baseURL}tickets/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerId: data.user._id,
                    reason: "One Tap Support Request" // Default reason
                }),
            });
            const result = await response.json();
            if (result.success) {
                // Save current time
                await AsyncStorage.setItem('last_ticket_time', Date.now().toString());
                
                // Start cooldown
                startCooldown(COOLDOWN_DURATION);
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
                <View style={styles.infoContainer}>
                    <Icon.AntDesign name="customerservice" size={60} color="#000066" />
                    <Text style={styles.infoTitle}>Need Help?</Text>
                    <Text style={styles.infoText}>
                        Tap the button below to generate a support ticket. Our team will contact you shortly. Please wait 5 minutes for a call, then you can generate a ticket again.
                    </Text>
                </View>

                <TouchableOpacity 
                    style={[styles.submitButton, isCooldown && styles.disabledButton]} 
                    onPress={handleSubmit}
                    disabled={loading || isCooldown}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.submitButtonText}>
                            {isCooldown ? "Please Wait..." : "Generate Ticket"}
                        </Text>
                    )}
                </TouchableOpacity>

                {ticketSuccess && (
                    <View style={styles.successContainer}>
                         <Text style={styles.successText}>
                            Ticket generated successfully. Please wait 5 minutes for a call.
                        </Text>
                         <Text style={styles.subText}>
                            Our team will call you back shortly.
                        </Text>
                    </View>
                )}
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
        paddingTop: 10, // Handle notch
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
    infoContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    infoTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000066',
        marginTop: 15,
        marginBottom: 10,
    },
    infoText: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 20,
    },
    successContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#e8f5e9',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#c8e6c9',
        alignItems: 'center',
    },
    successText: {
        color: '#2e7d32',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    subText: {
        color: '#2e7d32',
        fontSize: 12,
        marginTop: 4,
        textAlign: 'center',
    },
    disabledButton: {
        backgroundColor: '#999', // Greyed out color
    },
});

export default SupportTicketScreen;
