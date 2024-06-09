import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import { clearCart } from '../config/redux/actions/cartActions';
import { clearAllData } from '../config/redux/actions/storageActions';
import { Alert } from 'react-native';
import { logout } from '../config/redux/actions/authActions';
import Icon from '../components/Icons/Icon';
import auth from '@react-native-firebase/auth';
const LogoutButton = ({ isVisible }) => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    dispatch(clearCart());
    dispatch(clearAllData());
    await auth().signOut();
  };

  const showAlert = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          // onPress: handleCancelButtonPress,
          style: 'cancel',
        },
        { text: 'OK', onPress: handleLogout },
      ],
      { cancelable: false },
    );
  };

  return (
    <TouchableOpacity onPress={showAlert}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon.Ionicons name="log-out-outline" size={24} color="red" />
        {isVisible && (
          <Text style={{ marginLeft: 16, fontSize: 16, color: '#DB4437' }}>
            Logout
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default LogoutButton;
