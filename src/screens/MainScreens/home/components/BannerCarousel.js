import React from 'react';
import { View } from 'react-native';
import CustomImageCarousal from '../../../../components/CustomImageCarousalLandscape';

const BannerCarousel = React.memo(({ banners }) => {
  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <View style={{ marginTop: 20, marginHorizontal: 0 }}>
      <CustomImageCarousal data={banners} autoPlay={true} pagination={true} />
    </View>
  );
});

export default BannerCarousel;
