import React, { useState, useEffect } from 'react';
import { Button, TextInput, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import OtpInputScreen from '../components/OtpInputScreen';
import { saveData } from '../config/redux/actions/storageActions';
import { PhoneLogin } from '../config/redux/actions/authActions';
import Loading from '../components/Loading';
import api from '../utils/api';
import axios from 'axios';

function PhoneSignIn({ navigation }) {
  const dispatch = useDispatch();
  const [confirm, setConfirm] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isNextButtonEnabled, setIsNextButtonEnabled] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [isResendButtonDisabled, setIsResendButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState(null); // Store the generated OTP

  const handlePhoneNumberChange = (text) => {
    setPhoneNumber(text);
    setIsNextButtonEnabled(text.length === 10);
  };

  const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000).toString(); // Generate a 4-digit OTP
};


  const checkUserRestriction = async () => {
    console.log("checkUserRestriction")
    try {
      const response = await api.post('/check-restricted', {
        contactNumber: `+91${phoneNumber}` || undefined // Send contactNumber only if it's provided
      });

      if (response.status === 200) {
        console.log("sendOtp")
        // User is not restricted, proceed further
        sendOtp(); // Replace 'NextScreen' with your next screen
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 200 range
        if (error.response.status === 403) {
          Alert.alert('Access Denied', 'User is restricted');
        } else {
          Alert.alert('Error', 'Something went wrong. Please try again.');
        }
      } else {
        // Other errors
        Alert.alert('Error', 'Network error. Please check your internet connection.');
      }
    }
  };

  const sendOtp = async () => {
    setLoading(true);
    const otp = generateOtp();
    setGeneratedOtp(otp);
    const API = '253f7b5d921338af34da817c00f42753'; // Replace with your actual API key

    try {
      const url = `https://sms.renflair.in/V1.php?API=${API}&PHONE=${phoneNumber}&OTP=${otp}`;
      const response = await axios.get(url);

      console.log("response.data-->>", response.data)

      if (response.data.status === 'SUCCESS') {
        setConfirm(true);
        setFeedbackMessage('OTP sent successfully!');
        alert('OTP sent successfully!');
        setCountdown(60);
        setIsResendButtonDisabled(true);
      } else {
        throw new Error('Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setFeedbackMessage('Error sending OTP. Please try again.');
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  const confirmCode = async (code) => {
    console.log("code === generatedOtp-->>>", code ,generatedOtp)
    setLoading(true);
    try {
      if (code.toString() === generatedOtp.toString()) {
        setFeedbackMessage('OTP confirmed successfully!');
        alert('OTP confirmed successfully!');
        // You can proceed with further actions here
        const body = {
          phoneNumber: phoneNumber,
          uid: code,
        };
        const result = await dispatch(PhoneLogin(body));
        if (result.success && result.user && !result.user.isRestricted) {
          
          dispatch(saveData('token', result.token));
          dispatch(saveData('user', result.user));
         
  
        }
      } else {
        throw new Error('Invalid OTP');
      }
    } catch (error) {
      console.error('Invalid code:', error);
      setFeedbackMessage('Invalid OTP. Please try again.');
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loading />}
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.Uppercontainer}>
          <Text style={styles.headerText}>Let's start with your mobile number</Text>
          <Text style={styles.subText}>We will send a text with a verification code.</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.countryCode}>+91</Text>
            <TextInput
              style={styles.phoneNumberInput}
              value={phoneNumber}
              onChangeText={handlePhoneNumberChange}
              placeholder="Mobile Number"
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>
          <TouchableOpacity
            style={[styles.nextButton, { backgroundColor: isNextButtonEnabled ? '#ff6600' : '#ccc' }]}
            onPress={checkUserRestriction}
            disabled={!isNextButtonEnabled || loading}
          >
            <Text style={[styles.nextButtonText, { color: isNextButtonEnabled ? 'white' : 'black' }]}>Next</Text>
          </TouchableOpacity>
        </View>
        {confirm && (
          <OtpInputScreen
            onConfirm={confirmCode}
            resendOtp={sendOtp}
            countdown={countdown}
            setCountdown={setCountdown}
            isResendButtonDisabled={isResendButtonDisabled}
            setIsResendButtonDisabled={setIsResendButtonDisabled}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  Uppercontainer: {
    paddingHorizontal: 20,
    marginTop: 50,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: "#ff6600",
  },
  subText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
  },
  countryCode: {
    fontSize: 18,
    marginRight: 10,
  },
  phoneNumberInput: {
    flex: 1,
    fontSize: 18,
    paddingVertical: 10,
  },
  nextButton: {
    backgroundColor: '#ccc',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  nextButtonText: {
    fontSize: 18,
    color: '#000',
  },
  skipButton: {
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    color: '#007bff',
  },
});

export default PhoneSignIn;
