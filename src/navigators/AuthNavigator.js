import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from '../screens/AuthScreens/LoginScreen';
import SignupScreen from '../screens/AuthScreens/SignupScreen';
import EnterEmailOrPhoneScreen from '../screens/AuthScreens/forgotPassword/EnterEmailScreen';
import ResetPasswordScreen from '../screens/AuthScreens/forgotPassword/ResetPasswordScreen';
import EnterOTPScreen from '../screens/AuthScreens/forgotPassword/EnterOTPScreen';
import PhoneSignIn from '../screens/PhoneSignIn';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="Login"
        component={PhoneSignIn}
        options={{
          title: 'Login',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{
          title: 'Signup',
          headerShown: false,
        }}
      />
      <Stack.Screen name="Enter Otp" component={EnterOTPScreen} />
      <Stack.Screen name="Enter Email" component={EnterEmailOrPhoneScreen} />
      <Stack.Screen name="Reset Password" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
