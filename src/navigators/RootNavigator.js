import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import AuthNavigator from './AuthNavigator';
import StackNavigator from './StackNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadData } from '../config/redux/actions/storageActions';
import { loadCart } from '../config/redux/actions/cartActions';
import SplashScreen from '../components/SplashScreen';
import { fetchUserLocation } from '../config/redux/actions/locationActions'; // 👈 Import action

import { navigationRef } from '../utils/navigationRef';

const RootNavigator = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const dispatch = useDispatch();
  const { user: authUser } = useSelector(state => state?.auth); // 👈 Use auth user for immediate updates
  const { data } = useSelector(state => state?.local);
  const location = useSelector(state => state?.location);

  const user = authUser || data?.user;
  const isAuthenticated = !!user;
  const hasNoAddress = user?.shippingAddresses?.length === 0;

  // 👇 This new useEffect will run when the user is authenticated
  useEffect(() => {
    if (isAuthenticated && hasNoAddress) {
      dispatch(fetchUserLocation());
    }
  }, [isAuthenticated, hasNoAddress, dispatch]);

  useEffect(() => {
    const loadLocalData = async () => {
      await dispatch(loadData('user'));
      await dispatch(loadCart());
    };
    loadLocalData();
  }, []);

  // Proactively stay on splash if user just authenticated but lacks an address,
  // until we at least start/finish the fetch attempt.
  const isWaitingForLocation =
    isAuthenticated &&
    hasNoAddress &&
    !location.location &&
    !location.error &&
    !location.permissionDenied;

  return (
    <NavigationContainer ref={navigationRef}>
      {isLoading || isWaitingForLocation ? (
        <SplashScreen />
      ) : data?.user ? (
        <StackNavigator />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;
