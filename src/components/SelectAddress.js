import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, Card, Title, Paragraph, TextInput, Modal, Portal, Provider, RadioButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { loadData } from '../config/redux/actions/storageActions';

const AddressManager = ({ navigation }) => {
    const dispatch = useDispatch()
    useEffect(() => {
        console.log("useEffect Called")
        const loadLocalData = async () => {
            dispatch(loadData('user'));
        };
        loadLocalData();
    }, []);
    const { data } = useSelector(state => state?.local);

    const [addresses, setAddresses] = useState(data?.user?.shippingAddresses);
    const [newAddress, setNewAddress] = useState('');
    const [visible, setVisible] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(addresses[0]);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const addNewAddress = () => {
        if (newAddress.trim()) {
            const newAddressObj = { id: addresses.length + 1, address: newAddress, selected: false };
            setAddresses([...addresses, newAddressObj]);
            setNewAddress('');
            hideModal();
        }
    };

    const selectAddress = (address) => {
        setAddresses(addresses.map(addr => ({ ...addr, selected: addr.id === address.id })));
        setSelectedAddress(address);
    };

    return (
        <Provider>
            <ScrollView style={styles.container}>
                <Card style={styles.card}>
                    <Card.Content>
                        <Title>Selected Address</Title>
                        <Paragraph>{selectedAddress.addressLine2 || selectedAddress.address}</Paragraph>
                    </Card.Content>
                </Card>
                <Button mode="contained" onPress={() => navigation.navigate("Location List", { isCheckOut: true })} style={styles.button}>
                    Add New Address
                </Button>
                <Title>Select Address</Title>
                <RadioButton.Group onValueChange={value => selectAddress(addresses.find(addr => addr._id === value))} value={selectedAddress._id}>
                    {addresses.map(address => (
                        <RadioButton.Item key={address._id} label={address.addressLine2 || address.address} value={address._id} />
                    ))}
                </RadioButton.Group>
                <Portal>
                    <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modal}>
                        <TextInput
                            label="New Address"
                            value={newAddress}
                            onChangeText={text => setNewAddress(text)}
                            style={styles.input}
                        />
                        <Button mode="contained" onPress={addNewAddress} style={styles.button}>
                            Save Address
                        </Button>
                    </Modal>
                </Portal>
            </ScrollView>
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    card: {
        marginBottom: 16,
    },
    button: {
        marginTop: 16,
    },
    modal: {
        padding: 20,
        backgroundColor: 'white',
        margin: 20,
    },
    input: {
        marginBottom: 16,
    },
});

export default AddressManager;
