import React, { useState, useEffect } from 'react';
import { Button, TextInput, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import OtpInputScreen from '../components/OtpInputScreen';
import { saveData } from '../config/redux/actions/storageActions';
import { useDispatch } from 'react-redux';
import { PhoneLogin } from '../config/redux/actions/authActions';
import Loading from '../components/Loading';
import api from '../utils/api';

function PhoneSignIn({ navigation }) {

  const dispatch = useDispatch();
  const [confirm, setConfirm] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isNextButtonEnabled, setIsNextButtonEnabled] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [isResendButtonDisabled, setIsResendButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handlePhoneNumberChange = (text) => {
    setPhoneNumber(text);
    setIsNextButtonEnabled(text.length === 10);
  };

  const checkUserRestriction = async () => {
    try {
      const response = await api.post('/check-restricted', {
        // email: email || undefined, // Send email only if it's provided
        contactNumber: phoneNumber || undefined // Send contactNumber only if it's provided
      });

      if (response.status === 200 ) {
        console.log("signInWithPhoneNumber")
        // User is not restricted, proceed further
        signInWithPhoneNumber(); // Replace 'NextScreen' with your next screen
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

  async function onAuthStateChanged(user) {
    if (user) {
      setFeedbackMessage('Logged in successfully!');
      alert('Logged in successfully!');
      const body = {
        phoneNumber: user.phoneNumber,
        uid: user.uid,
      };
      const result = await dispatch(PhoneLogin(body));
      if (result.success && result.user && !result.user.isRestricted) {
        dispatch(saveData('token', result.token));
        dispatch(saveData('user', result.user));
      }

      if (result.success && result.user && result.user.isRestricted) {
        await auth().signOut();
        alert('Your account is blocked');
      }
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  async function signInWithPhoneNumber() {
    setLoading(true);
    try {
      const confirmation = await auth().signInWithPhoneNumber(`+91 ${phoneNumber}`);
      setConfirm(confirmation);
      setFeedbackMessage('OTP sent successfully!');
      alert('OTP sent successfully!');
      setCountdown(60);
      setIsResendButtonDisabled(true);
    } catch (error) {
      console.error('Error sending OTP:', error);
      setFeedbackMessage('Error sending OTP. Please try again.');
      alert(error);
    } finally {
      setLoading(false);
    }
  }

  async function confirmCode(code) {
    setLoading(true);
    try {
      await confirm.confirm(code);
      setFeedbackMessage('OTP confirmed successfully!');
      alert('OTP confirmed successfully!');
    } catch (error) {
      console.error('Invalid code:', error);
      setFeedbackMessage('Invalid OTP. Please try again.');
      alert(error);
    } finally {
      setLoading(false);
    }
  }

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
            style={[styles.nextButton, { backgroundColor: isNextButtonEnabled ? 'green' : '#ccc' }]}
            onPress={checkUserRestriction}
            disabled={!isNextButtonEnabled || loading}
          >

              <Text style={[styles.nextButtonText, { color: isNextButtonEnabled ? 'white' : 'black' }]}>Next</Text>

          </TouchableOpacity>
        </View>
        {confirm && (
          <OtpInputScreen
            onConfirm={confirmCode}
            resendOtp={signInWithPhoneNumber}
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
    color: "green",
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
