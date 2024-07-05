import React, { useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import OrderItem from './OrderItem';
import { getChatOrdersByCustomer } from '../../../config/redux/actions/chatOrderActions';
import ChatOrderItem from './ChatOrderItem';

const ChatOrderScreen = () => {
  const { data } = useSelector(state => state.local);

  const dispatch = useDispatch();
  const { loading, orders, error } = useSelector(state => state.chatOrder);
  const customerId = data.user._id; // Replace with actual customer ID or pass as a prop

  useEffect(() => {
    console.log("api is called!")
    dispatch(getChatOrdersByCustomer(customerId));
  }, [dispatch, customerId]);



  
//   console.log("orders-->", orders)

  if (loading) {
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

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={order => order._id}
        renderItem={({ item }) => <ChatOrderItem order={item} />}
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});
