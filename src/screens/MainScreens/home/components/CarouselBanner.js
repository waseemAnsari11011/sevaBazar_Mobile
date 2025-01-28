import React from 'react';
import {View} from 'react-native';
import CustomImageCarousal from '../../../../components/CustomImageCarousalLandscape';

const CarouselBanner = ({banners}) => {
  return (
    <View style={{marginTop: 20}}>
      <View style={{marginHorizontal: -20}}>
        <CustomImageCarousal data={banners} autoPlay={true} pagination={true} />
      </View>
    </View>
  );
};

export default CarouselBanner;
