import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import CustomHeader from '../../../components/CustomHeader';
import ButtonComponent from '../../../components/Button';
import {verifyOtp} from '../../../config/redux/actions/passwordAction';
import Loading from '../../../components/Loading';

const EnterOTPScreen = ({navigation, route}) => {
  const email = route.params.email;
  const [otp, setOTP] = useState('');
  const [loading, setloading] = useState(false);

  const handleOTPChange = (value, index) => {
    const newOTP = otp.split('');
    newOTP[index] = value;
    setOTP(newOTP.join(''));
    if (value && index < 3) {
      this[`textInput${index + 1}`].focus();
    }
  };

  const handleOTPKeyPress = (event, index) => {
    if (event.nativeEvent.key === 'Backspace' && index > 0) {
      this[`textInput${index - 1}`].focus();
    }
  };

  const handleSubmit = () => {
    setloading(true);
    // verifyOtp({
    //   email: email,
    //   otp: otp,
    // })
    //   .then(res => {
    //     setloading(false);
    //     if (res.success) {
    //       alert(res.message);
    //       navigation.navigate('Reset Password', {email, otp});
    //     }
    //   })
    //   .catch(err => {
    //     alert(err.message);
    //   });

    navigation.navigate('Reset Password', {email:"abc@gmail.com", otp:1234});
  };

  return (
    <KeyboardAvoidingView style={{flex: 1}}>
      <ScrollView keyboardShouldPersistTaps="handled">
        {loading && <Loading />}
        <CustomHeader title={'Verification'} navigation={navigation} />
        <View style={styles.container}>
          <Image
            source={require('../../../assets/images/otp.png')}
            style={styles.image}
          />
          <Text style={styles.title}>OTP Verification</Text>
          <Text style={styles.subTitle}>
            Enter the otp sent to <Text style={{color: 'black'}}>{email}</Text>
          </Text>
          <View style={styles.otpContainer}>
            {[0, 1, 2, 3].map(i => (
              <TextInput
                key={i}
                ref={ref => {
                  this[`textInput${i}`] = ref;
                }}
                style={styles.otpBox}
                maxLength={1}
                keyboardType="numeric"
                onChangeText={value => handleOTPChange(value, i)}
                onKeyPress={event => handleOTPKeyPress(event, i)}
                value={otp[i]}
              />
            ))}
          </View>
          <Text style={{marginBottom: 30}}>
            Didn't receive the OTP?{' '}
            <Text style={{color: 'black', textDecorationLine: 'underline'}}>
              resend otp
            </Text>
          </Text>
          <View style={{width: '100%'}}>
            <ButtonComponent title={'Verify'} onPress={handleSubmit} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    marginTop: 30,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
  },
  otpBox: {
    width: 30,
    height: 50,
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    textAlign: 'center',
    width: '20%',
  },
  submitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    paddingVertical: 15,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    marginRight: 10,
  },
  subTitle: {
    width: '100%',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 30,
    color: 'grey',
  },
});

export default EnterOTPScreen;
