import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import CustomHeader from '../../../components/CustomHeader';
import ButtonComponent from '../../../components/Button';
import {sendOtp} from '../../../config/redux/actions/passwordAction';
import Loading from '../../../components/Loading';

const EnterEmailOrPhoneScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const isEmailValid = () => {
    // Regular expression to validate email address format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = () => {
    setLoading(true);
    if (isEmailValid()) {
      // sendOtp({
      //   email: email,
      // })
      //   .then(res => {
      //     setLoading(false);
      //     if (res.success) {
      //       alert(res.message);
      //       navigation.navigate('Enter Otp', {email});
      //     }
      //   })
      //   .catch(err => {
      //     setLoading(false);
      //     alert(err.message);
      //   });

      navigation.navigate('Enter Otp', {email:"abc@gmail.com"});
    } else {
      setLoading(false);
      alert('Please enter a valid email address');
    }
  };

  return (
    <KeyboardAvoidingView style={{flex: 1}}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
        {loading && <Loading />}
        <CustomHeader title={'Forgot Password'} navigation={navigation} />
        <View style={{alignItems: 'center'}}>
          <Image
            source={require('../../../assets/images/forgot_password.png')}
            style={{
              width: 250,
              height: 250,
              resizeMode: 'contain',
              marginBottom: 10,
            }}
          />
        </View>

        <Text style={styles.title}>Enter the registered email address</Text>
        <Text style={styles.subTitle}>
          We will email you otp to reset password
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#777777"
            value={email}
            onChangeText={value => setEmail(value)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        <View style={{width: '100%'}}>
          <ButtonComponent title={'Send'} onPress={handleSubmit} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    // paddingVertical: 50,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    marginTop: 30,
  },
  subTitle: {
    width: '100%',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 30,
    color: 'grey',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 48,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#333333',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EnterEmailOrPhoneScreen;
