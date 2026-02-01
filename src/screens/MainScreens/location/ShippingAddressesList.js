import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Button, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../../utils/api';
import { loadData, saveData } from '../../../config/redux/actions/storageActions';

const ShippingAddressesList = ({ navigation }) => {
  const dispatch = useDispatch();
  const { data } = useSelector(state => state.local);
  const [shippingAddresses, setShippingAddresses] = useState([]);

  useEffect(() => {
    const fetchShippingAddresses = async () => {
      try {
        const userId = data?.user?._id;
        const response = await api.get(`/address/${userId}/`);
        if (response.status === 200) {
          setShippingAddresses(response.data.shippingAddresses);
        }
      } catch (error) {
        console.error('Error fetching shipping addresses:', error);
      }
    };
    fetchShippingAddresses();
  }, [data]);

  const handleDelete = async (addressId) => {
    try {
      const userId = data?.user?._id;
      const response = await api.delete(`/address/${userId}/${addressId}`);
      if (response.status === 200) {
        setShippingAddresses(prevAddresses => prevAddresses.filter(address => address._id !== addressId));
      }
    } catch (error) {
      console.error('Error deleting shipping address:', error);
      Alert.alert('Error', 'Unable to delete the address');
    }
  };

  const handleEdit = (address) => {
    navigation.navigate('Add Location', { address, isEdit: true, isSignin: false });
  };

  const handleAddNew = () => {
    navigation.navigate('Add Location', { isSignin: false });
  };

  const handleSetActive = async (addressId) => {
    try {
      const userId = data?.user?._id;
      const response = await api.put(`/customer/${userId}/address/${addressId}/activate`);
      if (response.status === 200) {
        dispatch(saveData('user', response.data.user));

        setShippingAddresses(response.data.user.shippingAddresses);

        // Check for vendors at the new location
        try {
          const vendorResponse = await api.get('/vendors/customer');
          if (vendorResponse.status === 200 && vendorResponse.data.vendors && vendorResponse.data.vendors.length === 0) {
            Alert.alert(
              'No Service Available',
              'Sorry, we do not have any vendors serving this location yet.',
              [{ text: 'OK' }]
            );
          }
        } catch (vendorError) {
          console.error('Error checking vendors:', vendorError);
        }
      }
    } catch (error) {
      console.error('Error setting address as active:', error);
      Alert.alert('Error', 'Unable to set the address as active');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Shipping Addresses</Text>
      <Button title="Add New Address" onPress={handleAddNew} />
      <ScrollView style={{ marginTop: 10 }}>
        {shippingAddresses.map((address) => (
          <TouchableOpacity
            key={address._id}
            onPress={() => handleSetActive(address._id)}
            style={[
              styles.card,
              address.isActive && styles.activeCard
            ]}
          >
            <View style={styles.cardContent}>
              <Text style={[styles.cardText, { fontWeight: 'bold' }]}>{address.name}</Text>
              <Text style={[styles.cardText, { marginBottom: 5 }]}>{address.phone}</Text>
              <Text style={styles.cardText}>{address.addressLine2 || address.address}</Text>

              {address.isActive && <Text style={styles.activeLabel}>Active</Text>}
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity onPress={() => handleEdit(address)}>
                <Icon name="pencil" size={20} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(address._id)}>
                <Icon name="trash" size={20} color="red" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    padding: 8, // Reduced padding
    borderRadius: 5,
    backgroundColor: '#f8f8f8',
    marginBottom: 8, // Reduced margin
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Align items to top
  },
  cardContent: {
    flex: 1,
    paddingRight: 5, // Add some space between text and actions
  },
  cardText: {
    fontSize: 14, // Standardized font size
    marginBottom: 1, // Tighter line spacing
    color: '#333',
  },
  cardActions: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start', // Align actions to top
  },
  activeLabel: {
    fontSize: 14,
    color: '#ff6600',
    fontWeight: 'bold',
  },
  activeCard: {
    borderColor: '#ff6600',
    borderWidth: 2
  },
});

export default ShippingAddressesList;
