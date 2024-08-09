import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Button } from 'react-native';
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
    navigation.navigate('Add Location', { address, isEdit: true, isSignin:false });
  };

  const handleAddNew = () => {
    navigation.navigate('Add Location',{isSignin:false});
  };

  const handleSetActive = async (addressId) => {
    try {
      const userId = data?.user?._id;
      const response = await api.put(`/customer/${userId}/address/${addressId}/activate`);
      if (response.status === 200) {
        dispatch(saveData('user', response.data.user));

        setShippingAddresses(response.data.user.shippingAddresses);

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
          <View
            key={address._id}
            style={[
              styles.card,
              address.isActive && styles.activeCard
            ]}
            onTouchStart={() => handleSetActive(address._id)}
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardText}>Name: {address.name}</Text>
              <Text style={styles.cardText}>Phone: {address.phone}</Text>
              <Text style={styles.cardText}>Address: {address.address}</Text>
              <Text style={styles.cardText}>City: {address.city}</Text>
              <Text style={styles.cardText}>State: {address.state}</Text>
              <Text style={styles.cardText}>Country: {address.country}</Text>
              <Text style={styles.cardText}>Postal Code: {address.postalCode}</Text>
              {address.isActive && <Text style={styles.activeLabel}>Active</Text>}
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity onPress={() => handleEdit(address)}>
                <Icon name="pencil" size={20} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(address._id)}>
                <Icon name="trash" size={20} color="red" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSetActive(address._id)}>
                <Icon name="star" size={20} color={address.isActive ? '#ff6600' : '#ccc'} />
              </TouchableOpacity>
            </View>
          </View>
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
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f8f8f8',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardContent: {
    flex: 1,
  },
  cardText: {
    fontSize: 14,
    marginBottom: 2,
  },
  cardActions: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
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
