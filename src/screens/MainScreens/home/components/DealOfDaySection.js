import React from 'react';
import {View} from 'react-native';
import DealOfDay from '../DealOfDay';

const DealOfDaySection = ({navigation}) => {
  return (
    <View style={{marginBottom: 15}}>
      <DealOfDay navigation={navigation} />
    </View>
  );
};

export default DealOfDaySection;
