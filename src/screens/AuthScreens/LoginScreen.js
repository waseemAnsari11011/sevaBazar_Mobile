import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import ErrorAlert from '../../components/ErrorAlert';
import Loading from '../../components/Loading';
import { login } from '../../config/redux/actions/authActions';
import { saveData } from '../../config/redux/actions/storageActions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const { loading, error } = useSelector(state => state.auth);

  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // let fcmtoken = null;
    // fcmtoken = await messaging().getToken();

    //
    let fcmtoken = 'token'
    if (fcmtoken) {
      try {
        const body = {
          email: email,
          password: password,
          // device_token: fcmtoken,
        };
        const result = await dispatch(login(body));
        // Do something with the result object
        result.success &&
          dispatch(saveData('token', result.token)) &&
          dispatch(saveData('user', result.user));

        

      } catch (error) {
        console.log(error);
      }
    } else {
      alert('no device token');
    }
  };

  return (
    <>
      {loading && <Loading />}
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon name="person" size={80} color="#1e90ff" />
          <Text style={styles.title}>Log In</Text>
        </View>
        <View style={styles.body}>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity
            style={styles.forgotButton}
            onPress={() => navigation.navigate('Enter Email')}>
            <Text style={styles.forgotButtonText}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupButton}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#1e90ff',
  },
  body: {
    flex: 2,
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  input: {
    backgroundColor: '#F5F5F5',
    height: 50,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotButtonText: {
    color: '#888',
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#1e90ff',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupText: {
    marginRight: 10,
    color: '#888',
    fontSize: 16,
  },
  signupButton: {
    color: '#1e90ff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
