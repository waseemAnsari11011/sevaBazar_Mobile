import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import AuthNavigator from './AuthNavigator';
import StackNavigator from './StackNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {loadData} from '../config/redux/actions/storageActions';
import SplashScreen from '../components/SplashScreen';
import {fetchUserLocation} from '../config/redux/actions/locationActions'; // 👈 Import action

const RootNavigator = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const dispatch = useDispatch();
  const {data} = useSelector(state => state?.local);
  const isAuthenticated = !!data?.user; // 👈 Check if user is authenticated
  // 👇 This new useEffect will run when the user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserLocation());
    }
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    const loadLocalData = async () => {
      await dispatch(loadData('user'));
    };
    loadLocalData();
  }, []);

  return (
    <NavigationContainer>
      {isLoading ? (
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
