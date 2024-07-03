import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const OtpInputScreen = ({onConfirm, resendOtp, countdown, setCountdown, isResendButtonDisabled, setIsResendButtonDisabled}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const [isConfirmButtonEnabled, setIsConfirmButtonEnabled] = useState(false);


  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendButtonDisabled(false);
    }
  }, [countdown]);

  const handleChangeText = (text, index) => {
    if (/^[0-9]$/.test(text)) {
      let newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      if (index < 5) {
        inputRefs.current[index + 1].focus();
      }
      setIsConfirmButtonEnabled(newOtp.every(digit => digit !== ''));
    } else if (text === '') {
      let newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      setIsConfirmButtonEnabled(newOtp.every(digit => digit !== ''));
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs.current[index - 1].focus();
    }
  };

  

  const confirmCode = () => {
    onConfirm(otp.join(''));
  };


  return (
    <View style={otpstyles.container}>
      <Text style={otpstyles.title}>Enter OTP</Text>
      <View style={otpstyles.otpContainer}>
        {otp.map((_, index) => (
          <TextInput
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            style={otpstyles.otpInput}
            keyboardType="numeric"
            maxLength={1}
            value={otp[index]}
            onChangeText={(text) => handleChangeText(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
          />
        ))}
      </View>
      <Text style={otpstyles.infoText}>An OTP was sent to your phone</Text>
      <TouchableOpacity
        style={otpstyles.resendButton}
        onPress={resendOtp}
        disabled={isResendButtonDisabled}
      >
        <Text style={[otpstyles.resendText, , { color: isResendButtonDisabled ? '#ccc' : '#ff6600' }]}>Resend Now</Text>
        <Text style={otpstyles.timer}>{countdown}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[otpstyles.confirmButton, { backgroundColor: isConfirmButtonEnabled ? '#ff6600' : '#ccc' }]}
        onPress={confirmCode}
        disabled={!isConfirmButtonEnabled}
      >
        <Text style={otpstyles.confirmButtonText}>Confirm OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

const otpstyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  otpInput: {
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
    textAlign: 'center',
    fontSize: 18,
    width: 40,
    marginHorizontal: 5,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 20,
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  resendText: {
    color: '#fff',
    fontSize: 16,
    marginRight: 5,
  },
  timer: {
    fontSize: 16,
    color: 'black',
  },
  confirmButton: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 5,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default OtpInputScreen;
