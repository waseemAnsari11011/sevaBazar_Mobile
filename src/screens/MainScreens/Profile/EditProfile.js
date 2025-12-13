import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ButtonComponent from '../../../components/Button';
import ImagePickerComponent from '../../../components/ImagePickerComponent';
import CustomHeader from '../../../components/CustomHeader';
import { useSelector, useDispatch } from 'react-redux';
import { getProfileDetails } from '../../../config/redux/actions/profileActions';
import Loading from '../../../components/Loading';
import { saveData } from '../../../config/redux/actions/storageActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../utils/api';
import { updateCustomer } from '../../../config/redux/actions/customerActions';

const EditProfile = ({ navigation }) => {
  const dispatch = useDispatch();
  const { data } = useSelector(state => state.local);
  const { customer, loading, error } = useSelector(state => state.customer);

  const [phone, setPhone] = useState(data.user.contactNumber);
  const [name, setName] = useState(data.user.name);
  const [email, setEmail] = useState(data.user.email);
  const [image, setImage] = useState();


  let url = data.user.image;
 
  const handleButtonPress = async () => {
    const tokenData = await AsyncStorage.getItem('token');
    const token = JSON.parse(tokenData);

    const formData = new FormData();
    formData.append('contactNumber', phone);
    formData.append('name', name);

    if (image) {
      formData.append('image', {
        uri: image.uri,
        type: image.type,
        name: image.name || image.fileName || 'photo.jpg',
      });
    }

    try {
      // Dispatch the action creator with necessary parameters
    let result = await dispatch(updateCustomer(token, data.user._id, formData));
    console.log("result--->>>", result)
      dispatch(saveData('user', result.user));

      // const profileData = await getProfileDetails();
      // dispatch(saveData('user', profileData.response));
      navigation.goBack();
    } catch (error) {
      console.log('Error status:', error);
      // Handle error if needed
    }
  };


  const handleNameChange = text => {
    setName(text);
  };

  const handlePhoneChange = text => {
    setPhone(text);
  };

  const handleOnPress = image => {
    setImage(image);
  };

  // console.log("customer-->", customer)

  

  return (
    <>
    {loading&&<Loading />}
      <View style={{ flex: 1, padding: 20, backgroundColor: 'white' }}>
        <ImagePickerComponent handleImage={handleOnPress} url={url} />
        <View style={styles.container}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={handleNameChange}
            value={name}
            placeholder="Enter your name"
          />
          {/* <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            placeholder="Enter your email"
            keyboardType="email-address"
            editable={false}
          /> */}
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            onChangeText={handlePhoneChange}
            value={phone}
            placeholder="Enter your number"
            keyboardType="phone-pad"
          />
          <ButtonComponent title="Save Changes" onPress={handleButtonPress} color={'#ff6600'} />
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
