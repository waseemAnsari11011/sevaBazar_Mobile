import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { register } from '../../config/redux/actions/authActions';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../../components/Loading';

const SignupScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const { loading } = useSelector(state => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [pincode, setPincode] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword || !pincode || !contact) {
      alert('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      alert('Password does not match');
      return;
    }

    try {
      console.log("signup api--->>")
      const response = await dispatch(
        register(pincode, contact, email, password)
      );

      if (response && response.success) {
        navigation.navigate('Login');
      } else {
        alert('Signup failed. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again.');
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {loading && <Loading />}
        <View style={styles.header}>
          <Icon name="person-add" size={80} color="#1e90ff" />
          <Text style={styles.title}>Sign Up</Text>
        </View>
        <View style={styles.body}>
          {/* <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
            autoCapitalize="none"
          /> */}
          {/* <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
            autoCapitalize="none"
          /> */}
          <TextInput
            style={styles.input}
            placeholder="Contact number"
            placeholderTextColor="#888"
            value={contact}
            onChangeText={setContact}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Pincode"
            placeholderTextColor="#888"
            value={pincode}
            onChangeText={setPincode}
            autoCapitalize="none"
          />
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
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#888"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
            <Text style={styles.signupButtonText}>Sign Up</Text>
          </TouchableOpacity>
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.loginButton}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  signupButton: {
    backgroundColor: '#1e90ff',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    marginRight: 10,
    color: '#888',
    fontSize: 16,
  },
  loginButton: {
    color: '#1e90ff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SignupScreen;
