import React from 'react';
import {View} from 'react-native';
import SearchBar from '../../../../components/SearchBar';

const Header = ({scrollToTop}) => {
  return (
    <View style={{paddingTop: 60}}>
      <SearchBar scrollToTop={scrollToTop} />
    </View>
  );
};

export default Header;
