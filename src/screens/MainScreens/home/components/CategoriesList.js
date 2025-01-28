import React from 'react';
import {View, Text, Image, TouchableOpacity, FlatList} from 'react-native';
import {baseURL} from '../../../../utils/api';

const CategoriesList = ({category, navigation}) => {
  const renderCategory = ({item}) => (
    <View>
      <TouchableOpacity onPress={() => navigation(item)}>
        <View
          style={{alignSelf: 'baseline', alignItems: 'center', padding: 10}}>
          <View
            style={{
              borderWidth: 1,
              padding: 10,
              borderRadius: 5,
              borderColor: '#00006680',
            }}>
            <Image
              source={{uri: `${baseURL}${item?.images[0]}`}}
              style={{width: 75, height: 75, borderRadius: 10}}
            />
          </View>
          <Text
            style={{
              marginTop: 10,
              fontSize: 13,
              fontWeight: '400',
              color: '#000000',
            }}>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View>
      <Text
        style={{
          fontSize: 18,
          fontWeight: '700',
          marginVertical: 5,
          color: '#000000',
        }}>
        Explore Categories
      </Text>
      <FlatList
        contentContainerStyle={{alignSelf: 'flex-start'}}
        numColumns={Math.ceil(category.length / 2)}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={category}
        renderItem={renderCategory}
      />
    </View>
  );
};

export default CategoriesList;
