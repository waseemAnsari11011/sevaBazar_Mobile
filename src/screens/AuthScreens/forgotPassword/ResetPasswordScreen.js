import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import ButtonComponent from '../../../components/Button';
import CustomHeader from '../../../components/CustomHeader';
import {updatePassword} from '../../../config/redux/actions/passwordAction';
import Loading from '../../../components/Loading';

const ResetPasswordScreen = ({navigation, route}) => {
  const email = route.params.email;
  const otp = route.params.otp;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setloading] = useState(false);

  const handleSubmit = () => {
    setloading(true);
    if (password === confirmPassword) {
      // Handle password reset submission
      // updatePassword({email, otp, password: password})
      //   .then(res => {
      //     setloading(false);
      //     alert(res.message);
      //     navigation.navigate('Login');
      //   })
      //   .catch(err => {
      //     setloading(false);
      //     alert(err.message);
      //   });

      navigation.navigate('Login');
    } else {
      setloading(false);
      alert('Passwords do not match');
    }
  };

  return (
    <KeyboardAvoidingView style={{flex: 1}}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled">
        {loading && <Loading />}
        <CustomHeader title={'Reset Password'} navigation={navigation} />
        <View style={styles.container}>
          <Image
            source={require('../../../assets/images/forgot_password.png')}
            style={styles.image}
          />
          <Text style={styles.title}>Create New Password</Text>
          <Text style={styles.subTitle}>
            We will email you otp to reset password
          </Text>
          <TextInput
            style={styles.input}
            placeholder="New Password"
            placeholderTextColor="#777777"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#777777"
            secureTextEntry={true}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <View style={{width: '100%'}}>
            <ButtonComponent title={'Save'} onPress={handleSubmit} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',

    backgroundColor: '#FFFFFF',
    paddingHorizontal: 40,
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 4,
    marginTop: 30,
  },
  subTitle: {
    width: '85%',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 30,
    color: 'grey',
  },
  input: {
    width: '100%',
    height: 48,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    paddingHorizontal: 20,
    marginBottom: 30,
    fontSize: 16,
    color: '#333333',
  },
  button: {
    width: '100%',
    height: 48,
    borderRadius: 5,
    backgroundColor: '#FF4500',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default ResetPasswordScreen;
