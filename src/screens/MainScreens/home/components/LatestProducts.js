import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import ProductCarousel from '../ProductCarousel';
import Icon from '../../../../components/Icons/Icon';

const LatestProducts = ({navigation}) => {
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '700',
            marginVertical: 5,
            color: '#000000',
          }}>
          Latest Products
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('New Arrivals')}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              color: '#000066',
              marginRight: 5,
              fontSize: 15,
              fontWeight: 600,
            }}>
            View all
          </Text>
          <Icon.AntDesign name="right" color="#000066" size={13} />
        </TouchableOpacity>
      </View>
      <ProductCarousel navigation={navigation} />
    </View>
  );
};

export default LatestProducts;
