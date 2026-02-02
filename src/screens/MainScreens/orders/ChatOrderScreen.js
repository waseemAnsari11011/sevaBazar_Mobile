import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getChatOrdersByCustomer } from '../../../config/redux/actions/chatOrderActions';
import ChatOrderItem from './ChatOrderItem';
import { fetchContact } from '../../../config/redux/actions/contactActions';

const ChatOrderScreen = () => {
  const { data } = useSelector(state => state.local);
  const { contact } = useSelector(state => state.contact);

  const dispatch = useDispatch();
  const { loading, orders, error } = useSelector(state => state.chatOrder);
  const customerId = data.user._id; // Replace with actual customer ID or pass as a prop

  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = () => {
    dispatch(getChatOrdersByCustomer(customerId));
  };

  useEffect(() => {
    console.log("chat api is called!");
    fetchOrders();
  }, [dispatch, customerId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
    setRefreshing(false);
  };

  if (loading && !refreshing && orders.length === 0) {
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

  if (orders.length === 0) {
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
        renderItem={({ item }) => <ChatOrderItem order={item} contact={contact} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

export default ChatOrderScreen;

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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  emptyText: {
    color: 'black',
    fontSize: 16,
  },
});
