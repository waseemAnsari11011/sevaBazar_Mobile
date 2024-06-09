import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ButtonComponent from '../../../components/Button';
import ImagePickerComponent from '../../../components/ImagePickerComponent';
import CustomHeader from '../../../components/CustomHeader';
import {useSelector, useDispatch} from 'react-redux';
import {
  getProfileDetails,
  updateProfile,
} from '../../../config/redux/actions/profileActions';
import Loading from '../../../components/Loading';
import {saveData} from '../../../config/redux/actions/storageActions';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../utils/api';

const EditProfile = ({navigation}) => {
  const dispatch = useDispatch();
  const {data} = useSelector(state => state.local);
  // const [formData, setFormData] = useState(new FormData());
  const [phone, setPhone] = useState(data.user.mobile_number);
  const [name, setName] = useState(data.user.name);
  const [email, setEmail] = useState(data.user.email);
  const [loading, setloading] = useState(false);
  const [image, setimage] = useState();

  // console.log('email', data.user.email);

  let url = data.user.image_url;
  // console.log('url', url);

  if (url?.startsWith('http:')) {
    // Replace "http" with "https"
    url = url.replace('http:', 'https:');
  }

  // console.log('image->', image);
  const handleButtonPress = async () => {
    const tokenData = await AsyncStorage.getItem('token');
    const token = JSON.parse(tokenData);
    console.log('token', token);
    setloading(true);
    const formData = new FormData();
    formData.append('mobile_number', phone);
    formData.append('name', name);
    image && formData.append('image', image);

    axios
      .post('https://poon2.xonierconnect.com/api/updateprofile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        setloading(false);
        console.log('Update profile success:', response.data);
        alert(response.data.message);
        getProfileDetails()
          .then(data => {
            dispatch(saveData('user', data.response));
            navigation.goBack();
          })
          .catch(err => {
            console.log('err', err);
          });
      })
      .catch(error => {
        setloading(false);
        if (error.response) {
          console.log('Error status:', error.response.status);
        }
        console.log(error);
      });
  };

  const handleNameChange = text => {
    setName(text);
  };

  const handlePhoneChange = text => {
    setPhone(text);
  };

  const handleOnPress = image => {
    setimage(image);
  };

  return (
    <>
      {loading && <Loading />}
      <CustomHeader navigation={navigation} title="Edit Profile" />
      <View style={{flex: 1, padding: 20, backgroundColor: 'white'}}>
        <ImagePickerComponent handleImage={handleOnPress} url={url} />
        <View style={styles.container}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={handleNameChange}
            value={name}
            placeholder="Enter your name"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            placeholder="Enter your email"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            onChangeText={handlePhoneChange}
            value={phone}
            placeholder="Enter your number"
            keyboardType="email-address"
          />

          <ButtonComponent title="Save Changes" onPress={handleButtonPress} />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 15,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#c7c7cc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 25,
    fontSize: 16,
    color: '#333',
  },
});

export default EditProfile;
