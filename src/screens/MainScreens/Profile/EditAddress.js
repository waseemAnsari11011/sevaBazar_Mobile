import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import CustomHeader from '../../../components/CustomHeader';
import ButtonComponent from '../../../components/Button';
import {
  getProfileDetails,
  saveAddress,
} from '../../../config/redux/actions/profileActions';
import {useDispatch, useSelector} from 'react-redux';
import Loading from '../../../components/Loading';
import {saveData} from '../../../config/redux/actions/storageActions';

const EditAddress = ({navigation}) => {
  const dispatch = useDispatch();
  const {data} = useSelector(state => state.local);

  const {loading, error, response} = useSelector(state => state.profile);

  const [officeName, setofficeName] = useState(data.user.Office_name);
  const [officeAddress, setofficeAddress] = useState(data.user.cabin_no);

  const handleSave = async () => {
    if (officeName && officeAddress) {
      const response = await dispatch(saveAddress(officeName, officeAddress));
      if (response.success) {
        getProfileDetails()
          .then(data => {
            dispatch(saveData('user', data.response));
            navigation.goBack();
          })
          .catch(err => {
            console.log('err', err);
          });
      }
    } else {
      alert('Both Office name and Cabin number are mandatory');
    }
  };

  return (
    <>
      {loading && <Loading />}
      {error && alert(error)}
      <ScrollView contentContainerStyle={styles.container}>
        <CustomHeader navigation={navigation} title="Edit Address" />

        <View style={styles.form}>
          <Text style={styles.label}>Office Name</Text>
          <TextInput
            placeholder="add office name"
            style={styles.input}
            value={officeName}
            onChangeText={setofficeName}
          />

          <Text style={styles.label}>Cabin Number</Text>
          <TextInput
            placeholder="add cabin number"
            style={styles.input}
            value={officeAddress}
            onChangeText={setofficeAddress}
          />

          <ButtonComponent title={'Save Changes..'} onPress={handleSave} />
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: 'white',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#c7c7cc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 4,
    padding: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditAddress;
