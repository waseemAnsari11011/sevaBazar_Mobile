import { StyleSheet, Text, View, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrdersByCustomerId } from '../../../config/redux/actions/orderActions';
import OrderItem from './OrderItem';

const MyOrder = ({navigation}) => {
  const { data } = useSelector(state => state.local);

  const dispatch = useDispatch();
  const { loading, orders, error } = useSelector(state => state.orders);
  const customerId = data.user._id; // Replace with actual customer ID or pass as a prop
  const { contact } = useSelector(state => state.contact);

  const [refreshing, setRefreshing] = useState(false);



  useEffect(() => {
    dispatch(fetchOrdersByCustomerId(customerId));
  }, [dispatch, customerId]);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(fetchOrdersByCustomerId(customerId)).finally(() => setRefreshing(false));
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (orders.length ===0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Place Order to see here</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={order => order._id}
        renderItem={({ item }) => <OrderItem order={item} navigation={navigation} contact={contact} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

export default MyOrder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  orderContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: 'black',
    fontSize: 16,
  },
});
