import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import CustomHeader from '../../../components/CustomHeader';
import {useSelector} from 'react-redux';

const Notifications = ({navigation}) => {
  const {orderStatus} = useSelector(state => state.records);
  console.log('orderStatus', orderStatus);
  return (
    <>
      <CustomHeader navigation={navigation} title="Notifications" />
      <View style={{flex: 1, backgroundColor: 'white', padding: 20}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={require('../../../assets/images/profile.png')}
            style={{height: 50, width: 50, marginRight: 15}}
          />
          <View>
            <Text style={{fontWeight: '700', fontSize: 15}}>
              Angelina liked your post
            </Text>
            <Text
              style={{
                marginTop: 5,
                fontWeight: '400',
                fontSize: 12,
                color: 'grey',
              }}>
              5 min ago
            </Text>
          </View>
        </View>
      </View>
    </>
  );
};

export default Notifications;

const styles = StyleSheet.create({});
